// Home.tsx
import React, { useState, useEffect, useMemo } from 'react';
import CarouselANT from '../../components/carousel';
import { Slider } from 'antd';
import img from '../../assets/img1.png';
import { useDeleteuserMutation, useGetUsersQuery } from '../../services/UserApi';
import { Pagination, Spin } from 'antd';
import CardProducks from '../../components/cardProducks';
import { Link } from 'react-router';
import { FaSearch } from 'react-icons/fa';

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(9);
  const [productType, setProductType] = useState('all'); // all, new, sale
  
  // Set page size based on screen width
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setPageSize(10); // Mobile: 10 items
      } else {
        setPageSize(9); // Desktop: 9 items
      }
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  const { data: allData, isLoading, error, refetch } = useGetUsersQuery();
  let [deleteUser] = useDeleteuserMutation();
  
  // Filter states
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [priceRange, setPriceRange] = useState([1, 1000]);
  const [selectedSize, setSelectedSize] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('default');
  const [minPriceInput, setMinPriceInput] = useState('');
  const [maxPriceInput, setMaxPriceInput] = useState('');

  const [heartItems, setHeartItems] = useState([]);
  
  let HeartLiked = JSON.parse(localStorage.getItem('Heart')) || [];


  async function handleDelete(id) {
    try {
      await deleteUser(id).unwrap();
      refetch();
    } catch (error) {
      console.error('Delete error:', error);
      messageApi.error('Failed to delete product');
    }
  }

  // Calculate categories from products
  const categories = useMemo(() => {
    if (!allData) return [];
    
    const categoryNames = [
      'House Plants',
      'Potter Plants', 
      'Seeds',
      'Small Plants',
      'Big Plants',
      'Succulents',
      'Terrariums',
      'Gardening',
      'Accessories'
    ];
    
    // Distribute products across categories
    return categoryNames.map((name, index) => {
      const categoryProducts = allData.filter((_, i) => i % categoryNames.length === index);
      return {
        name,
        count: categoryProducts.length
      };
    });
  }, [allData]);

  // Calculate sizes from products
  const sizes = useMemo(() => {
    if (!allData) return [];
    
    const sizeNames = ['Small', 'Medium', 'Large'];
    
    // Distribute products across sizes based on price
    return sizeNames.map((name, index) => {
      const price = parseFloat(allData[0]?.prase || 0);
      let count = 0;
      
      if (name === 'Small') {
        count = allData.filter(p => parseFloat(p.prase) < 100).length;
      } else if (name === 'Medium') {
        count = allData.filter(p => parseFloat(p.prase) >= 100 && parseFloat(p.prase) < 200).length;
      } else {
        count = allData.filter(p => parseFloat(p.prase) >= 200).length;
      }
      
      return { name, count };
    });
  }, [allData]);

  // Fixed price range
  const minMaxPrice = [1, 1000];

  // Filter products
  const filteredData = useMemo(() => {
    if (!allData) return [];

    let filtered = [...allData];

    // Search filter
    if (searchQuery.trim()) {
      filtered = filtered.filter(p => 
        p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.lorem?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Filter by product type (All Plants, New Arrivals, Sale)
    if (productType === 'new') {
      // New arrivals - first 30% of products
      const newCount = Math.floor(allData.length * 0.3);
      filtered = filtered.filter((_, i) => i < newCount);
    } else if (productType === 'sale') {
      // Sale - products with price less than average
      const prices = allData.map(p => parseFloat(p.prase || 0));
      const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
      filtered = filtered.filter(p => parseFloat(p.prase || 0) < avgPrice);
    }

    // Filter by category
    if (selectedCategory !== 'all') {
      const categoryIndex = categories.findIndex(c => c.name === selectedCategory);
      if (categoryIndex !== -1) {
        filtered = filtered.filter((_, i) => i % categories.length === categoryIndex);
      }
    }

    // Filter by price
    filtered = filtered.filter(p => {
      const price = parseFloat(p.prase || 0);
      return price >= priceRange[0] && price <= priceRange[1];
    });

    // Filter by size
    if (selectedSize !== 'all') {
      filtered = filtered.filter(p => {
        const price = parseFloat(p.prase || 0);
        if (selectedSize === 'Small') return price < 100;
        if (selectedSize === 'Medium') return price >= 100 && price < 200;
        if (selectedSize === 'Large') return price >= 200;
        return true;
      });
    }

    // Sort products
    if (sortBy === 'price-low') {
      filtered.sort((a, b) => parseFloat(a.prase || 0) - parseFloat(b.prase || 0));
    } else if (sortBy === 'price-high') {
      filtered.sort((a, b) => parseFloat(b.prase || 0) - parseFloat(a.prase || 0));
    } else if (sortBy === 'name-asc') {
      filtered.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    } else if (sortBy === 'name-desc') {
      filtered.sort((a, b) => (b.name || '').localeCompare(a.name || ''));
    } else if (sortBy === 'default') {
      // Randomize order when default sorting is selected
      filtered = [...filtered].sort(() => Math.random() - 0.5);
    }

    return filtered;
  }, [allData, searchQuery, productType, selectedCategory, priceRange, selectedSize, sortBy, categories]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    return filteredData.slice(startIndex, endIndex);
  }, [filteredData, currentPage, pageSize]);

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, priceRange, selectedSize, productType, searchQuery, sortBy]);

  // Initialize input values
  useEffect(() => {
    setMinPriceInput(priceRange[0].toString());
    setMaxPriceInput(priceRange[1].toString());
  }, []);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

 

  const isInHeart = (id) => {
    return heartItems.some(item => item.id === id);
  };

  function Liked(el) {
  const savedHeart = JSON.parse(localStorage.getItem('Heart')) || [];
  const isAlreadyLiked = savedHeart.find((item) => item.id === el.id);
  
  let updatedHeart;
  
  if (isAlreadyLiked) {
    updatedHeart = savedHeart.filter((item) => item.id !== el.id);
  } else {
    const newLikes = {
      id: el.id,
      name: el.name,
      prase: el.prase,
      avatar: el.avatar,
      lorem: el.lorem,
      data: el.data
    };
    updatedHeart = [...savedHeart, newLikes];
  }
  
  // Сохраняем в localStorage
  localStorage.setItem('Heart', JSON.stringify(updatedHeart));
  
  // Обновляем состояние
  setHeartItems(updatedHeart);
  
  // Отправляем кастомное событие
  window.dispatchEvent(new CustomEvent('heartUpdated', {
    detail: { heartItems: updatedHeart }
  }));
  
  refetch();
}
  useEffect(() => {
    const savedHeart = localStorage.getItem('Heart');
    if (savedHeart) {
      setHeartItems(JSON.parse(savedHeart));
    }
  }, [])


   const [Shop, setShop] = useState([]);
  
   function ShopFunction(el) {
    const savedCart = JSON.parse(localStorage.getItem('Cart')) || []; 
    const isAlreadyInCart = savedCart.find((item) => item.id === el.id);
  
    let updatedCart;
  
      if (isAlreadyInCart) {
        updatedCart = savedCart.filter((item) => item.id !== el.id);
    } else {
      const newItem = {
        id: el.id,
        name: el.name,
        price: el.prase, 
        avatar: el.avatar,
        lorem: el.lorem,
        data: el.data,
        sku: el.sku,
        status: el.status,
        quantity: 1
      };
      updatedCart = [...savedCart, newItem];
    }
    
    localStorage.setItem('Cart', JSON.stringify(updatedCart));
    setShop(updatedCart);
    
    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { cartItems: updatedCart }
    }));
  
    refetch();
  }
  
  useEffect(() => {
    const savedCart = localStorage.getItem('Cart');
    if (savedCart) {
      setShop(JSON.parse(savedCart));
    }
  }, []);
  
  const isInCart = (id) => {
    return Shop.some(item => item.id === id);
  };
  

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500">Error loading data</div>;
  }

  return (
    <div>
      <CarouselANT />
      <div className='flex flex-col md:flex-row gap-8 justify-between items-start my-8'>
        {/* Sidebar - Hidden on mobile */}
        <div className='hidden md:block bg-[#FBFBFB] w-[30%]'>
          <div className='p-4 '>
            <p className='font-bold text-black text-2xl'>Categories</p>
            <button
              onClick={() => setSelectedCategory('all')}
                className={`w-full flex justify-between my-3 text-left hover:text-[#46A358] transition-colors ${
                selectedCategory === 'all' ? 'text-[#46A358] font-black' : ''
              }`}
            >
              All Products <span className='font-medium'>({allData?.length || 0})</span>
            </button>
            {categories.map((category, index) => (
              <button
                key={index}
                onClick={() => setSelectedCategory(category.name)}
                className={`w-full flex justify-between my-3 text-left hover:text-[#46A358] transition-colors ${
                selectedCategory === category.name ? 'text-[#46A358] font-black' : ''
              }`}
              >
                {category.name} <span className='font-medium'>({category.count})</span>
              </button>
            ))}
            
            <p className='font-bold text-black text-2xl mt-5'>Price Range</p>
            <Slider
              range
              min={minMaxPrice[0]}
              max={minMaxPrice[1]}
              value={priceRange}
              onChange={(values) => {
                setPriceRange(values);
                setMinPriceInput(values[0].toString());
                setMaxPriceInput(values[1].toString());
              }}
              step={10}
            />
            <div className='flex gap-2 mt-4'>
              <div className='flex-1'>
                <label className='text-sm text-gray-600 mb-1 block'>Min Price</label>
                <input
                  type='number'
                  value={minPriceInput}
                  onChange={(e) => {
                    setMinPriceInput(e.target.value);
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 0 && value <= 1000) {
                      setPriceRange([value, priceRange[1]]);
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      setMinPriceInput('');
                      // Keep current priceRange, don't change it
                    } else {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                        const validatedValue = Math.max(0, Math.min(1000, value));
                        if (validatedValue > priceRange[1]) {
                          setPriceRange([priceRange[1], priceRange[1]]);
                          setMinPriceInput(priceRange[1].toString());
                        } else {
                          setPriceRange([validatedValue, priceRange[1]]);
                          setMinPriceInput(validatedValue.toString());
                        }
                      } else {
                        setMinPriceInput('');
                      }
                    }
                  }}
                  className='w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#46A358] focus:outline-none transition-colors'
                  placeholder='0'
                />
              </div>
              <div className='flex-1'>
                <label className='text-sm text-gray-600 mb-1 block'>Max Price</label>
                <input
                  type='number'
                  value={maxPriceInput}
                  onChange={(e) => {
                    setMaxPriceInput(e.target.value);
                    const value = parseInt(e.target.value);
                    if (!isNaN(value) && value >= 0 && value <= 1000) {
                      setPriceRange([priceRange[0], value]);
                    }
                  }}
                  onBlur={(e) => {
                    if (e.target.value === '') {
                      setMaxPriceInput('');
                      // Keep current priceRange, don't change it
                    } else {
                      const value = parseInt(e.target.value);
                      if (!isNaN(value)) {
                        const validatedValue = Math.max(0, Math.min(1000, value));
                        if (validatedValue < priceRange[0]) {
                          setPriceRange([priceRange[0], priceRange[0]]);
                          setMaxPriceInput(priceRange[0].toString());
                        } else {
                          setPriceRange([priceRange[0], validatedValue]);
                          setMaxPriceInput(validatedValue.toString());
                        }
                      } else {
                        setMaxPriceInput('');
                      }
                    }
                  }}
                  className='w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-[#46A358] focus:outline-none transition-colors'
                  placeholder='0'
                />
              </div>
            </div>
            <p className='font-bold text-xl mt-3'>Price: <span className='text-[#46A358]'> ${priceRange[0]} - ${priceRange[1]}</span></p>
            
            <p className='font-bold text-black text-2xl mt-5'>Size</p>
            <button
              onClick={() => setSelectedSize('all')}
              className={`w-full flex justify-between my-3 text-left hover:text-[#46A358] transition-colors ${
                selectedSize === 'all' ? 'text-[#46A358] font-black' : ''
              }`}
            >
              All Sizes <span className='font-medium'>({allData?.length || 0})</span>
            </button>
            {sizes.map((size, index) => (
              <button
                key={index}
                onClick={() => setSelectedSize(size.name)}
                className={`w-full flex justify-between my-3 text-left hover:text-[#46A358] transition-colors ${
                  selectedSize === size.name ? 'text-[#46A358] font-black' : ''
                }`}
              >
                {size.name} <span className='font-medium'>({size.count})</span>
              </button>
            ))}

          </div>
          <div>
            <img src={img} alt="img" />
          </div>

        </div>
        <div className='w-[100%] md:w-[70%]'>
          {/* Search Bar */}
          <div className='mb-6'>
            <div className='relative'>
              <FaSearch className='absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg' />
              <input
                type='text'
                placeholder='Search plants...'
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className='w-full pl-12 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:border-[#46A358] focus:outline-none transition-colors text-lg'
              />
            </div>
          </div>

          {/* Product Type Filter and Sort */}
          <div className='flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-4 border-b-2 border-gray-100'>
            {/* Mobile: Full width filter buttons */}
            <div className='flex gap-4 md:gap-6 items-center flex-wrap w-full md:w-auto'>
              <button
                onClick={() => setProductType('all')}
                className={`font-semibold text-base md:text-lg border-b-2 pb-2 px-1 transition-all duration-300 ${
                  productType === 'all'
                    ? 'text-[#46A358] border-[#46A358]'
                    : 'text-gray-700 border-transparent hover:text-[#46A358] hover:border-[#46A358]'
                }`}
              >
                All Plants
              </button>
              <button
                onClick={() => setProductType('new')}
                className={`font-semibold text-base md:text-lg border-b-2 pb-2 px-1 transition-all duration-300 ${
                  productType === 'new'
                    ? 'text-[#46A358] border-[#46A358]'
                    : 'text-gray-700 border-transparent hover:text-[#46A358] hover:border-[#46A358]'
                }`}
              >
                New Arrivals
              </button>
              <button
                onClick={() => setProductType('sale')}
                className={`font-semibold text-base md:text-lg border-b-2 pb-2 px-1 transition-all duration-300 ${
                  productType === 'sale'
                    ? 'text-[#46A358] border-[#46A358]'
                    : 'text-gray-700 border-transparent hover:text-[#46A358] hover:border-[#46A358]'
                }`}
              >
                Sale
              </button>
            </div>
            <div className='hidden md:flex gap-4 items-center'>
              <p className='font-medium text-lg text-gray-700 whitespace-nowrap'>Sort by:</p>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className='font-medium text-lg text-gray-700 border-2 border-gray-200 rounded-lg px-4 py-2 focus:border-[#46A358] focus:outline-none transition-colors cursor-pointer'
              >
                <option value='default'>Default sorting</option>
                <option value='price-low'>Price: Low to High</option>
                <option value='price-high'>Price: High to Low</option>
                <option value='name-asc'>Name: A to Z</option>
                <option value='name-desc'>Name: Z to A</option>
              </select>
            </div>
          </div>

          {paginatedData.length > 0 ? (
            <div className='grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6'>
              {paginatedData.map((el) => {
                // Calculate discount percentage for sale items
                const prices = allData?.map(p => parseFloat(p.prase || 0)) || [];
                const avgPrice = prices.length > 0 ? prices.reduce((a, b) => a + b, 0) / prices.length : 0;
                const currentPrice = parseFloat(el.prase || 0);
                const discountPercent = productType === 'sale' && currentPrice < avgPrice 
                  ? Math.round(((avgPrice - currentPrice) / avgPrice) * 100) 
                  : null;

                return (
                <div key={el.id} className='relative overflow-hidden rounded-lg md:rounded-xl group bg-white shadow-sm md:shadow-md hover:shadow-lg md:hover:shadow-xl transition-all duration-300'>
                  <div className='relative overflow-hidden rounded-t-lg md:rounded-t-xl bg-white'>
                    <img
                      src={el.avatar}
                      alt={el.name}
                      className='w-full h-48 md:h-64 object-cover group-hover:scale-105 transition-transform duration-500' />
                    {/* Discount Badge */}
                    {discountPercent && (
                      <div className='absolute top-2 left-2 bg-[#46A358] text-white px-2 py-1 rounded text-xs md:text-sm font-bold'>
                        {discountPercent}% OFF
                      </div>
                    )}
                    {/* Heart and Cart Icons - Top Right (Always Visible) */}
                    <div className='absolute top-2 right-2 md:top-4 md:right-4 flex gap-2 z-10'>
                      <button 
                        onClick={() => ShopFunction(el)} 
                        className='bg-white/90 hover:bg-white p-2 px-2.5 rounded-full shadow-md transition-all duration-200 hover:scale-110'
                        title={isInCart(el.id) ? 'Remove from cart' : 'Add to cart'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill={isInCart(el.id) ? "#46A358" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke={isInCart(el.id) ? "#46A358" : "currentColor"} className="w-5 h-5 md:w-6 md:h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                        </svg>
                      </button>
                      <button 
                        onClick={() => Liked(el)} 
                        className='bg-white/90 hover:bg-white p-2 px-2.5 rounded-full shadow-md transition-all duration-200 hover:scale-110'
                        title={isInHeart(el.id) ? 'Remove from favorites' : 'Add to favorites'}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill={isInHeart(el.id) ? "#46A358" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke={isInHeart(el.id) ? "#46A358" : "currentColor"} className="w-5 h-5 md:w-6 md:h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                        </svg>
                      </button>
                       <Link to={`/info/${el.id}`}>
                        <button 
                          className='bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-all duration-200 hover:scale-110'
                          title='View details'
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                          </svg>
                        </button>
                      </Link>
                    </div>
                    
                  </div>
                  <div className='bg-white p-3 md:p-5 rounded-b-lg md:rounded-b-xl'>
                    <h3 className='font-semibold text-sm md:text-lg text-gray-800 mb-1 md:mb-2 line-clamp-1'>{el.name}</h3>
                    <p className='font-bold text-lg md:text-2xl text-[#46A358]'>${el.prase}</p>
                  </div>
                </div>
                );
              })}
            </div>
          ) : (
            <div className='text-center py-20'>
              <div className='text-6xl mb-4'>🌱</div>
              <h3 className='text-2xl font-bold text-gray-800 mb-2'>No products found</h3>
              <p className='text-gray-600'>
                {searchQuery ? `No products match your search "${searchQuery}"` : 'Try adjusting your filters'}
              </p>
              {(searchQuery || productType !== 'all' || selectedCategory !== 'all') && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setProductType('all');
                    setSelectedCategory('all');
                    setSelectedSize('all');
                  }}
                  className='mt-4 bg-[#46A358] text-white px-6 py-2 rounded-lg hover:bg-[#3a8a47] transition-colors'
                >
                  Clear Filters
                </button>
              )}
            </div>
          )}

          <div className='mt-8 flex justify-end'>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={filteredData?.length || 0}
              onChange={handlePageChange}
              showSizeChanger={false}
            />
          </div>
        </div>
      </div>
      <CardProducks />

    </div>
  );
};

export default Home;