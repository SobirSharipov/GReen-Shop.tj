import React, { useEffect, useState } from 'react'
import { Link, Outlet, useLocation } from 'react-router'
import logo from '../../assets/Logo.svg'
import logo1 from '../../assets/Logo1.svg'
import { useGetUsersQuery } from '../../services/UserApi';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from "react-icons/fa6";
import { Spin } from 'antd';

const Layout = () => {
  const { data, isLoading, error } = useGetUsersQuery();
  const location = useLocation();
  let [getHeart, setHeart] = useState([])
  let [getCart, setCart] = useState([])

  useEffect(() => {
    const handleHeartUpdate = () => {
      let stored = localStorage.getItem('Heart');
      if (stored) {
        setHeart(JSON.parse(stored));
      }
    };

    window.addEventListener('heartUpdated', handleHeartUpdate);

    let stored = localStorage.getItem('Heart');
    if (stored) {
      setHeart(JSON.parse(stored));
    }

    return () => {
      window.removeEventListener('heartUpdated', handleHeartUpdate);
    };
  }, []);

 useEffect(() => {
    const handleCartUpdate = (event) => {
      if (event.detail && event.detail.cartItems) {
        setCart(event.detail.cartItems);
      } else {
        let stored = localStorage.getItem('Cart');
        if (stored) {
          setCart(JSON.parse(stored));
        }
      }
    };

    window.addEventListener('cartUpdated', handleCartUpdate);
    let stored = localStorage.getItem('Cart');
    if (stored) {
      setCart(JSON.parse(stored));
    }

    return () => {
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === 'Cart') {
        const newCart = e.newValue ? JSON.parse(e.newValue) : [];
        setCart(newCart);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const isActive = (path) => {
    return location.pathname === path;
  };

  if (isLoading) {
    return (

      <div >
        <div className='flex justify-center items-center mt-20'>
        <img src={logo} alt="" className='w-[20%]' />
        </div>
        <div className="flex justify-center items-center mt-10 ">
        <Spin size="large" />
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error loading data</div>;
  }

  return (
    <div className='p-[10px]'>
      <header>
        <div className='flex justify-between items-center border-b-2 border-[#46A35880] pb-[10px]'>
          <div>
            <img src={logo} alt="Logo" />
          </div>
          <div className='flex gap-15'>
            <Link to={'/'}>
              <p className={`${isActive('/') ? 'text-[#46A358] font-bold border-b-2 border-[#46A358] pb-1' : 'text-gray-700 hover:text-[#46A358]'} transition-colors`}>
                Home
              </p>
            </Link>
            <Link to={'/Shop'}>
              <p className={`${isActive('/Shop') ? 'text-[#46A358] font-bold border-b-2 border-[#46A358] pb-1' : 'text-gray-700 hover:text-[#46A358]'} transition-colors`}>
                Shop
              </p>
            </Link>
            <Link to={'/Plant Care'}>
              <p className={`${isActive('/Plant%20Care') ? 'text-[#46A358] font-bold border-b-2 border-[#46A358] pb-1' : 'text-gray-700 hover:text-[#46A358]'} transition-colors`}>
                Plant Care
              </p>
            </Link>
            <Link to={'/Blogs'}>
              <p className={`${isActive('/Blogs') ? 'text-[#46A358] font-bold border-b-2 border-[#46A358] pb-1' : 'text-gray-700 hover:text-[#46A358]'} transition-colors`}>
                Blogs
              </p>
            </Link>
          </div>
          <div className='flex gap-4'>
            <Link to={'/Heart'} className="relative">
              <button className={`p-2 rounded-full transition-colors ${isActive('/Heart') ? 'text-[#46A358]' : 'text-gray-700 hover:text-[#46A358]'}`}>
                {isActive('/Heart') ? (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#46A358" className="size-6">
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                  </svg>
                )}
              </button>

              {getHeart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#46A358] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getHeart.length}
                </span>
              )}
            </Link>
            <Link to={'/ToCard'} className="relative">
              <button className={`p-2 rounded-full transition-colors ${isActive('/ToCard') ? 'text-[#46A358]' : 'text-gray-700 hover:text-[#46A358]'}`}>
                {isActive('/ToCard') ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="#46A358" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                )}
              </button>

              {getCart.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#46A358] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {getCart.length}
                </span>
              )}
            </Link>

            <button className='flex gap-2 py-2 px-6 bg-[#46A358] text-white rounded-[10px] hover:bg-[#3a8a47] transition-colors'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
              </svg>
              <p>Login</p>
            </button>
          </div>
        </div>
      </header>
      <main className='mt-3'>
        <Outlet />
      </main>
      <footer>
        <div className='flex gap-4 my-20'>
          <div className='grid grid-cols-3 gap-8 w-[68%]'>
            {data.slice(6, 9).map((el) => (
              (
                <div key={el.id} className='relative overflow-hidden rounded-t-xl group'>
                  <img
                    src={el.avatar}
                    alt="img"
                    className='w-full h-50 object-cover group-hover:brightness-75 transition-all duration-300' />
                  <div className='bg-[#FBFBFB] p-4 py-2 rounded-b-xl'>
                    <p className='font-serif text-2xl'>{el.name}</p>
                    <p className='font-serif text-l line-clamp-2 my-2'>${el.lorem}</p>
                  </div>
                </div>
              )
            ))}
          </div>
          <div className='w-[30%]'>
            <p className='font-serif mb-3 text-2xl'>Would you like to join newsletters?</p>
            <div className='flex border-[#46A358] border rounded-xl' >
              <input type="text" placeholder='enter your email address...' className='border-none w-full p-2' />
              <button className='p-2 px-7 rounded-r-xl bg-[#46A358] text-white font-serif text-2xl'>Join</button>
            </div>
            <p className='font-serif text-l  mt-5'>We usually post offers and challenges in newsletter. We’re your online houseplant destination. We offer a wide range of houseplants and accessories shipped directly from our (green)house to yours! </p>
          </div>
        </div>

        <div className='grid grid-cols-4 items-center rounded-xl bg-[#46A3581A] border border-[#46A358] p-2'>
          <div>
            <img src={logo} alt="logo" />
          </div>
          <div className='flex gap-2 items-center'>
            <button className='text-[#46A358]'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
              </svg>
            </button>
            <p className='font-serif text-l'>70 West Buckingham Ave. <br />
              Farmingdale, NY 11735</p>
          </div>
          <div className='flex gap-2 items-center'>
            <button className='text-[#46A358]'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75" />
              </svg>
            </button>
            <p className='font-serif text-l'>contact@greenshop.com</p>
          </div>
          <div className='flex gap-2 items-center'>
            <button className='text-[#46A358]'>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 3.75v4.5m0-4.5h-4.5m4.5 0-6 6m3 12c-8.284 0-15-6.716-15-15V4.5A2.25 2.25 0 0 1 4.5 2.25h1.372c.516 0 .966.351 1.091.852l1.106 4.423c.11.44-.054.902-.417 1.173l-1.293.97a1.062 1.062 0 0 0-.38 1.21 12.035 12.035 0 0 0 7.143 7.143c.441.162.928-.004 1.21-.38l.97-1.293a1.125 1.125 0 0 1 1.173-.417l4.423 1.106c.5.125.852.575.852 1.091V19.5a2.25 2.25 0 0 1-2.25 2.25h-2.25Z" />
              </svg>
            </button>
            <p className='font-serif text-l'>+88 01911 717 490</p>
          </div>
        </div>

        <div className='grid grid-cols-4 my-5'>
          <div>
            <p className=' font-bold text-2xl'>My Account</p>
            <p className='font-serif'>My Account</p>
            <p className='font-serif'>Our stores</p>
            <p className='font-serif'>Contact us</p>
            <p className='font-serif'>Career</p>
            <p className='font-serif'>Specials</p>
          </div>
          <div>
            <p className=' font-bold text-2xl'>Help & Guide</p>
            <p className='font-serif'>Help Center</p>
            <p className='font-serif'>How to Buy</p>
            <p className='font-serif'>Shipping & Delivery</p>
            <p className='font-serif'>Product Policy</p>
            <p className='font-serif'>How to Return</p>
          </div>
          <div>
            <p className=' font-bold text-2xl'>Categories</p>
            <p className='font-serif'>House Plants</p>
            <p className='font-serif'>Potter Plants</p>
            <p className='font-serif'>Seeds</p>
            <p className='font-serif'>Small Plants</p>
            <p className='font-serif'>Accessories</p>
          </div>
          <div>
            <p className=' font-bold text-2xl'>Social Media</p>
            <div className='flex  gap-2 my-2'>
              <div className='border border-[#46A358] p-2 text-[#46A358] rounded-[7px] flex justify-center'>
                <FaFacebookF />
              </div>
              <div className='border border-[#46A358] p-2 text-[#46A358] rounded-[7px] flex justify-center'>
                <FaInstagram />
              </div>
              <div className='border border-[#46A358] p-2 text-[#46A358] rounded-[7px] flex justify-center'>
                <FaTwitter />
              </div>
              <div className='border border-[#46A358] p-2 text-[#46A358] rounded-[7px] flex justify-center'>
                <FaLinkedinIn />
              </div>
              <div className='border border-[#46A358] p-2 text-[#46A358] rounded-[7px] flex justify-center'>
                <FaYoutube />
              </div>
            </div>
            <p className=' font-bold text-2xl'>We accept</p>
            <img src={logo1} alt="" />
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Layout