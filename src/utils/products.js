export const ADMIN_PRODUCTS_KEY = 'adminProducts';
export const PRODUCT_OVERRIDES_KEY = 'productOverrides';

export function getAdminProducts() {
  try {
    if (typeof window === 'undefined') return [];
    const raw = localStorage.getItem(ADMIN_PRODUCTS_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function setAdminProducts(products) {
  try {
    if (typeof window === 'undefined') return;
    localStorage.setItem(ADMIN_PRODUCTS_KEY, JSON.stringify(Array.isArray(products) ? products : []));
    window.dispatchEvent(new CustomEvent('productsUpdated', { detail: { source: 'adminProducts' } }));
  } catch {
    // ignore
  }
}

export function getProductOverrides() {
  try {
    if (typeof window === 'undefined') return {};
    const raw = localStorage.getItem(PRODUCT_OVERRIDES_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch {
    return {};
  }
}

export function setProductOverrides(overrides) {
  try {
    if (typeof window === 'undefined') return;
    const safe = overrides && typeof overrides === 'object' ? overrides : {};
    localStorage.setItem(PRODUCT_OVERRIDES_KEY, JSON.stringify(safe));
    window.dispatchEvent(new CustomEvent('productsUpdated', { detail: { source: 'productOverrides' } }));
  } catch {
    // ignore
  }
}

export function mergeProducts(apiProducts) {
  const adminProducts = getAdminProducts();
  const apiList = Array.isArray(apiProducts) ? apiProducts : [];
  const overrides = getProductOverrides();

  // Put admin products first so they appear "yours" in lists, avoid duplicates by id
  const map = new Map();
  for (const p of adminProducts) {
    if (p && p.id != null) map.set(String(p.id), p);
  }
  for (const p of apiList) {
    if (!p || p.id == null) continue;
    const id = String(p.id);
    if (!map.has(id)) map.set(id, p);
  }

  const merged = Array.from(map.values())
    .map((p) => {
      const id = p?.id != null ? String(p.id) : null;
      if (!id) return p;
      const ov = overrides?.[id];
      if (!ov || typeof ov !== 'object') return p;
      if (ov.deleted) return null;
      // Override fields (keep id stable)
      const next = { ...p, ...ov, id: p.id };
      // Normalize price key used across app
      if (next.prase != null && next.price == null) next.price = next.prase;
      if (next.price != null && next.prase == null) next.prase = next.price;
      return next;
    })
    .filter(Boolean);

  return merged;
}


