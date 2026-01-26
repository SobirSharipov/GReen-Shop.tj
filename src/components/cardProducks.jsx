import React, { useEffect, useState } from 'react'
import { useDeleteuserMutation, useGetUsersQuery } from '../services/UserApi';
import { Link } from 'react-router';
import { mergeProducts } from '../utils/products';

const CardProducks = () => {
    const { data: dataRaw } = useGetUsersQuery();
    const data = mergeProducts(dataRaw);


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
        <div className="max-w-7xl mx-auto px-4" style={{ fontFamily: 'Inter-Regular, sans-serif' }}>
            {/* Featured / Promo cards */}
            {Array.isArray(data) && data.length > 0 && (
                <div className="md:grid hidden  md:grid-cols-2 gap-4 sm:gap-6 my-8 md:my-10">
                    {data.slice(46, 48).map((el) => (
                        <div
                            key={el.id}
                            className="bg-[#FBFBFB] rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-md transition-all duration-300 group"
                        >
                            <div className="flex flex-col sm:flex-row">
                                <div className="sm:w-2/5">
                                    <img
                                        src={el.avatar}
                                        alt={el.name}
                                        className="w-full h-48 sm:h-full sm:min-h-[220px] object-cover group-hover:brightness-95 transition-all duration-300"
                                    />
                                </div>
                                <div className="sm:w-3/5 p-4 sm:p-5 flex flex-col justify-between gap-3">
                                    <div>
                                        <p className="text-lg sm:text-xl font-black text-gray-900" style={{ fontFamily: 'Montserrat-Bold, sans-serif' }}>
                                            {truncateText(el.name, 32)}
                                        </p>
                                        <p className="text-sm sm:text-base text-gray-700 mt-2 line-clamp-3">
                                            {truncateText(el.lorem, 220)}
                                        </p>
                                    </div>
                                    <div className="flex justify-end">
                                        <Link to={`/info/${el.id}`}>
                                            <button
                                                className="inline-flex items-center gap-2 bg-[#46A358] text-white px-4 py-2.5 rounded-xl hover:bg-[#3a8a47] transition-colors font-semibold"
                                                style={{ fontFamily: 'Inter-SemiBold, sans-serif' }}
                                            >
                                                Find More
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                                                </svg>
                                            </button>
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Blog posts */}
            <div className="text-center mt-10 mb-8">
                <p className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900" style={{ fontFamily: 'Montserrat-Bold, sans-serif' }}>
                    Our Blog Posts
                </p>
                <p className="text-gray-600 mt-2 text-sm sm:text-base max-w-2xl mx-auto">
                    We are an online plant shop offering a wide range of cheap and trendy plants.
                </p>
            </div>

            {Array.isArray(data) && data.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 mb-10">
                    {data.slice(16, 24).map((el) => (
                        <div
                            key={el.id}
                            className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 group"
                        >
                            <div className="relative">
                                <img
                                    src={el.avatar}
                                    alt={el.name}
                                    className="w-full h-56 sm:h-60 object-cover group-hover:scale-105 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-black/0" />

                                {/* Actions: always visible on mobile, on hover on md+ */}
                                <div className="absolute top-3 right-3 flex gap-2 opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity">
                                    <button
                                        onClick={() => Liked(el)}
                                        className="bg-white/95 hover:bg-white p-2.5 rounded-full shadow-md transition-transform duration-200 hover:scale-110"
                                        title={isInHeart(el.id) ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill={isInHeart(el.id) ? "#46A358" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke={isInHeart(el.id) ? "#46A358" : "currentColor"} className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                        </svg>
                                    </button>

                                    <button
                                        onClick={() => ShopFunction(el)}
                                        className="bg-white/95 hover:bg-white p-2.5 rounded-full shadow-md transition-transform duration-200 hover:scale-110"
                                        title={isInCart(el.id) ? 'Remove from cart' : 'Add to cart'}
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill={isInCart(el.id) ? "#46A358" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke={isInCart(el.id) ? "#46A358" : "currentColor"} className="w-5 h-5">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                        </svg>
                                    </button>
                                </div>
                            </div>

                            <div className="p-4 sm:p-5 bg-white">
                                <p className="text-sm text-[#46A358]" style={{ fontFamily: 'Inter-Medium, sans-serif' }}>
                                    {el.data}
                                </p>
                                <p className="mt-1 text-lg font-bold text-gray-900 line-clamp-2" style={{ fontFamily: 'Montserrat-Bold, sans-serif' }}>
                                    {truncateText(el.name, 48)}
                                </p>
                                <p className="text-gray-600 text-sm sm:text-base line-clamp-3 mt-2">
                                    {truncateText(el.lorem, 120)}
                                </p>

                                <div className="mt-4">
                                    <Link to={`/info/${el.id}`}>
                                        <button className="inline-flex items-center gap-2 text-[#46A358] font-semibold hover:text-[#3a8a47] transition-colors" style={{ fontFamily: 'Inter-SemiBold, sans-serif' }}>
                                            Read More
                                            <span className="w-7 h-7 rounded-full bg-[#46A358]/10 flex items-center justify-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                                    <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 8.25 21 12m0 0-3.75 3.75M21 12H3" />
                                                </svg>
                                            </span>
                                        </button>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-10 text-gray-500">
                    No posts available.
                </div>
            )}
        </div>
    )
}

export default CardProducks