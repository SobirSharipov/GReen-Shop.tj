import React, { useState, useEffect, useMemo, useCallback } from 'react'
import { Link, useParams } from 'react-router'
import { Input, Modal, Rate, Spin, message } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import { useGetUsersQuery } from '../../services/UserApi'
import { FaFacebookF, FaInstagram, FaTwitter, FaShoppingCart, FaHeart, FaShareAlt } from 'react-icons/fa'
import PaymentMethod from '../../components/PaymentMethod'
import { mergeProducts } from '../../utils/products'

const Info = () => {
    const { data: dataRaw, refetch } = useGetUsersQuery();
    const data = useMemo(() => mergeProducts(dataRaw || []), [dataRaw]);
    let { id } = useParams()

    const [product, setProduct] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [selectedSize, setSelectedSize] = useState('M')
    const [count, setCount] = useState(1);
    const [selectedImage, setSelectedImage] = useState(null)
    const [randomThumbnails, setRandomThumbnails] = useState([])
    const [selectedPayment, setSelectedPayment] = useState(null);

    // Purchase flow modals
    const [isOrderModalOpen, setIsOrderModalOpen] = useState(false);
    const [isCustomerModalOpen, setIsCustomerModalOpen] = useState(false);
    const [isReceiptModalOpen, setIsReceiptModalOpen] = useState(false);
    const [receiptData, setReceiptData] = useState(null);

    const [customerForm, setCustomerForm] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        street: '',
        notes: ''
    });

    const user = useMemo(() => {
        if (!data || !id) return null;
        return data.find((u) => String(u.id) === String(id));
    }, [data, id]);

    // Инициализация продукта
    useEffect(() => {
        if (user) {
            setProduct(user)
            setSelectedImage(user.avatar)
            setLoading(false)
        } else if (data) {
            setError('Product not found')
            setLoading(false)
        }
    }, [user, data])

    // Generate random thumbnails - FIXED
    useEffect(() => {
        if (data && data.length > 0 && user) {
            // Filter out current user's image and get random 6
            const filteredData = data.filter(el => {
                return el.avatar !== user.avatar && el.id !== user.id;
            });

            // Используем стабильный алгоритм для выбора случайных элементов
            const getRandomElements = (arr, count) => {
                const shuffled = [...arr];
                for (let i = shuffled.length - 1; i > 0; i--) {
                    const j = Math.floor(Math.random() * (i + 1));
                    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
                }
                return shuffled.slice(0, count);
            };

            const randomItems = getRandomElements(filteredData, 6);
            setRandomThumbnails(randomItems);
        }
    }, [data, user]) // Исправлены зависимости

    const [heartItems, setHeartItems] = useState([]);

    const isInHeart = useCallback((id) => {
        return heartItems.some(item => item.id === id);
    }, [heartItems]);

    const Liked = useCallback((el) => {
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
    }, [refetch]);

    useEffect(() => {
        const savedHeart = localStorage.getItem('Heart');
        if (savedHeart) {
            setHeartItems(JSON.parse(savedHeart));
        }
    }, [])

    const [Shop, setShop] = useState([]);

    const ShopFunction = useCallback((el, quantity = count) => {
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
    }, [count, refetch]);

    useEffect(() => {
        const savedCart = localStorage.getItem('Cart');
        if (savedCart) {
            setShop(JSON.parse(savedCart));
        }
    }, []);

    const isInCart = useCallback((id) => {
        return Shop.some(item => item.id === id);
    }, [Shop]);

    const clampCount = (v) => Math.max(1, Math.min(99, v));

    const openOrderModal = () => {
        setIsOrderModalOpen(true);
    };

    const validateCustomerForm = () => {
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'city', 'street'];
        const missing = requiredFields.filter((k) => !customerForm[k] || customerForm[k].trim() === '');
        if (missing.length > 0) {
            message.error('Please fill in all required fields (*)');
            return false;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(customerForm.email)) {
            message.error('Please enter a valid email address');
            return false;
        }
        return true;
    };

    const proceedToCustomerModal = () => {
        // Auth check (same behavior as ModalAddres)
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const userData = localStorage.getItem('user');
        if (!isAuthenticated || !userData) {
            message.warning('Please register or login to complete your purchase.');
            window.dispatchEvent(new CustomEvent('openAuthModal'));
            return;
        }

        const validPaymentMethods = ['paypal', 'mastercard', 'visa'];
        if (!selectedPayment || !validPaymentMethods.includes(selectedPayment)) {
            message.warning('Please select a payment method (PayPal, MasterCard, or VISA).');
            return;
        }

        setIsOrderModalOpen(false);
        setTimeout(() => setIsCustomerModalOpen(true), 150);
    };

    const completePurchase = () => {
        if (!validateCustomerForm()) return;

        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const userData = localStorage.getItem('user');
        if (!isAuthenticated || !userData) {
            message.warning('Please register or login to complete your purchase.');
            window.dispatchEvent(new CustomEvent('openAuthModal'));
            return;
        }

        const parsedUser = JSON.parse(userData);
        const userId = parsedUser.email || parsedUser.username;

        const shipping = 16.0;
        const subtotal = (parseFloat(user.prase || 0) * (count || 1));
        const total = subtotal + shipping;
        const orderNumber = String(Date.now()).slice(-8);

        const receiptDataToSave = {
            ...customerForm,
            paymentMethod: selectedPayment,
            items: [
                {
                    id: user.id,
                    name: user.name,
                    price: parseFloat(user.prase || 0),
                    avatar: user.avatar,
                    sku: user.sku,
                    quantity: count || 1,
                    size: selectedSize
                }
            ],
            subtotal: subtotal.toFixed(2),
            shipping: shipping.toFixed(2),
            total: total.toFixed(2),
            orderNumber,
            date: new Date().toISOString(),
            userId
        };

        const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
        purchaseHistory.push(receiptDataToSave);
        localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));

        setReceiptData(receiptDataToSave);
        setIsCustomerModalOpen(false);
        setTimeout(() => setIsReceiptModalOpen(true), 150);

        // reset customer form for next time
        setCustomerForm({
            firstName: '',
            lastName: '',
            email: '',
            phone: '',
            city: '',
            street: '',
            notes: ''
        });
    };

    // Используем useMemo для вычисления значений, которые используются в JSX
    const thumbnailData = useMemo(() => {
        if (!data || data.length === 0 || randomThumbnails.length === 0 || !user) {
            return null;
        }

        const currentMainImage = selectedImage || user.avatar;
        const isMainImageSelected = !randomThumbnails.some(el => el.avatar === selectedImage);

        return {
            currentMainImage,
            isMainImageSelected,
            randomThumbnails
        };
    }, [data, randomThumbnails, user, selectedImage]);

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
        <div className="min-h-screen bg-[#FBFBFB]" style={{ fontFamily: 'Inter-Regular, sans-serif' }}>
            <div className="max-w-7xl mx-auto px-4 ">

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
                                    className={`p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 ${isInHeart(user.id)
                                            ? 'bg-[#46A358] text-white'
                                            : 'bg-white/90 text-gray-700 hover:bg-white'
                                        }`}
                                    title={isInHeart(user.id) ? 'Remove from favorites' : 'Add to favorites'}
                                >
                                    <FaHeart className="text-lg" />
                                </button>
                                <button
                                    onClick={() => ShopFunction(user)}
                                    className={`p-3 rounded-full shadow-lg backdrop-blur-sm transition-all duration-200 hover:scale-110 ${isInCart(user.id)
                                            ? 'bg-[#46A358] text-white'
                                            : 'bg-white/90 text-gray-700 hover:bg-white'
                                        }`}
                                    title={isInCart(user.id) ? 'Remove from cart' : 'Add to cart'}
                                >
                                    <FaShoppingCart className="text-lg" />
                                </button>
                            </div>
                        </div>

                        {/* Thumbnail Gallery - FIXED */}
                        {thumbnailData && (
                            <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide">
                                {/* First thumbnail - current main image */}
                                <button
                                    onClick={() => setSelectedImage(thumbnailData.currentMainImage)}
                                    className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${thumbnailData.isMainImageSelected
                                            ? 'border-[#46A358] ring-2 ring-[#46A358]/20'
                                            : 'border-gray-200 hover:border-[#46A358]'
                                        }`}
                                >
                                    <img
                                        src={thumbnailData.currentMainImage}
                                        alt="Main image"
                                        className="w-full h-full object-cover"
                                    />
                                </button>
                                {/* Random thumbnails */}
                                {thumbnailData.randomThumbnails.map((el, index) => (
                                    <button
                                        key={`${el.id}-${index}`}
                                        onClick={() => setSelectedImage(el.avatar)}
                                        className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === el.avatar
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
                        )}
                    </div>

                    {/* Right Side - Product Info */}
                    <div className="lg:w-[40%]">
                        <div className="bg-white rounded-2xl shadow-lg p-8">
                            {/* Product Name */}
                            <h1 className="text-4xl font-bold text-gray-900 mb-4" style={{ fontFamily: 'Montserrat-Bold, sans-serif' }}>{user.name}</h1>

                            {/* Price and Rating */}
                            <div className="flex items-center justify-between mb-6 pb-6 border-b-2 border-gray-100">
                                <div>
                                    <span className="text-4xl font-bold text-[#46A358]" style={{ fontFamily: 'Montserrat-Bold, sans-serif' }}>${user.prase}</span>
                                </div>
                                <div className="text-right">
                                    <Rate allowHalf defaultValue={4} disabled className="mb-2" />
                                    <p className="text-sm text-gray-600">19 Customer Reviews</p>
                                </div>
                            </div>

                            {/* Description */}
                            <div className="mb-6">
                                <h3 className="text-lg font-bold text-gray-900 mb-3" style={{ fontFamily: 'Montserrat-Bold, sans-serif' }}>Description</h3>
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
                                        className={`w-12 h-12 rounded-lg font-semibold transition-all duration-200 ${selectedSize === size
                                                ? 'bg-[#46A358] text-white shadow-lg scale-105'
                                                : 'bg-gray-100 text-gray-700 border-2 border-gray-200 hover:border-[#46A358] hover:bg-gray-50'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>

                            {/* Count + Buy */}
                            <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
                                <div className="flex items-center gap-2">
                                    <span className="text-sm font-semibold text-gray-700" style={{ fontFamily: 'Inter-SemiBold, sans-serif' }}>
                                        Count:
                                    </span>
                                    <div className="flex items-center gap-2">
                                        <button
                                            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-[#46A358] hover:text-white transition-colors font-bold"
                                            onClick={() => setCount((c) => clampCount((c || 1) - 1))}
                                            disabled={count <= 1}
                                            style={{ fontFamily: 'Inter-Bold, sans-serif' }}
                                        >
                                            -
                                        </button>
                                        <span className="w-10 text-center font-semibold" style={{ fontFamily: 'Inter-SemiBold, sans-serif' }}>
                                            {count}
                                        </span>
                                        <button
                                            className="w-10 h-10 rounded-lg bg-gray-100 hover:bg-[#46A358] hover:text-white transition-colors font-bold"
                                            onClick={() => setCount((c) => clampCount((c || 1) + 1))}
                                            style={{ fontFamily: 'Inter-Bold, sans-serif' }}
                                        >
                                            +
                                        </button>
                                    </div>
                                </div>

                                <button
                                    onClick={openOrderModal}
                                    className="w-full sm:w-auto flex-1 bg-[#46A358] text-white py-3 px-6 rounded-lg hover:bg-[#3a8a47] transition-colors font-semibold"
                                    style={{ fontFamily: 'Inter-SemiBold, sans-serif' }}
                                >
                                    Buy now
                                </button>
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

            {/* Modal 1: Order card + payment */}
            <Modal
                title={<span style={{ fontFamily: 'Montserrat-Bold, sans-serif' }}>Your order</span>}
                open={isOrderModalOpen}
                onCancel={() => setIsOrderModalOpen(false)}
                footer={null}
                width={720}
            >
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="flex gap-3 flex-1">
                        <img
                            src={user.avatar}
                            alt={user.name}
                            className="w-24 h-24 rounded-xl object-cover"
                        />
                        <div className="min-w-0 flex-1">
                            <p className="text-lg font-bold text-gray-900 line-clamp-2" style={{ fontFamily: 'Montserrat-Bold, sans-serif' }}>
                                {user.name}
                            </p>
                            <p className="text-sm text-gray-500" style={{ fontFamily: 'Inter-Regular, sans-serif' }}>
                                SKU: {user.sku || 'N/A'} • Size: {selectedSize}
                            </p>
                            <div className="mt-2 flex items-center justify-between">
                                <div className="flex items-center gap-2">
                                    <button
                                        className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-[#46A358] hover:text-white transition-colors font-bold"
                                        onClick={() => setCount((c) => clampCount((c || 1) - 1))}
                                        disabled={count <= 1}
                                        style={{ fontFamily: 'Inter-Bold, sans-serif' }}
                                    >
                                        -
                                    </button>
                                    <span className="w-10 text-center font-semibold" style={{ fontFamily: 'Inter-SemiBold, sans-serif' }}>
                                        {count}
                                    </span>
                                    <button
                                        className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-[#46A358] hover:text-white transition-colors font-bold"
                                        onClick={() => setCount((c) => clampCount((c || 1) + 1))}
                                        style={{ fontFamily: 'Inter-Bold, sans-serif' }}
                                    >
                                        +
                                    </button>
                                </div>
                                <p className="text-lg font-bold text-[#46A358]" style={{ fontFamily: 'Montserrat-Bold, sans-serif' }}>
                                    ${(parseFloat(user.prase || 0) * (count || 1)).toFixed(2)}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="w-full md:w-72 bg-gray-50 rounded-xl p-4">
                        <p className="font-bold text-gray-900 mb-3" style={{ fontFamily: 'Montserrat-Bold, sans-serif' }}>
                            Summary
                        </p>
                        <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-semibold" style={{ fontFamily: 'Inter-SemiBold, sans-serif' }}>
                                    ${(parseFloat(user.prase || 0) * (count || 1)).toFixed(2)}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-semibold" style={{ fontFamily: 'Inter-SemiBold, sans-serif' }}>$16.00</span>
                            </div>
                            <div className="border-t pt-2 flex justify-between">
                                <span className="font-bold" style={{ fontFamily: 'Inter-Bold, sans-serif' }}>Total</span>
                                <span className="font-bold text-[#46A358]" style={{ fontFamily: 'Montserrat-Bold, sans-serif' }}>
                                    ${(parseFloat(user.prase || 0) * (count || 1) + 16).toFixed(2)}
                                </span>
                            </div>
                        </div>

                        <div className="mt-4">
                            <PaymentMethod selectedPayment={selectedPayment} onPaymentChange={setSelectedPayment} />
                        </div>

                        <button
                            onClick={proceedToCustomerModal}
                            className="w-full mt-4 py-3 rounded-lg bg-[#46A358] text-white hover:bg-[#3a8a47] transition-colors font-semibold"
                            style={{ fontFamily: 'Inter-SemiBold, sans-serif' }}
                        >
                            Continue
                        </button>
                    </div>
                </div>
            </Modal>

            {/* Modal 2: Customer info */}
            <Modal
                title={<span style={{ fontFamily: 'Montserrat-Bold, sans-serif' }}>Customer information</span>}
                open={isCustomerModalOpen}
                onCancel={() => setIsCustomerModalOpen(false)}
                onOk={completePurchase}
                okText="Pay"
                cancelText="Cancel"
                okButtonProps={{ className: 'bg-[#46A358] hover:bg-[#3a8a47] text-white font-semibold' }}
                width={720}
            >
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            First Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={customerForm.firstName}
                            onChange={(e) => setCustomerForm((p) => ({ ...p, firstName: e.target.value }))}
                            placeholder="Enter your first name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Last Name <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={customerForm.lastName}
                            onChange={(e) => setCustomerForm((p) => ({ ...p, lastName: e.target.value }))}
                            placeholder="Enter your last name"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Email <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={customerForm.email}
                            onChange={(e) => setCustomerForm((p) => ({ ...p, email: e.target.value }))}
                            placeholder="example@email.com"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Phone <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={customerForm.phone}
                            onChange={(e) => setCustomerForm((p) => ({ ...p, phone: e.target.value }))}
                            placeholder="+992 123 456 789"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            City <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={customerForm.city}
                            onChange={(e) => setCustomerForm((p) => ({ ...p, city: e.target.value }))}
                            placeholder="Enter your city"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Street <span className="text-red-500">*</span>
                        </label>
                        <Input
                            value={customerForm.street}
                            onChange={(e) => setCustomerForm((p) => ({ ...p, street: e.target.value }))}
                            placeholder="Enter your street"
                        />
                    </div>
                    <div className="md:col-span-2">
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
                            Notes <span className="text-gray-500 text-xs font-normal">(optional)</span>
                        </label>
                        <TextArea
                            rows={3}
                            value={customerForm.notes}
                            onChange={(e) => setCustomerForm((p) => ({ ...p, notes: e.target.value }))}
                            placeholder="Add any special instructions..."
                            maxLength={200}
                            showCount
                        />
                    </div>
                </div>
            </Modal>

            {/* Modal 3: Receipt */}
            <Modal
                title={<span style={{ fontFamily: 'Montserrat-Bold, sans-serif' }}>Receipt</span>}
                open={isReceiptModalOpen}
                onCancel={() => setIsReceiptModalOpen(false)}
                footer={null}
                width={720}
            >
                {receiptData ? (
                    <div>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4 pb-4 border-b">
                            <div>
                                <p className="text-sm text-gray-500">Order #</p>
                                <p className="font-bold text-gray-900" style={{ fontFamily: 'Inter-Bold, sans-serif' }}>
                                    {receiptData.orderNumber}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Date</p>
                                <p className="font-semibold text-gray-900" style={{ fontFamily: 'Inter-SemiBold, sans-serif' }}>
                                    {new Date(receiptData.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Payment</p>
                                <p className="font-semibold text-gray-900 capitalize" style={{ fontFamily: 'Inter-SemiBold, sans-serif' }}>
                                    {receiptData.paymentMethod}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Total</p>
                                <p className="font-bold text-[#46A358]" style={{ fontFamily: 'Montserrat-Bold, sans-serif' }}>
                                    ${receiptData.total}
                                </p>
                            </div>
                        </div>

                        <div className="space-y-3 mb-4">
                            {receiptData.items.map((it) => (
                                <div key={it.id} className="flex items-center justify-between  pb-2">
                                    <div className="flex items-center gap-3 min-w-0">
                                        <img src={it.avatar} alt={it.name} className="w-12 h-12 rounded-lg object-cover" />
                                        <div className="min-w-0">
                                            <p className="font-semibold text-gray-900 line-clamp-1" style={{ fontFamily: 'Inter-SemiBold, sans-serif' }}>
                                                {it.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                                Qty: {it.quantity} • Size: {it.size}
                                            </p>
                                        </div>
                                    </div>
                                    <p className="font-semibold text-[#46A358]" style={{ fontFamily: 'Inter-Bold, sans-serif' }}>
                                        ${(it.price * it.quantity).toFixed(2)}
                                    </p>
                                </div>
                            ))}
                        </div>

                        <div className="border-t pt-3 space-y-1 text-sm">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-medium">${receiptData.subtotal}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Shipping</span>
                                <span className="font-medium">${receiptData.shipping}</span>
                            </div>
                            <div className="flex justify-between font-bold text-base pt-2 border-t">
                                <span>Total</span>
                                <span className="text-[#46A358]">${receiptData.total}</span>
                            </div>
                        </div>
                    </div>
                ) : null}
            </Modal>
        </div>
    )
}

export default Info