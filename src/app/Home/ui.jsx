// Home.tsx
import React, { useState, useEffect, useMemo } from 'react';
import CarouselANT from '../../components/carousel';
import SliderANT from '../../components/Slider';
import img from '../../assets/img1.png';
import { useDeleteuserMutation, useGetUsersQuery } from '../../services/UserApi';
import { Pagination, Spin } from 'antd';
import CardProducks from '../../components/cardProducks';
import { Link } from 'react-router';

const Home = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 9;
  let [rez1, setrez1] = useState(true)
  let [rez2, setrez2] = useState(false)
  let [rez3, setrez3] = useState(false)
  const { data: allData, isLoading, error, refetch } = useGetUsersQuery();
  let [deleteUser] = useDeleteuserMutation();

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

  const paginatedData = useMemo(() => {
    if (!allData) return [];

    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return allData.slice(startIndex, endIndex);
  }, [allData, currentPage, pageSize]);

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
      <div className='flex gap-8 justify-between items-start my-8'>
        <div className='bg-[#FBFBFB] w-[30%]'>
          <div className='p-4 '>
            <p className='font-bold text-black text-2xl'>Categories</p>
            <p className='flex justify-between my-3 text-[#46A358] font-black'>House Plants <span className='font-medium'>(55)</span></p>
            <p className='flex justify-between my-3'>Potter Plants <span>(33)</span></p>
            <p className='flex justify-between my-3'>Seeds <span>(12)</span></p>
            <p className='flex justify-between my-3'>Small Plants <span>(65)</span></p>
            <p className='flex justify-between my-3'>Big Plants <span>(39)</span></p>
            <p className='flex justify-between my-3'>Succulents <span>(23)</span></p>
            <p className='flex justify-between my-3'>Trerrariums <span>(17)</span></p>
            <p className='flex justify-between my-3'>Gardening <span>(19)</span></p>
            <p className='flex justify-between my-3'>Accessories <span>(13)</span></p>
            <p className='font-bold text-black text-2xl mt-5'>Price Range</p>
            <SliderANT />
            <p className='font-bold text-xl'>Price: <span className='text-[#46A358]'> $39 - $1230</span></p>
            <button className='font-semibold text-xl text-white p-1.5 w-full my-4 rounded-[10px] bg-[#46A358]'>Filter</button>
            <p className='font-bold text-black text-2xl'>Size</p>
            <p className='flex justify-between my-3'>Small <span>(119)</span></p>
            <p className='flex justify-between my-3'>Medium <span>(86)</span></p>
            <p className='flex justify-between my-3'>Large <span>(78)</span></p>

          </div>
          <div>
            <img src={img} alt="img" />
          </div>

        </div>
        <div className='w-[70%]'>
          <div className='flex justify-between items-center mb-4'>
            <div className='flex gap-6 items-center'>
              <button
                onClick={() => { setrez1(!rez1), setrez2(false), setrez3(false) }}
                className={`font-bold text-lg border-b-2 pb-1 transition-all duration-300 ${rez1
                  ? 'text-[#46A358] border-[#46A358]'
                  : 'text-gray-700 border-transparent hover:text-[#46A358]'
                  }`}
              >
                All Plants
              </button>
              <button
                onClick={() => { setrez2(!rez2), setrez1(false), setrez3(false) }}
                className={`font-medium text-lg border-b-2 pb-1 transition-all duration-300 ${rez2
                  ? 'text-[#46A358] border-[#46A358]'
                  : 'text-gray-700 border-transparent hover:text-[#46A358]'
                  }`}
              >
                New Arrivals
              </button>
              <button
                onClick={() => { setrez3(!rez3), setrez1(false), setrez2(false) }}
                className={`font-medium text-lg border-b-2 pb-1 transition-all duration-300 ${rez3
                  ? 'text-[#46A358] border-[#46A358]'
                  : 'text-gray-700 border-transparent hover:text-[#46A358]'
                  }`}
              >
                Sale
              </button>
            </div>
            <div className='flex gap-4 items-center'>
              <p className='font-medium text-lg text-gray-700'>Short by:</p>
              <select className='font-medium text-lg text-gray-700'>
                <option value="true">Default sorting</option>
                <option value="false">Default sorting</option>
              </select>
            </div>
          </div>
          <div className='grid grid-cols-3 gap-8 '>
            {paginatedData.map((el) => (
              <div key={el.id} className='relative overflow-hidden rounded-t-xl group'>
                <img
                  src={el.avatar}
                  alt="img"
                  className='w-full h-60 object-cover group-hover:brightness-75 transition-all duration-300' />
                <div className='absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                  flex gap-3 opacity-0 group-hover:opacity-100 
                  transition-opacity duration-300'>
                  <button onClick={() => handleDelete(el.id)} className='bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                    </svg>
                  </button>
                  <button onClick={()=>ShopFunction(el)} className='bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill={isInCart(el.id) ? "#46A358" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke={isInCart(el.id) ? "#46A358" :"currentColor"} className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                  </button>

                  <button onClick={() => Liked(el)} className='bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill={isInHeart(el.id) ? "#46A358" : "none"} stroke={isInHeart(el.id) ? "#46A358" :"currentColor"} viewBox="0 0 24 24" strokeWidth={1.5} className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                    </svg>
                  </button>
                   <Link to={`/info/${el.id}`}>
                  <button className='bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                    </svg>
                  </button>
                   </Link>
                </div>
                <div className='bg-[#FBFBFB] p-4 rounded-b-xl'>
                  <p className='font-mono text-xl'>{el.name}</p>
                  <p className='font-bold text-xl text-[#46A358] text-end'>${el.prase}</p>
                </div>
              </div>
            ))}
          </div>

          <div className='mt-8 flex justify-end'>
            <Pagination
              current={currentPage}
              pageSize={pageSize}
              total={allData?.length || 0}
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