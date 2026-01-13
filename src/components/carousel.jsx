import React from 'react';
import '../App.css'
import { Carousel } from 'antd';
import img1 from '../assets/img1.svg';
import { Link } from 'react-router';

const CarouselANT = () => (
    <Carousel autoplay={{ dotDuration: true }} autoplaySpeed={5000} className="custom-carousel">
        <div className='w-100%'>
            <div className='flex flex-col md:flex-row justify-around items-center bg-gradient-to-r from-[#E8F5E9] via-[#C8E6C9] to-[#A5D6A7] rounded-2xl p-6 md:p-12 relative overflow-hidden min-h-[400px] md:min-h-auto'>
                {/* Subtle organic shapes overlay */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-48 h-48 md:w-96 md:h-96 bg-[#46A358] rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-[#66BB6A] rounded-full blur-3xl"></div>
                </div>
                
                <div className='w-full md:w-[40%] relative z-10 text-center md:text-left mb-6 md:mb-0'>
                    <p className='text-gray-700 text-xs md:text-sm font-medium uppercase tracking-wider mb-2'>Welcome to GreenShop</p>
                    <p className='font-bold text-3xl md:text-5xl lg:text-6xl mb-3 md:mb-4 text-gray-800 leading-tight'>
                        LET'S MAKE A<br />
                        BETTER <span className='text-[#46A358]'>PLANET</span>
                    </p>
                    <p className='text-gray-500 text-xs md:text-sm font-light mb-4 md:mb-6 leading-relaxed px-2 md:px-0'>
                        We are an online plant shop offering a wide range
                    </p>
                    <Link to={'/Shop'}>
                        <button className='text-[#46A358] font-bold text-sm md:text-base hover:text-[#3a8a47] transition-colors flex items-center gap-2 bg-transparent border-none p-0 mx-auto md:mx-0'>
                            SHOP NOW
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </Link>
                </div>
                <div className='w-full md:w-[50%] flex items-center justify-center md:items-end md:justify-end relative z-10'>
                    <img src={img1} alt="Small plant" className='w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain hidden md:block' style={{ marginRight: '-20px', marginBottom: '20px' }} />
                    <img src={img1} alt="Large plant" className='w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain' />
                </div>
            </div>
        </div>
        <div className='w-100%'>
            <div className='flex flex-col md:flex-row justify-around items-center bg-gradient-to-r from-[#E8F5E9] via-[#C8E6C9] to-[#A5D6A7] rounded-2xl p-6 md:p-12 relative overflow-hidden min-h-[400px] md:min-h-auto'>
                {/* Subtle organic shapes overlay */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-48 h-48 md:w-96 md:h-96 bg-[#46A358] rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-[#66BB6A] rounded-full blur-3xl"></div>
                </div>
                
                <div className='w-full md:w-[40%] relative z-10 text-center md:text-left mb-6 md:mb-0'>
                    <p className='text-gray-700 text-xs md:text-sm font-medium uppercase tracking-wider mb-2'>Welcome to GreenShop</p>
                    <p className='font-bold text-3xl md:text-5xl lg:text-6xl mb-3 md:mb-4 text-gray-800 leading-tight'>
                        LET'S MAKE A<br />
                        BETTER <span className='text-[#46A358]'>PLANET</span>
                    </p>
                    <p className='text-gray-500 text-xs md:text-sm font-light mb-4 md:mb-6 leading-relaxed px-2 md:px-0'>
                        We are an online plant shop offering a wide range
                    </p>
                    <Link to={'/Shop'}>
                        <button className='text-[#46A358] font-bold text-sm md:text-base hover:text-[#3a8a47] transition-colors flex items-center gap-2 bg-transparent border-none p-0 mx-auto md:mx-0'>
                            SHOP NOW
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </Link>
                </div>
                <div className='w-full md:w-[50%] flex items-center justify-center md:items-end md:justify-end relative z-10'>
                    <img src={img1} alt="Small plant" className='w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain hidden md:block' style={{ marginRight: '-20px', marginBottom: '20px' }} />
                    <img src={img1} alt="Large plant" className='w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain' />
                </div>
            </div>
        </div>
        <div className='w-100%'>
            <div className='flex flex-col md:flex-row justify-around items-center bg-gradient-to-r from-[#E8F5E9] via-[#C8E6C9] to-[#A5D6A7] rounded-2xl p-6 md:p-12 relative overflow-hidden min-h-[400px] md:min-h-auto'>
                {/* Subtle organic shapes overlay */}
                <div className="absolute inset-0 opacity-20">
                    <div className="absolute top-0 left-0 w-48 h-48 md:w-96 md:h-96 bg-[#46A358] rounded-full blur-3xl"></div>
                    <div className="absolute bottom-0 right-0 w-48 h-48 md:w-96 md:h-96 bg-[#66BB6A] rounded-full blur-3xl"></div>
                </div>
                
                <div className='w-full md:w-[40%] relative z-10 text-center md:text-left mb-6 md:mb-0'>
                    <p className='text-gray-700 text-xs md:text-sm font-medium uppercase tracking-wider mb-2'>Welcome to GreenShop</p>
                    <p className='font-bold text-3xl md:text-5xl lg:text-6xl mb-3 md:mb-4 text-gray-800 leading-tight'>
                        LET'S MAKE A<br />
                        BETTER <span className='text-[#46A358]'>PLANET</span>
                    </p>
                    <p className='text-gray-500 text-xs md:text-sm font-light mb-4 md:mb-6 leading-relaxed px-2 md:px-0'>
                        We are an online plant shop offering a wide range
                    </p>
                    <Link to={'/Shop'}>
                        <button className='text-[#46A358] font-bold text-sm md:text-base hover:text-[#3a8a47] transition-colors flex items-center gap-2 bg-transparent border-none p-0 mx-auto md:mx-0'>
                            SHOP NOW
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-4 h-4 md:w-5 md:h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                            </svg>
                        </button>
                    </Link>
                </div>
                <div className='w-full md:w-[50%] flex items-center justify-center md:items-end md:justify-end relative z-10'>
                    <img src={img1} alt="Small plant" className='w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain hidden md:block' style={{ marginRight: '-20px', marginBottom: '20px' }} />
                    <img src={img1} alt="Large plant" className='w-48 h-48 md:w-64 md:h-64 lg:w-80 lg:h-80 object-contain' />
                </div>
            </div>
        </div>
    </Carousel>
);
export default CarouselANT;
