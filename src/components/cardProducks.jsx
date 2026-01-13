import React, { useEffect, useState } from 'react'
import { useDeleteuserMutation, useGetUsersQuery } from '../services/UserApi';
import { Link } from 'react-router';

const CardProducks = () => {
    const { data } = useGetUsersQuery();


    const truncateText = (text, maxLength) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };



    const [heartItems, setHeartItems] = useState([]);

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
        localStorage.setItem('Heart', JSON.stringify(updatedHeart));
        setHeartItems(updatedHeart);
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






    return (
        <div>
            <div className='hidden md:flex  gap-5 my-10'>
                {data.slice(46, 48).map((el) => (
                    <div key={el.id} className='relative overflow-hidden rounded-xl group flex gap-4 w-full bg-[#FBFBFB]'>
                        <img
                            src={el.avatar}
                            alt="img"
                            className='w-[40%] h-70 object-cover group-hover:brightness-75 transition-all duration-300' />
                        <div className='relative w-[60%] px-5 py-3'>
                            <p className='font-black md:text-2xl'>{truncateText(el.name, 23)}</p>
                            <p className='md:font-serif text-gray-700 md:text-l my-4'>{truncateText(el.lorem, 200)}</p>
                            <div className='absolute bottom-4 right-4'>
                                <Link to={`/info/${el.id}`}>
                                    <button className='flex gap-4 items-center cursor-pointer bg-[#46A358] text-white font-serif md:text-xl p-2 px-6 rounded-[8px] hover:bg-[#3a8a47] transition-colors'>
                                        Find More
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                        </svg>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div>
                <div className=' text-center mt-15 mb-10'>
                    <p className='font-bold text-4xl'>Our Blog Posts</p>
                    <p className='font-serif'> We are an online plant shop offering a wide range of cheap and trendy plants. </p>
                </div>

                <div className='grid md:grid-cols-4 gap-8 my-5'>
                    {data.slice(16, 24).map((el) => (
                        <div key={el.id} className='relative overflow-hidden rounded-t-xl group h-120'>
                            <img
                                src={el.avatar}
                                alt="img"
                                className='w-full h-60 object-cover group-hover:brightness-75 transition-all duration-300' />
                            <div className='absolute top-1/3 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                                  flex gap-3 opacity-0 group-hover:opacity-100 
                                  transition-opacity duration-300'>
                                <button onClick={() => Liked(el)} className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill={isInHeart(el.id) ? "#46A358" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke={isInHeart(el.id) ? "#46A358" : "currentColor"} className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                    </svg>
                                </button>

                                <button onClick={() => ShopFunction(el)} className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill={isInCart(el.id) ? "#46A358" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke={isInCart(el.id) ? "#46A358" : "currentColor"} className="size-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>
                                </button>
                            </div>
                            <div className='bg-[#FBFBFB] p-4 rounded-b-xl'>
                                <p className='font-mono text-xl text-[#46A358]'>{el.data}</p>
                                <p className='font-bold text-2xl'>{truncateText(el.name, 20)}</p>
                                <p className='font-serif text-l line-clamp-2 my-2'>{truncateText(el.lorem, 100)}</p>
                                <Link to={`/info/${el.id}`}>
                                    <button className='font-serif flex gap-4 items-center text-xl hover:text-[#46A358]'>Read More
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                        </svg>
                                    </button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default CardProducks