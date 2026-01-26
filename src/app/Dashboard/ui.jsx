import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Input, InputNumber, Modal, Select, Statistic, Table, message } from 'antd';
import { useNavigate } from 'react-router';
import { useGetUsersQuery } from '../../services/UserApi';
import { getAdminProducts, getProductOverrides, mergeProducts, setAdminProducts, setProductOverrides } from '../../utils/products';

const currency = (n) => `$${Number(n || 0).toFixed(2)}`;

const Dashboard = () => {
  const navigate = useNavigate();
  const { data: apiData } = useGetUsersQuery();

  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [adminProducts, setAdminProductsState] = useState(() => getAdminProducts());
  const [productsTick, setProductsTick] = useState(0);
  const [activeView, setActiveView] = useState('my'); // 'all' | 'my' | 'sold' | 'revenue'
  const [isMonthSalesOpen, setIsMonthSalesOpen] = useState(false);
  const [selectedMonthIdx, setSelectedMonthIdx] = useState(null); // 0..11
  const [isAddEditOpen, setIsAddEditOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '',
    prase: '',
    sku: '',
    status: 'active',
    avatar: '',
    lorem: ''
  });

  useEffect(() => {
    const isAdmin = localStorage.getItem('adminAuth') === 'true';
    if (!isAdmin) navigate('/');
  }, [navigate]);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  useEffect(() => {
    const onProductsUpdated = () => setProductsTick((t) => t + 1);
    window.addEventListener('productsUpdated', onProductsUpdated);
    return () => window.removeEventListener('productsUpdated', onProductsUpdated);
  }, []);

  // Keep localStorage synced
  useEffect(() => {
    setAdminProducts(adminProducts);
  }, [adminProducts]);

  const allProducts = useMemo(() => mergeProducts(apiData), [apiData, adminProducts, productsTick]);

  const purchaseHistory = useMemo(() => {
    try {
      return JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
    } catch {
      return [];
    }
  }, []);

  const totals = useMemo(() => {
    const totalProducts = allProducts.length;
    const myProducts = adminProducts.length;

    let soldQty = 0;
    let revenue = 0;
    for (const receipt of purchaseHistory) {
      revenue += parseFloat(receipt.total || 0);
      for (const it of receipt.items || []) {
        soldQty += Number(it.quantity || 1);
      }
    }

    return { totalProducts, myProducts, soldQty, revenue };
  }, [allProducts.length, adminProducts.length, purchaseHistory]);

  const soldItemsRows = useMemo(() => {
    const map = new Map();
    for (const receipt of purchaseHistory) {
      const date = receipt.date ? new Date(receipt.date).getTime() : 0;
      for (const it of receipt.items || []) {
        const id = String(it.id);
        const prev = map.get(id) || {
          id,
          name: it.name || 'Unknown',
          sku: it.sku || 'N/A',
          avatar: it.avatar || '',
          qty: 0,
          revenue: 0,
          lastSoldAt: 0
        };
        const qty = Number(it.quantity || 1);
        const price = Number(it.price || 0);
        const next = {
          ...prev,
          name: it.name || prev.name,
          sku: it.sku || prev.sku,
          avatar: it.avatar || prev.avatar,
          qty: prev.qty + qty,
          revenue: prev.revenue + price * qty,
          lastSoldAt: Math.max(prev.lastSoldAt, date)
        };
        map.set(id, next);
      }
    }
    return Array.from(map.values()).sort((a, b) => b.qty - a.qty);
  }, [purchaseHistory]);

  const revenueYearData = useMemo(() => {
    const year = new Date().getFullYear();
    const monthRevenue = Array.from({ length: 12 }, () => 0);

    for (const receipt of purchaseHistory) {
      if (!receipt?.date) continue;
      const d = new Date(receipt.date);
      if (Number.isNaN(d.getTime())) continue;
      if (d.getFullYear() !== year) continue;

      const month = d.getMonth(); // 0..11
      const total = parseFloat(receipt.total || 0);
      monthRevenue[month] += Number.isFinite(total) ? total : 0;
    }

    const totalYear = monthRevenue.reduce((a, b) => a + b, 0);

    // classify months into 3 buckets (red/yellow/green) using tertiles of non-zero months
    const nonZero = monthRevenue.filter((v) => v > 0).sort((a, b) => a - b);
    const q1 = nonZero.length ? nonZero[Math.floor((nonZero.length - 1) * 0.33)] : 0;
    const q2 = nonZero.length ? nonZero[Math.floor((nonZero.length - 1) * 0.66)] : 0;

    let red = 0;
    let yellow = 0;
    let green = 0;
    for (const v of monthRevenue) {
      if (v <= 0) continue;
      if (v <= q1) red += v;
      else if (v <= q2) yellow += v;
      else green += v;
    }

    return { year, monthRevenue, totalYear, red, yellow, green, q1, q2 };
  }, [purchaseHistory]);

  const monthSalesByDay = useMemo(() => {
    if (selectedMonthIdx === null || selectedMonthIdx === undefined) return null;
    const year = revenueYearData.year;
    const month = selectedMonthIdx;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const dayQty = Array.from({ length: daysInMonth }, () => 0);

    for (const receipt of purchaseHistory) {
      if (!receipt?.date) continue;
      const d = new Date(receipt.date);
      if (Number.isNaN(d.getTime())) continue;
      if (d.getFullYear() !== year) continue;
      if (d.getMonth() !== month) continue;

      const dayIndex = d.getDate() - 1; // 0-based
      let qty = 0;
      for (const it of receipt.items || []) {
        qty += Number(it.quantity || 1);
      }
      dayQty[dayIndex] += qty;
    }

    const maxQty = Math.max(1, ...dayQty);
    const totalQty = dayQty.reduce((a, b) => a + b, 0);
    return { year, month, daysInMonth, dayQty, maxQty, totalQty };
  }, [purchaseHistory, revenueYearData.year, selectedMonthIdx]);

  // Speedometer scale: use max yearly revenue from history as target (fallback 100)
  const revenueScale = useMemo(() => {
    const map = new Map();
    for (const receipt of purchaseHistory) {
      if (!receipt?.date) continue;
      const d = new Date(receipt.date);
      if (Number.isNaN(d.getTime())) continue;
      const y = d.getFullYear();
      const total = parseFloat(receipt.total || 0);
      map.set(y, (map.get(y) || 0) + (Number.isFinite(total) ? total : 0));
    }
    const yearlyTotals = Array.from(map.values()).filter((v) => Number.isFinite(v));
    const maxYear = Math.max(0, ...yearlyTotals);
    const cur = revenueYearData.totalYear || 0;
    const base = Math.max(100, maxYear, cur);
    const target = cur > maxYear ? base * 1.2 : base;
    return { target: Math.max(100, target), maxYear };
  }, [purchaseHistory, revenueYearData.totalYear]);

  // Gauge (full circle) SVG: red/yellow/green zones + needle
  const gaugeSvg = useMemo(() => {
    const size = isMobile ? 240 : 300;
    const cx = size / 2;
    const cy = size / 2;
    const r = isMobile ? 86 : 108;
    const stroke = isMobile ? 18 : 20;
    const circ = 2 * Math.PI * r;

    const clamp01 = (x) => Math.max(0, Math.min(1, x));
    const value = revenueYearData.totalYear || 0;
    const max = revenueScale.target || 100;
    const pct = max > 0 ? clamp01(value / max) : 0;

    // Standard zones on the full ring (0-50 red, 50-80 yellow, 80-100 green)
    const zones = [
      { key: 'red', frac: 0.5, color: '#ef4444' },
      { key: 'yellow', frac: 0.3, color: '#f59e0b' },
      { key: 'green', frac: 0.2, color: '#22c55e' }
    ];

    // Needle angle: start at top (-90deg) and rotate clockwise
    const angle = (-90 + 360 * pct) * (Math.PI / 180);
    const needleLen = r - stroke * 0.9;
    const needleEnd = {
      x: cx + needleLen * Math.cos(angle),
      y: cy + needleLen * Math.sin(angle)
    };

    return (
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#e5e7eb" strokeWidth={stroke} />

        {/* Zones */}
        {(() => {
          let acc = 0;
          return zones.map((z) => {
            const dash = circ * z.frac;
            const dashoffset = circ * (1 - acc);
            acc += z.frac;
            return (
              <circle
                key={z.key}
                cx={cx}
                cy={cy}
                r={r}
                fill="none"
                stroke={z.color}
                strokeWidth={stroke}
                strokeLinecap="round"
                strokeDasharray={`${dash} ${circ - dash}`}
                strokeDashoffset={dashoffset}
                transform={`rotate(-90 ${cx} ${cy})`}
              />
            );
          });
        })()}

        {/* Needle */}
        <line x1={cx} y1={cy} x2={needleEnd.x} y2={needleEnd.y} stroke="#111827" strokeWidth={3} strokeLinecap="round" />
        <circle cx={cx} cy={cy} r={7} fill="#111827" />
        <circle cx={cx} cy={cy} r={3.5} fill="#ffffff" opacity={0.9} />

        {/* Labels */}
        <text x={cx} y={cy - 8} textAnchor="middle" fontSize="12" fill="#6b7280">
          Revenue {revenueYearData.year}
        </text>
        <text x={cx} y={cy + 18} textAnchor="middle" fontSize={isMobile ? 18 : 20} fill="#111827" fontWeight="700">
          {currency(value)}
        </text>
        <text x={cx} y={size - 10} textAnchor="middle" fontSize="11" fill="#9ca3af">
          0 — {currency(revenueScale.target)}
        </text>
      </svg>
    );
  }, [isMobile, revenueScale.target, revenueYearData.totalYear, revenueYearData.year]);

  const monthLabels = useMemo(() => ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'], []);
  const openMonthSales = (idx) => {
    setSelectedMonthIdx(idx);
    setIsMonthSalesOpen(true);
  };

  // Chart 1: my products by status
  const myByStatus = useMemo(() => {
    const map = new Map();
    for (const p of adminProducts) {
      const key = (p.status || 'active').toLowerCase();
      map.set(key, (map.get(key) || 0) + 1);
    }
    const entries = Array.from(map.entries()).map(([k, v]) => ({ key: k, label: k, value: v }));
    return entries.sort((a, b) => b.value - a.value);
  }, [adminProducts]);

  // Chart 2: top sold products (by quantity)
  const topSold = useMemo(() => {
    const map = new Map();
    for (const receipt of purchaseHistory) {
      for (const it of receipt.items || []) {
        const id = String(it.id);
        map.set(id, { id, name: it.name, qty: (map.get(id)?.qty || 0) + Number(it.quantity || 1) });
      }
    }
    return Array.from(map.values()).sort((a, b) => b.qty - a.qty).slice(0, 6);
  }, [purchaseHistory]);

  const openAdd = () => {
    setEditingId(null);
    setForm({ name: '', prase: '', sku: '', status: 'active', avatar: '', lorem: '' });
    setIsAddEditOpen(true);
  };

  const openEdit = (product) => {
    setEditingId(product.id);
    setForm({
      name: product.name || product.title || '',
      prase: String(product.prase ?? product.price ?? ''),
      sku: product.sku || '',
      status: product.status || 'active',
      avatar: product.avatar || '',
      lorem: product.lorem || ''
    });
    setIsAddEditOpen(true);
  };

  const handlePickFile = () => fileInputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      message.error('Image size should be less than 5MB');
      return;
    }
    const reader = new FileReader();
    reader.onloadend = () => setForm((p) => ({ ...p, avatar: reader.result }));
    reader.readAsDataURL(file);
  };

  const saveProduct = () => {
    if (!form.name.trim() || !String(form.prase).trim()) {
      message.error('Name and Price are required');
      return;
    }

    const praseNum = Number(form.prase);
    if (Number.isNaN(praseNum) || praseNum < 0) {
      message.error('Price must be a number');
      return;
    }

    if (editingId) {
      const idStr = String(editingId);
      const isAdminProduct = idStr.startsWith('admin-') || adminProducts.some((p) => String(p.id) === idStr);
      if (isAdminProduct) {
        setAdminProductsState((prev) =>
          prev.map((p) =>
            String(p.id) === idStr
              ? { ...p, name: form.name, prase: praseNum, sku: form.sku, status: form.status, avatar: form.avatar, lorem: form.lorem }
              : p
          )
        );
      } else {
        const overrides = getProductOverrides();
        overrides[idStr] = {
          ...(overrides[idStr] || {}),
          deleted: false,
          name: form.name,
          prase: praseNum,
          price: praseNum,
          sku: form.sku,
          status: form.status,
          avatar: form.avatar,
          lorem: form.lorem
        };
        setProductOverrides(overrides);
        setProductsTick((t) => t + 1);
      }
      message.success('Product updated');
    } else {
      const newId = `admin-${Date.now()}`;
      setAdminProductsState((prev) => [
        {
          id: newId,
          name: form.name,
          prase: praseNum,
          sku: form.sku || `SKU-${String(Date.now()).slice(-6)}`,
          status: form.status || 'active',
          avatar: form.avatar || '',
          lorem: form.lorem || '',
          data: new Date().toISOString()
        },
        ...prev
      ]);
      message.success('Product added');
    }
    setIsAddEditOpen(false);
  };

  const deleteProduct = (id) => {
    Modal.confirm({
      title: 'Delete product?',
      content: 'This will remove it from the products list.',
      okText: 'Delete',
      okButtonProps: { danger: true },
      cancelText: 'Cancel',
      onOk: () => {
        const idStr = String(id);
        const isAdminProduct = idStr.startsWith('admin-') || adminProducts.some((p) => String(p.id) === idStr);
        if (isAdminProduct) {
          setAdminProductsState((prev) => prev.filter((p) => String(p.id) !== idStr));
        } else {
          const overrides = getProductOverrides();
          overrides[idStr] = { ...(overrides[idStr] || {}), deleted: true };
          setProductOverrides(overrides);
          setProductsTick((t) => t + 1);
        }
        message.success('Deleted');
      }
    });
  };

  const productColumns = [
    {
      title: 'Product',
      key: 'product',
      render: (_, p) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
            {p.avatar ? (
              <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" />
            ) : null}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 truncate">{p.name || p.title || 'Untitled'}</div>
            <div className="text-xs text-gray-500 truncate">SKU: {p.sku || 'N/A'}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Price',
      dataIndex: 'prase',
      key: 'price',
      render: (v) => <span className="font-semibold text-[#46A358]">{currency(v)}</span>
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (v) => <span className="text-sm text-gray-700 capitalize">{v || 'active'}</span>
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, p) => (
        <div className="flex gap-2">
          <button
            onClick={() => openEdit(p)}
            className="px-3 py-1.5 rounded-lg border border-gray-200 hover:border-[#46A358] hover:text-[#46A358] transition-colors text-sm font-semibold"
          >
            Edit
          </button>
          <button
            onClick={() => deleteProduct(p.id)}
            className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 transition-colors text-sm font-semibold"
          >
            Delete
          </button>
        </div>
      )
    }
  ];

  const soldColumns = [
    {
      title: 'Product',
      key: 'product',
      render: (_, p) => (
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0">
            {p.avatar ? <img src={p.avatar} alt={p.name} className="w-full h-full object-cover" /> : null}
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 truncate">{p.name}</div>
            <div className="text-xs text-gray-500 truncate">SKU: {p.sku}</div>
          </div>
        </div>
      )
    },
    {
      title: 'Sold qty',
      dataIndex: 'qty',
      key: 'qty',
      render: (v) => <span className="font-semibold text-gray-900">{v}</span>
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (v) => <span className="font-semibold text-[#46A358]">{currency(v)}</span>
    },
    {
      title: 'Last sold',
      dataIndex: 'lastSoldAt',
      key: 'lastSoldAt',
      render: (v) =>
        v ? (
          <span className="text-sm text-gray-700">{new Date(v).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        ) : (
          <span className="text-sm text-gray-500">—</span>
        )
    }
  ];

  const tableTitle =
    activeView === 'all'
      ? 'All products'
      : activeView === 'sold'
        ? 'Sold items'
        : activeView === 'revenue'
          ? 'Revenue (year)'
          : 'My products';
  const tableData =
    activeView === 'all' ? allProducts : activeView === 'sold' ? soldItemsRows : adminProducts;
  const tableColumns = activeView === 'sold' ? soldColumns : productColumns;

  const maxStatus = Math.max(1, ...myByStatus.map((x) => x.value));
  const maxSold = Math.max(1, ...topSold.map((x) => x.qty));

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900" style={{ fontFamily: 'Montserrat-Bold, sans-serif' }}>
              Dashboard
            </h1>
            <p className="text-gray-600 mt-1" style={{ fontFamily: 'Inter-Regular, sans-serif' }}>
              Manage your products, view sales and stats
            </p>
          </div>
          <button
            onClick={openAdd}
            className="bg-[#46A358] hover:bg-[#3a8a47] text-white px-4 py-2.5 rounded-xl font-semibold transition-colors w-full sm:w-auto"
            style={{ fontFamily: 'Inter-SemiBold, sans-serif' }}
          >
            + Add Product
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <button
            type="button"
            onClick={() => setActiveView('all')}
            className={`text-left bg-white rounded-2xl border p-4 transition-colors ${
              activeView === 'all' ? 'border-[#46A358] bg-[#46A358]/5' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <Statistic title="Total products" value={totals.totalProducts} />
          </button>
          <button
            type="button"
            onClick={() => setActiveView('my')}
            className={`text-left bg-white rounded-2xl border p-4 transition-colors ${
              activeView === 'my' ? 'border-[#46A358] bg-[#46A358]/5' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <Statistic title="My products" value={totals.myProducts} />
          </button>
          <button
            type="button"
            onClick={() => setActiveView('sold')}
            className={`text-left bg-white rounded-2xl border p-4 transition-colors ${
              activeView === 'sold' ? 'border-[#46A358] bg-[#46A358]/5' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <Statistic title="Sold items" value={totals.soldQty} />
          </button>
          <button
            type="button"
            onClick={() => setActiveView('revenue')}
            className={`text-left bg-white rounded-2xl border p-4 transition-colors ${
              activeView === 'revenue' ? 'border-[#46A358] bg-[#46A358]/5' : 'border-gray-100 hover:border-gray-200'
            }`}
          >
            <Statistic title="Revenue" value={currency(totals.revenue)} />
          </button>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h2 className="font-bold text-gray-900 mb-3" style={{ fontFamily: 'Montserrat-Bold, sans-serif' }}>
              My products (by status)
            </h2>
            {myByStatus.length === 0 ? (
              <p className="text-gray-500 text-sm">No products yet</p>
            ) : (
              <div className="space-y-3">
                {myByStatus.map((x) => (
                  <div key={x.key}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="capitalize text-gray-700">{x.label}</span>
                      <span className="font-semibold text-gray-900">{x.value}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#46A358]"
                        style={{ width: `${Math.round((x.value / maxStatus) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-2xl border border-gray-100 p-4">
            <h2 className="font-bold text-gray-900 mb-3" style={{ fontFamily: 'Montserrat-Bold, sans-serif' }}>
              Top selling products
            </h2>
            {topSold.length === 0 ? (
              <p className="text-gray-500 text-sm">No sales yet</p>
            ) : (
              <div className="space-y-3">
                {topSold.map((x) => (
                  <div key={x.id}>
                    <div className="flex justify-between text-sm mb-1 gap-3">
                      <span className="text-gray-700 truncate">{x.name}</span>
                      <span className="font-semibold text-gray-900 flex-shrink-0">{x.qty}</span>
                    </div>
                    <div className="h-2.5 bg-gray-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-[#46A358]"
                        style={{ width: `${Math.round((x.qty / maxSold) * 100)}%` }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Table / Revenue panel */}
        <div className="bg-white rounded-2xl border border-gray-100 p-4 overflow-x-auto">
          <h2 className="font-bold text-gray-900 mb-3" style={{ fontFamily: 'Montserrat-Bold, sans-serif' }}>
            {tableTitle}
          </h2>
          {activeView === 'revenue' ? (
            <div className="flex flex-col md:flex-row gap-6 items-center md:items-start">
              <div className="flex items-center justify-center bg-gray-50 rounded-2xl border border-gray-100 p-4 w-full md:w-auto">
                {gaugeSvg}
              </div>

              <div className="flex-1 w-full">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                  <div className="bg-white rounded-2xl border border-gray-100 p-4">
                    <div className="text-sm text-gray-500">Low months</div>
                    <div className="text-xl font-bold text-gray-900">{currency(revenueYearData.red)}</div>
                    <div className="mt-2 h-2 rounded-full bg-[#ef4444]/20 overflow-hidden">
                      <div
                        className="h-full bg-[#ef4444]"
                        style={{
                          width: `${Math.round((revenueYearData.red / Math.max(1, revenueYearData.totalYear)) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-4">
                    <div className="text-sm text-gray-500">Mid months</div>
                    <div className="text-xl font-bold text-gray-900">{currency(revenueYearData.yellow)}</div>
                    <div className="mt-2 h-2 rounded-full bg-[#f59e0b]/20 overflow-hidden">
                      <div
                        className="h-full bg-[#f59e0b]"
                        style={{
                          width: `${Math.round((revenueYearData.yellow / Math.max(1, revenueYearData.totalYear)) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                  <div className="bg-white rounded-2xl border border-gray-100 p-4">
                    <div className="text-sm text-gray-500">High months</div>
                    <div className="text-xl font-bold text-gray-900">{currency(revenueYearData.green)}</div>
                    <div className="mt-2 h-2 rounded-full bg-[#22c55e]/20 overflow-hidden">
                      <div
                        className="h-full bg-[#22c55e]"
                        style={{
                          width: `${Math.round((revenueYearData.green / Math.max(1, revenueYearData.totalYear)) * 100)}%`
                        }}
                      />
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-bold text-gray-900">Monthly revenue</div>
                    <div className="text-sm text-gray-500">Year: {revenueYearData.year}</div>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-sm">
                    {revenueYearData.monthRevenue.map((v, idx) => {
                      const color =
                        v <= 0 ? 'bg-gray-200' : v <= revenueYearData.q1 ? 'bg-red-500' : v <= revenueYearData.q2 ? 'bg-amber-500' : 'bg-green-500';
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => openMonthSales(idx)}
                          className="flex items-center justify-between gap-2 bg-white rounded-xl border border-gray-100 px-3 py-2 hover:border-[#46A358] hover:bg-[#46A358]/5 transition-colors text-left"
                          title={`Open daily sales for ${monthLabels[idx]} ${revenueYearData.year}`}
                        >
                          <span className="text-gray-700">{monthLabels[idx]}</span>
                          <span className="font-semibold text-gray-900">{currency(v)}</span>
                          <span className={`w-2.5 h-2.5 rounded-full ${color}`} aria-hidden="true" />
                        </button>
                      );
                    })}
                  </div>
                  <div className="mt-3 text-xs text-gray-500">
                    Colors are calculated from this year’s monthly revenue (red = low, yellow = mid, green = high).
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Table
              rowKey="id"
              dataSource={tableData}
              columns={tableColumns}
              pagination={{ pageSize: isMobile ? 5 : 8 }}
              size={isMobile ? 'small' : 'middle'}
              scroll={isMobile ? { x: 720 } : undefined}
            />
          )}
        </div>
      </div>

      {/* Add/Edit modal */}
      <Modal
        open={isAddEditOpen}
        onCancel={() => setIsAddEditOpen(false)}
        onOk={saveProduct}
        okText={editingId ? 'Save' : 'Add'}
        cancelText="Cancel"
        okButtonProps={{ className: 'bg-[#46A358] hover:bg-[#3a8a47] text-white font-semibold' }}
        title={<span style={{ fontFamily: 'Montserrat-Bold, sans-serif' }}>{editingId ? 'Edit product' : 'Add product'}</span>}
        width={720}
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Name *</label>
            <Input value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Price *</label>
            <InputNumber
              value={Number(form.prase || 0)}
              onChange={(v) => setForm((p) => ({ ...p, prase: v }))}
              className="w-full"
              min={0}
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">SKU</label>
            <Input value={form.sku} onChange={(e) => setForm((p) => ({ ...p, sku: e.target.value }))} />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Status</label>
            <Select
              value={form.status}
              onChange={(v) => setForm((p) => ({ ...p, status: v }))}
              className="w-full"
              options={[
                { value: 'active', label: 'Active' },
                { value: 'draft', label: 'Draft' },
                { value: 'out-of-stock', label: 'Out of stock' }
              ]}
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1">Image</label>
            <div className="flex gap-2">
              <Input
                value={form.avatar}
                onChange={(e) => setForm((p) => ({ ...p, avatar: e.target.value }))}
                placeholder="Paste image URL or upload"
              />
              <button
                type="button"
                onClick={handlePickFile}
                className="px-3 rounded-lg border border-gray-200 hover:border-[#46A358] hover:text-[#46A358] transition-colors font-semibold"
              >
                Upload
              </button>
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
            </div>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-semibold text-gray-700 mb-1">Description</label>
            <Input.TextArea
              rows={3}
              value={form.lorem}
              onChange={(e) => setForm((p) => ({ ...p, lorem: e.target.value }))}
              maxLength={300}
              showCount
            />
          </div>
        </div>
      </Modal>

      {/* Month daily sales modal */}
      <Modal
        open={isMonthSalesOpen}
        onCancel={() => setIsMonthSalesOpen(false)}
        footer={null}
        width={900}
        title={
          <span style={{ fontFamily: 'Montserrat-Bold, sans-serif' }}>
            Daily sales — {selectedMonthIdx !== null ? monthLabels[selectedMonthIdx] : ''} {revenueYearData.year}
          </span>
        }
      >
        {monthSalesByDay ? (
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
              <div className="text-sm text-gray-600">
                Total sold items: <span className="font-semibold text-gray-900">{monthSalesByDay.totalQty}</span>
              </div>
              <div className="flex flex-wrap items-center gap-3 text-xs">
                <span className="inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-red-500" /> 0 sold
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" /> 1–14 sold
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-green-500" /> 15+ sold
                </span>
              </div>
            </div>

            <div className="bg-gray-50 rounded-2xl border border-gray-100 p-4 overflow-x-auto">
              <div className="min-w-[720px]">
                <div className="flex items-end gap-1 h-44">
                  {monthSalesByDay.dayQty.map((qty, idx) => {
                    const heightPct = Math.round((qty / monthSalesByDay.maxQty) * 100);
                    const barColor = qty === 0 ? 'bg-red-500/60' : qty >= 15 ? 'bg-green-500' : 'bg-amber-500';
                    return (
                      <div key={idx} className="flex flex-col items-center justify-end w-5">
                        <div
                          className={`w-3 rounded-t-md ${barColor}`}
                          style={{ height: `${Math.max(4, Math.round((heightPct / 100) * 160))}px` }}
                          title={`Day ${idx + 1}: ${qty} sold`}
                        />
                        <div className="text-[10px] text-gray-500 mt-1">{idx + 1}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-gray-500">No data</div>
        )}
      </Modal>
    </div>
  );
};

export default Dashboard;


