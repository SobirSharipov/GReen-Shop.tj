import React, { useState, useEffect } from 'react' // Исправлен импорт
import { Link, useParams } from 'react-router'
import { Rate, Spin } from 'antd' // Или другой компонент загрузки
import axios from 'axios'
import { useGetUsersQuery } from '../../services/UserApi'
import { FaFacebookF, FaInstagram, FaTwitter } from 'react-icons/fa6'

const Info = () => {
    const { data, refetch } = useGetUsersQuery();
    let { id } = useParams()
    let [product, setProduct] = useState(null)
    let [loading, setLoading] = useState(true)
    let [error, setError] = useState(null)
    let [rez, setrez] = useState(false)
    let [rez1, setrez1] = useState(false)
    let [rez2, setrez2] = useState(false)
    let [rez3, setrez3] = useState(false)
    let [count, setCount] = useState(1);

    const user = data.find((u) => String(u.id) === String(id));

    useEffect(() => {
        if (user) {
            setProduct(user)
            setLoading(false)
        } else {
            setError('Product not found')
            setLoading(false)
        }
    }, [user?.id])


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




    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Spin size="large" />
            </div>
        )
    }

    if (error) {
        return (
            <div className="text-center p-8">
                <div className="text-red-500 text-xl mb-4">Error: {error}</div>
                <button
                    onClick={user}
                    className="bg-[#46A358] text-white px-6 py-2 rounded-lg hover:bg-[#3a8a47]"
                >
                    Try Again
                </button>
            </div>
        )
    }

    if (!product) {
        return (
            <div className="text-center p-8">
                <h2 className="text-2xl text-gray-600">Product not found</h2>
            </div>
        )
    }

    return (
        <div className="p-4">
            <div>
                <p className="mb-6">
        <span className="font-bold text-[#46A358]">Home</span> / <span className="text-gray-600 font-medium">Info</span>
      </p>
                <div className='flex gap-4 w-[98%] justify-center overflow-x-auto scrollbar-hide bg-[#46A3581A] border border-[#46A358] rounded-xl p-2 mb-6'>
                    {data.map((el)=>(
                        <div key={el.id} className='flex-shrink-0 w-30   '>
                            <img src={el.avatar} alt="" className='w-30 h-20 m-4 rounded-xl' />
                        </div>
                    ))}
                </div>
                <div className="flex  gap-4">
                    <div className="w-[65%] relative overflow-hidden rounded-xl shadow-lg">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-full h-120 object-cover"
                        />

                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6">
                            <h2 className="text-3xl font-bold text-white mb-2">{user.name}</h2>
                            <p className="text-white/90 line-clamp-2">{user.lorem || user.description}</p>
                        </div>

                        <div className="absolute top-4 right-4 flex gap-3">
                            <button onClick={() => Liked(user)} className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110">
                                <svg xmlns="http://www.w3.org/2000/svg" fill={isInHeart(user.id) ? "#46A358" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke={isInHeart(user.id) ? "#46A358" : "currentColor"} className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" />
                                </svg>
                            </button>

                            <button onClick={() => ShopFunction(user)} className="bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110">
                                <svg xmlns="http://www.w3.org/2000/svg" fill={isInCart(user.id) ? "#46A358" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke={isInCart(user.id) ? "#46A358" : "currentColor"} className="size-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                            </button>
                        </div>
                    </div>

                    <div className="w-[30%] ml-6 overflow-y-auto h-120 scrollbar-hide rounded-xl">
                        {user && (
                            <div className=" p-6 py-3 bg-[#46A3581A] rounded-xl shadow-sm">
                                <h3 className="text-2xl font-bold mb-2">{user.name}</h3>
                                <div className='flex justify-between items-center mb-4 border-b-2 border-[#46A358]'>
                                    <span className="font-medium text-3xl text-[#46A358]">${user.prase}</span>
                                    <div>
                                        <Rate allowHalf defaultValue={3.5} />
                                        <p className="text-gray-600">19 Customer Review</p>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-lg mb-2 text-[#46A358]">Specifications</h4>
                                    <p className="text-gray-700 font-serif">{user.lorem || 'No description available.'}</p>
                                </div>
                                <div className='flex gap-2 items-center my-2'>
                                    <p className='font-bold'>Size:</p>
                                    <button onClick={() => { setrez(!rez), setrez1(false), setrez2(false), setrez3(false) }} className={`${rez ? 'bg-[#46A358] text-white ' : "border-[#46A358] border-2"} w-8 h-8 cursor-pointer rounded-[50%]`}>S</button>
                                    <button onClick={() => { setrez1(!rez1), setrez(false), setrez2(false), setrez3(false) }} className={`${rez1 ? 'bg-[#46A358] text-white ' : "border-[#46A358] border-2"} w-8 h-8 cursor-pointer rounded-[50%]`}>M</button>
                                    <button onClick={() => { setrez2(!rez2), setrez(false), setrez1(false), setrez3(false) }} className={`${rez2 ? 'bg-[#46A358] text-white ' : "border-[#46A358] border-2"} w-8 h-8 cursor-pointer rounded-[50%]`}>L</button>
                                    <button onClick={() => { setrez3(!rez3), setrez(false), setrez1(false), setrez2(false) }} className={`${rez3 ? 'bg-[#46A358] text-white ' : "border-[#46A358] border-2"} w-8 h-8 cursor-pointer rounded-[50%]`}>XL</button>
                                </div>
                                <div className='flex gap-2 items-center my-4'>
                                    <button className='bg-[#46A358] bg-gradient-to-t from-white/60 text-white font-bold text-xl border w-10 h-10 cursor-pointer rounded-[50%]' onClick={() => setCount(count => Math.max(1, count - 1))} disabled={count <= 1}>-</button>
                                    <button className=' border-1 w-20 h-10  rounded-xl'>{count}</button>
                                    <button className='bg-[#46A358] bg-gradient-to-t from-white/60 text-white font-bold text-xl border w-10 h-10 cursor-pointer rounded-[50%]' onClick={() => setCount(count + 1)}>+</button>
                                    <Link to={'/ToCard'}>
                                        <button className='bg-[#46A358] bg-gradient-to-t from-white/60 text-white font-serif text-l border p-2 px-6 cursor-pointer rounded-xl'>Buy NOW</button>
                                    </Link>
                                </div>
                                <div>
                                    <p className='text-gray-500 flex justify-between'>SKU: <span className='font-medium text-black'> {user.sku}</span></p>
                                    <p className='text-gray-500 flex justify-between'>Categories: <span className='font-medium text-black'>Potter Plants</span></p>
                                    <p className='text-gray-500 flex justify-between'>Tags: <span className='font-medium text-black'> Home, Garden, Plants</span></p>
                                    <div className='flex items-center  gap-2 my-2'>
                                        <p className='font-serif text-xl'>Share this products:</p>
                                        <div className='border border-[#46A358] p-2 text-[#46A358] rounded-[7px] flex justify-center'>
                                            <FaFacebookF />
                                        </div>
                                        <div className='border border-[#46A358] p-2 text-[#46A358] rounded-[7px] flex justify-center'>
                                            <FaInstagram />
                                        </div>
                                        <div className='border border-[#46A358] p-2 text-[#46A358] rounded-[7px] flex justify-center'>
                                            <FaTwitter />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

            </div>
        </div>
    )
}

export default Info