import React from 'react';
import '../App.css'
import { Carousel } from 'antd';
import img1 from '../assets/img1.svg';
import { Link } from 'react-router';

const CarouselANT = () => (
    <Carousel autoplay={{ dotDuration: true }} autoplaySpeed={5000} className="custom-carousel">
        <div className='w-100%'>
            <div className='flex  justify-around items-center-safe bg-[#F5F5F580]'>
                <div className='w-[35%]'>
                    <p className='text-black font-serif'>Welcome to GreenShop</p>
                    <p className='font-bold text-6xl mb-4'>Let’s Make a
                        Better <span className='text-[#46A358]'>Planet</span> </p>
                    <p className='text-[#727272] font-light'>We are an online plant shop offering a wide range of cheap and trendy plants. Use our plants to create an unique Urban Jungle. Order your favorite plants!</p>
                    <Link to={'/Shop'}>
                    <button className='bg-[#46A358] text-white p-3 px-5 mt-4 font-bold rounded-[10px] flex items-center gap-4'>
                        SHOP NOW
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                        </svg>
                    </button>
                    </Link>
                </div>
                <div className='w-[50%] flex  items-center '>
                    <img src={img1} alt="img" className='w-60 h-60 mt-60' />
                    <img src={img1} alt="img" className='w-[80%] ' />
                </div>
            </div>
        </div>
        <div className='w-100%'>
            <div className='flex  justify-around items-center-safe bg-[#F5F5F580]'>
                <div className='w-[35%]'>
                    <p className='text-black font-serif'>Welcome to GreenShop</p>
                    <p className='font-bold text-6xl mb-4'>Let’s Make a
                        Better <span className='text-[#46A358]'>Planet</span> </p>
                    <p className='text-[#727272] font-light'>We are an online plant shop offering a wide range of cheap and trendy plants. Use our plants to create an unique Urban Jungle. Order your favorite plants!</p>
                    <Link to={'/Shop'}>
                    <button className='bg-[#46A358] text-white p-3 px-5 mt-4 font-bold rounded-[10px] flex items-center gap-4'>
                        SHOP NOW
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                        </svg>
                    </button>
                    </Link>
                </div>
                <div className='w-[50%] flex  items-center '>
                    <img src={img1} alt="img" className='w-60 h-60 mt-60' />
                    <img src={img1} alt="img" className='w-[80%] ' />
                </div>
            </div>
        </div>
        <div className='w-100%'>
            <div className='flex  justify-around items-center-safe bg-[#F5F5F580]'>
                <div className='w-[35%]'>
                    <p className='text-black font-serif'>Welcome to GreenShop</p>
                    <p className='font-bold text-6xl mb-4'>Let’s Make a
                        Better <span className='text-[#46A358]'>Planet</span> </p>
                    <p className='text-[#727272] font-light'>We are an online plant shop offering a wide range of cheap and trendy plants. Use our plants to create an unique Urban Jungle. Order your favorite plants!</p>
                    <Link to={'/Shop'}>
                    <button className='bg-[#46A358] text-white p-3 px-5 mt-4 font-bold rounded-[10px] flex items-center gap-4'>
                        SHOP NOW
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                        </svg>
                    </button>
                    </Link>
                </div>
                <div className='w-[50%] flex  items-center '>
                    <img src={img1} alt="img" className='w-60 h-60 mt-60' />
                    <img src={img1} alt="img" className='w-[80%] ' />
                </div>
            </div>
        </div>
        <div className='w-100%'>
            <div className='flex  justify-around items-center-safe bg-[#F5F5F580]'>
                <div className='w-[35%]'>
                    <p className='text-black font-serif'>Welcome to GreenShop</p>
                    <p className='font-bold text-6xl mb-4'>Let’s Make a
                        Better <span className='text-[#46A358]'>Planet</span> </p>
                    <p className='text-[#727272] font-light'>We are an online plant shop offering a wide range of cheap and trendy plants. Use our plants to create an unique Urban Jungle. Order your favorite plants!</p>
                    <Link to={'/Shop'}>
                    <button className='bg-[#46A358] text-white p-3 px-5 mt-4 font-bold rounded-[10px] flex items-center gap-4'>
                        SHOP NOW
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                        </svg>
                    </button>
                    </Link>
                </div>
                <div className='w-[50%] flex  items-center '>
                    <img src={img1} alt="img" className='w-60 h-60 mt-60' />
                    <img src={img1} alt="img" className='w-[80%] ' />
                </div>
            </div>
        </div>
       
    </Carousel>
);
export default CarouselANT;