import React, { useState, useEffect } from 'react'
import { Link, useParams } from 'react-router'
import { Rate, Spin } from 'antd'
import { useGetUsersQuery } from '../../services/UserApi'
import { FaFacebookF, FaInstagram, FaTwitter, FaShoppingCart, FaHeart, FaShareAlt } from 'react-icons/fa'

const Info = () => {
    const { data, refetch } = useGetUsersQuery();
    let { id } = useParams()
    let [product, setProduct] = useState(null)
    let [loading, setLoading] = useState(true)
    let [error, setError] = useState(null)
    let [selectedSize, setSelectedSize] = useState('M')
    let [count, setCount] = useState(1);
    let [selectedImage, setSelectedImage] = useState(null)
    const [randomThumbnails, setRandomThumbnails] = useState([])

    const user = data?.find((u) => String(u.id) === String(id));

    useEffect(() => {
        if (user) {
            setProduct(user)
            setSelectedImage(user.avatar)
            setLoading(false)
        } else if (data) {
            setError('Product not found')
            setLoading(false)
        }
    }, [user?.id, data])

    // Generate random thumbnails
    useEffect(() => {
        if (data && data.length > 0 && user) {
            // Filter out current user's image and get random 6
            const filteredData = data.filter(el => el.avatar !== user.avatar && el.id !== user.id);
            const shuffled = [...filteredData].sort(() => Math.random() - 0.5);
            setRandomThumbnails(shuffled.slice(0, 6));
        }
    }, [data, user?.id])

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

    function ShopFunction(el, quantity = count) {
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
                quantity: quantity
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

    if (error || !product) {
        return (
            <div className="text-center p-8">
                <div className="text-red-500 text-xl mb-4">Error: {error || 'Product not found'}</div>
                <Link to="/">
                    <button className="bg-[#46A358] text-white px-6 py-2 rounded-lg hover:bg-[#3a8a47] transition-colors">
                        Go to Home
                    </button>
                </Link>
            </div>
        )
    }

    const sizes = ['S', 'M', 'L', 'XL'];

    return (
        <div className="min-h-screen bg-[#FBFBFB]">
            <div className="max-w-7xl mx-auto px-4 py-8">
               
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Left Side - Images */}
                    <div className="lg:w-[60%]">
                        {/* Main Image */}
                        <div className="relative bg-white rounded-2xl shadow-lg overflow-hidden mb-4 group">
                            <img
                                src={selectedImage || user.avatar}
                                alt={user.name}
                                className="w-full md:h-[600px] h-100 object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                            <div className="absolute top-4 right-4 flex gap-2">
                                <button 
                                    onClick={() => Liked(user)} 
                                    className={`p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
                                        isInHeart(user.id) 
                                            ? 'bg-[#46A358] text-white' 
                                            : 'bg-white/90 text-gray-700 hover:bg-white'
                                    }`}
                                    title={isInHeart(user.id) ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                    <FaHeart className="text-lg" />
                                </button>
                                <button 
                                    onClick={() => ShopFunction(user)} 
                                    className={`p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 ${
                                        isInCart(user.id) 
                                            ? 'bg-[#46A358] text-white' 
                                            : 'bg-white/90 text-gray-700 hover:bg-white'
                                    }`}
                                    title={isInCart(user.id) ? 'Remove from cart' : 'Add to cart'}
                                >
                                    <FaShoppingCart className="text-lg" />
                                </button>
                            </div>
                        </div>

                        {/* Thumbnail Gallery */}
                        {data && data.length > 0 && randomThumbnails.length > 0 && (() => {
                            const currentMainImage = selectedImage || user.avatar;
                            const isMainImageSelected = !randomThumbnails.some(el => el.avatar === selectedImage);
                            
                            return (
                                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                    {/* First thumbnail - current main image */}
                                    <button
                                        onClick={() => setSelectedImage(currentMainImage)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                            isMainImageSelected
                                                ? 'border-[#46A358] ring-2 ring-[#46A358]/20'
                                                : 'border-gray-200 hover:border-[#46A358]'
                                        }`}
                                    >
                                        <img
                                            src={currentMainImage}
                                            alt="Main image"
                                            className="w-full h-full object-cover"
                                        />
                                    </button>
                                    {/* Random thumbnails */}
                                    {randomThumbnails.map((el, index) => (
                                        <button
                                            key={el.id}
                                            onClick={() => setSelectedImage(el.avatar)}
                                            className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${
                                                selectedImage === el.avatar
                                                    ? 'border-[#46A358] ring-2 ring-[#46A358]/20'
                                                    : 'border-gray-200 hover:border-[#46A358]'
                                            }`}
                                        >
                                            <img
                                                src={el.avatar}
                                                alt={`Thumbnail ${index + 1}`}
                                                className="w-full h-full object-cover"
                                            />
                                        </button>
                                    ))}
                                </div>
                            );
                        })()}
                    </div>

                    {/* Right Side - Product Info */}
                    <div className="lg:w-[40%]">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            {/* Product Name */}
                            <h1 className="text-4xl font-bold text-gray-900 mb-4">{user.name}</h1>

                            {/* Price and Rating */}
                            <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-gray-100">
                                <div>
                                    <span className="text-4xl font-bold text-[#46A358]">${user.prase}</span>
                                </div>
                                <div className="text-right">
                                    <Rate allowHalf defaultValue={4.5} disabled className="mb-2" />
                                    <p className="text-sm text-gray-600">19 Customer Reviews</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-3">Description</h3>
                                <p className="text-gray-700 leading-relaxed line-clamp-4">
                                    {user.lorem || 'This beautiful plant will bring life and freshness to your home. Perfect for indoor spaces and easy to care for.'}
                                </p>
                            </div>

                            {/* Size Selection */}
                                <div className="flex mb-5 items-center gap-3">
                                <label className="block text-[13px] font-bold text-gray-700 mb-3">
                                    Size:
                                </label>
                                    {sizes.map((size) => (
                                        <button
                                            key={size}
                                            onClick={() => setSelectedSize(size)}
                                            className={`w-12 h-12 rounded-lg font-semibold transition-all duration-200 ${
                                                selectedSize === size
                                                    ? 'bg-[#46A358] text-white shadow-lg scale-105'
                                                    : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-[#46A358] hover:bg-gray-50'
                                            }`}
                                        >
                                            {size}
                                        </button>
                                    ))}
                                </div>

                            {/* Product Details */}
                            <div className="border-t pt-6 mb-6">
                                <div className="space-y-3">
                                    <div className="flex justify-between items-center ">
                                        <span className="text-gray-600 font-medium">SKU:</span>
                                        <span className="font-semibold text-gray-900">{user.sku || 'N/A'}</span>
                                    </div>
                                    <div className="flex justify-between items-center ">
                                        <span className="text-gray-600 font-medium">Category:</span>
                                        <span className="font-semibold text-gray-900">Potter Plants</span>
                                    </div>
                                    <div className="flex justify-between items-center ">
                                        <span className="text-gray-600 font-medium">Tags:</span>
                                        <span className="font-semibold text-gray-900">Home, Garden, Plants</span>
                                    </div>
                                </div>
                            </div>

                            {/* Share Section */}
                            <div className="border-t pt-3">
                                <div className="flex justify-between items-center gap-4">
                                    <span className="text-gray-700 font-semibold">Share:</span>
                                    <div className="flex gap-3">
                                        <div
                                            className="w-10 h-10 flex items-center justify-center border-2 border-[#46A358] text-[#46A358] rounded-lg hover:bg-[#46A358] hover:text-white transition-all duration-200"
                                            title="Share on Facebook"
                                        >
                                            <FaFacebookF />
                                        </div>
                                        <div
                                            className="w-10 h-10 flex items-center justify-center border-2 border-[#46A358] text-[#46A358] rounded-lg hover:bg-[#46A358] hover:text-white transition-all duration-200"
                                            title="Share on Instagram"
                                        >
                                            <FaInstagram />
                                        </div>
                                        <div
                                            className="w-10 h-10 flex items-center justify-center border-2 border-[#46A358] text-[#46A358] rounded-lg hover:bg-[#46A358] hover:text-white transition-all duration-200"
                                            title="Share on Twitter"
                                        >
                                            <FaTwitter />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Info
