import React, { useEffect, useState } from 'react';
import { Input, Modal, Rate, Spin, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import { useGetUsersQuery } from '../../services/UserApi';
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaTwitter, FaYoutube } from 'react-icons/fa6';
import CarousetProducks from '../../components/carousetProducks';
import { Link } from 'react-router';
import PaymentMethod from '../../components/PaymentMethod';

const Shop = () => {
  const { data: allData, isLoading, error, refetch } = useGetUsersQuery();
  const [selectedImageId, setSelectedImageId] = useState(allData?.[0]?.id || null);
  let [count, setCount] = useState(1);
  let [rez, setrez] = useState(false)
  let [rez1, setrez1] = useState(false)
  let [rez2, setrez2] = useState(false)
  let [rez3, setrez3] = useState(false)
  const [heartItems, setHeartItems] = useState([]);
  const [activeTab, setActiveTab] = useState('description');
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

  const selectedItem = allData?.find(el => el.id === selectedImageId);

  const clampCount = (v) => Math.max(1, Math.min(99, v));
  const getSelectedSize = () => {
    if (rez) return 'S';
    if (rez1) return 'M';
    if (rez2) return 'L';
    if (rez3) return 'XL';
    return 'M';
  };

  const openOrderModal = () => {
    if (!selectedItem) return;
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
    if (!selectedItem) return;
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
    const unitPrice = parseFloat(selectedItem.prase || 0);
    const subtotal = unitPrice * (count || 1);
    const total = subtotal + shipping;
    const orderNumber = String(Date.now()).slice(-8);

    const receiptDataToSave = {
      ...customerForm,
      paymentMethod: selectedPayment,
      items: [
        {
          id: selectedItem.id,
          name: selectedItem.name,
          price: unitPrice,
          avatar: selectedItem.avatar,
          sku: selectedItem.sku,
          quantity: count || 1,
          size: getSelectedSize()
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

  return (
    <div className="">
      <div className="flex flex-col md:flex-row md:gap-6">
        {/* Десктопная галерея (вертикальная) */}
        <div className="hidden md:block md:w-[15%] h-110 overflow-y-auto scrollbar-hide pr-2">
          <div className="space-y-3">
            {allData.map((el) => (
              <div
                key={el.id}
                onClick={() => setSelectedImageId(el.id)}
                className={`relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 border-2 ${selectedImageId === el.id
                  ? 'border-[#46A358]'
                  : 'border-transparent hover:border-gray-300'
                  }`}
              >
                <img
                  src={el.avatar}
                  alt={el.name}
                  className="w-full h-24 object-cover hover:brightness-90 transition-all duration-300"
                />
                {selectedImageId === el.id && (
                  <div className="absolute inset-0 bg-[#46A358]/10 flex items-center justify-center">
                    <div className="w-6 h-6 bg-[#46A358] rounded-full flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full"></div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Основное изображение и детали */}
        <div className="md:flex md:w-[85%] w-full">
          <div className="md:w-[65%] w-full mb-4 md:mb-0">
            {selectedItem ? (
              <div className="relative overflow-hidden rounded-xl shadow-lg">
                <img
                  src={selectedItem.avatar}
                  alt={selectedItem.name}
                  className="w-full h-64 md:h-110 object-cover"
                />

                {/* Информация о товаре */}
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4 md:p-6">
                  <h2 className="text-xl md:text-3xl font-bold text-white mb-1 md:mb-2">
                    {selectedItem.name}
                  </h2>
                  <p className="text-white/90 text-sm md:text-base line-clamp-2">
                    {selectedItem.lorem || selectedItem.description}
                  </p>
                </div>

                {/* Кнопки действий */}
                <div className="absolute top-3 right-3 md:top-4 md:right-4 flex gap-2 md:gap-3">
                  <button
                    onClick={() => Liked(selectedItem)}
                    className="bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={isInHeart(selectedItem.id) ? "#46A358" : "none"}
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke={isInHeart(selectedItem.id) ? "#46A358" : "currentColor"}
                      className="size-4 md:size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z"
                      />
                    </svg>
                  </button>

                  <button
                    onClick={() => ShopFunction(selectedItem)}
                    className="bg-white/90 hover:bg-white p-2 md:p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-110"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill={isInCart(selectedItem.id) ? "#46A358" : "none"}
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke={isInCart(selectedItem.id) ? "#46A358" : "currentColor"}
                      className="size-4 md:size-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-64 md:h-400 flex items-center justify-center bg-gray-100 rounded-xl">
                <p className="text-gray-500 text-sm md:text-base">
                  Select an image from the sidebar
                </p>
              </div>
            )}
          </div>

          <div className="md:hidden mb-4">
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {allData.map((el) => (
                <div
                  key={el.id}
                  onClick={() => setSelectedImageId(el.id)}
                  className={`flex-shrink-0 w-20 h-20 relative overflow-hidden rounded-lg cursor-pointer transition-all duration-300 border-2 ${selectedImageId === el.id
                    ? 'border-[#46A358]'
                    : 'border-transparent hover:border-gray-300'
                    }`}
                >
                  <img
                    src={el.avatar}
                    alt={el.name}
                    className="w-full h-full object-cover hover:brightness-90 transition-all duration-300"
                  />
                  {selectedImageId === el.id && (
                    <div className="absolute inset-0 bg-[#46A358]/10 flex items-center justify-center">
                      <div className="w-4 h-4 bg-[#46A358] rounded-full flex items-center justify-center">
                        <div className="w-1.5 h-1.5 bg-white rounded-full"></div>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Детальная информация о товаре */}
          <div className="md:w-[35%] md:ml-6 w-full overflow-y-auto md:h-110 scrollbar-hide rounded-xl">
            {selectedItem && (
              <div className="p-4 md:p-6 py-3 bg-[#46A3581A] rounded-xl shadow-sm">
                <h3 className="text-lg md:text-2xl font-bold mb-2">
                  {selectedItem.name}
                </h3>

                <div className="flex flex-col md:flex-row md:justify-between items-start md:items-center mb-4 pb-3 border-b-2 border-[#46A358]">
                  <span className="font-medium text-2xl md:text-3xl text-[#46A358] mb-2 md:mb-0">
                    ${selectedItem.prase}
                  </span>
                  <div>
                    <Rate allowHalf defaultValue={3.5} size={window.innerWidth < 768 ? "small" : undefined} />
                    <p className="text-gray-600 text-sm md:text-base">
                      19 Customer Review
                    </p>
                  </div>
                </div>

                <div className="mb-3">
                  <h4 className="font-semibold text-base md:text-lg mb-2 text-[#46A358]">
                    Specifications
                  </h4>
                  <p className="text-gray-700 font-serif text-sm md:text-base">
                    {selectedItem.lorem || 'No description available.'}
                  </p>
                </div>

                <div className="flex flex-row items-center gap-2 mb-3">
                  <p className="font-bold text-sm md:text-base">Size:</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setrez(!rez);
                        setrez1(false);
                        setrez2(false);
                        setrez3(false);
                      }}
                      className={`${rez
                        ? "bg-[#46A358] text-white"
                        : "border-[#46A358] border-2"
                        } w-7 h-7 md:w-8 md:h-8 cursor-pointer rounded-[50%] text-xs md:text-sm`}
                    >
                      S
                    </button>
                    <button
                      onClick={() => {
                        setrez1(!rez1);
                        setrez(false);
                        setrez2(false);
                        setrez3(false);
                      }}
                      className={`${rez1
                        ? "bg-[#46A358] text-white"
                        : "border-[#46A358] border-2"
                        } w-7 h-7 md:w-8 md:h-8 cursor-pointer rounded-[50%] text-xs md:text-sm`}
                    >
                      M
                    </button>
                    <button
                      onClick={() => {
                        setrez2(!rez2);
                        setrez(false);
                        setrez1(false);
                        setrez3(false);
                      }}
                      className={`${rez2
                        ? "bg-[#46A358] text-white"
                        : "border-[#46A358] border-2"
                        } w-7 h-7 md:w-8 md:h-8 cursor-pointer rounded-[50%] text-xs md:text-sm`}
                    >
                      L
                    </button>
                    <button
                      onClick={() => {
                        setrez3(!rez3);
                        setrez(false);
                        setrez1(false);
                        setrez2(false);
                      }}
                      className={`${rez3
                        ? "bg-[#46A358] text-white"
                        : "border-[#46A358] border-2"
                        } w-7 h-7 md:w-8 md:h-8 cursor-pointer rounded-[50%] text-xs md:text-sm`}
                    >
                      XL
                    </button>
                  </div>
                </div>

                  <div className="flex items-center my-4 gap-2">
                    <button
                      className="bg-[#46A358] bg-gradient-to-t from-white/60 text-white font-bold text-lg md:text-xl border w-8 h-8 md:w-10 md:h-10 cursor-pointer rounded-[50%]"
                      onClick={() => setCount((count) => Math.max(1, count - 1))}
                      disabled={count <= 1}
                    >
                      -
                    </button>
                    <span className="border-1 w-16 md:w-20 h-8 md:h-10 rounded-xl flex items-center justify-center text-sm md:text-base">
                      {count}
                    </span>
                    <button
                      className="bg-[#46A358] bg-gradient-to-t from-white/60 text-white font-bold text-lg md:text-xl border w-8 h-8 md:w-10 md:h-10 cursor-pointer rounded-[50%]"
                      onClick={() => setCount(count + 1)}
                    >
                      +
                    </button>
                  <Link to={"/ToCard"} className="mt-2 md:mt-0">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.preventDefault();
                        openOrderModal();
                      }}
                      className="bg-[#46A358] bg-gradient-to-t from-white/60 text-white font-serif text-sm md:text-l border p-2 px-4 md:px-6 cursor-pointer rounded-xl w-full md:w-auto"
                    >
                      Buy NOW
                    </button>
                  </Link>
                  </div>
               

                <div className="space-y-2">
                  <p className="text-gray-500 flex justify-between text-sm md:text-base">
                    SKU:{" "}
                    <span className="font-medium text-black">{selectedItem.sku}</span>
                  </p>
                  <p className="text-gray-500 hidden md:flex justify-between text-sm md:text-base">
                    Categories:{" "}
                    <span className="font-medium text-black">Potter Plants</span>
                  </p>
                  <p className="text-gray-500 hidden md:flex justify-between text-sm md:text-base">
                    Tags:{" "}
                    <span className="font-medium text-black">Home, Garden, Plants</span>
                  </p>

                  <div className="flex justify-between items-center gap-2 mt-3">
                    <p className="font-serif text-base md:text-xl">Share this product:</p>
                    <div className="flex gap-2">
                      <div className="border border-[#46A358] p-1.5 md:p-2 text-[#46A358] rounded-[7px] flex justify-center">
                        <FaFacebookF className="text-sm md:text-base" />
                      </div>
                      <div className="border border-[#46A358] p-1.5 md:p-2 text-[#46A358] rounded-[7px] flex justify-center">
                        <FaInstagram className="text-sm md:text-base" />
                      </div>
                      <div className="border border-[#46A358] p-1.5 md:p-2 text-[#46A358] rounded-[7px] flex justify-center">
                        <FaTwitter className="text-sm md:text-base" />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>


      <div>
        <div className='flex gap-8 font-serif text-xl border-b-2 border-[#46A358] py-4 my-10'>
          <button
            onClick={() => setActiveTab('description')}
            className={`px-4 py-2 font-semibold text-xl transition-all duration-200 ${activeTab === 'description'
              ? 'text-[#46A358] border-b-2 border-[#46A358] -mb-[2px]'
              : 'text-gray-600 hover:text-[#46A358]'
              }`}
          >
            Product Description
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`px-4 py-2 font-semibold text-xl transition-all duration-200 ${activeTab === 'reviews'
              ? 'text-[#46A358] border-b-2 border-[#46A358] -mb-[2px]'
              : 'text-gray-600 hover:text-[#46A358]'
              }`}
          >
            Reviews (19)
          </button>
        </div>
        <div>
          {activeTab === 'description' && (
            <div>
              <p className='font-serif my-4'>The ceramic cylinder planters come with a wooden stand to help elevate your plants off the ground. The ceramic cylinder planters come with a wooden stand to help elevate your plants off the ground. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam fringilla augue nec est tristique auctor. Donec non est at libero vulputate rutrum. Morbi ornare lectus quis justo gravida semper. Nulla tellus mi, vulputate adipiscing cursus eu, suscipit id nulla.</p>
              <p className='font-serif my-4'>Pellentesque aliquet, sem eget laoreet ultrices, ipsum metus feugiat sem, quis fermentum turpis eros eget velit. Donec ac tempus ante. Fusce ultricies massa massa. Fusce aliquam, purus eget sagittis vulputate, sapien libero hendrerit est, sed commodo augue nisi non neque. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed tempor, lorem et placerat vestibulum, metus nisi posuere nisl, in accumsan elit odio quis mi. Cras neque metus, consequat et blandit et, luctus a nunc. Etiam gravida vehicula tellus, in imperdiet ligula euismod eget. The ceramic cylinder planters come with a wooden stand to help elevate your plants off the ground. </p>
              <p className='font-bold'>Living Room:</p>
              <p className='font-serif mb-4'>The ceramic cylinder planters come with a wooden stand to help elevate your plants off the ground. The ceramic cylinder planters come with a wooden stand to help elevate your plants off the ground. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className='font-bold'>Dining Room:</p>
              <p className='font-serif mb-4'>The ceramic cylinder planters come with a wooden stand to help elevate your plants off the ground. The ceramic cylinder planters come with a wooden stand to help elevate your plants off the ground. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
              <p className='font-bold'>Benefits:</p>
              <p className='font-serif mb-4'>The benefits of houseplants are endless. In addition to cleaning the air of harmful toxins, they can help to improve your mood, reduce stress and provide you with better sleep. Fill every room of your home with houseplants and their restorative qualities will improve your life.</p>
              <p className='font-bold'>Office:</p>
              <p className='font-serif mb-4'>The ceramic cylinder planters come with a wooden stand to help elevate your plants off the ground. The ceramic cylinder planters come with a wooden stand to help elevate your plants off the ground. Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6 max-h-[600px] overflow-y-auto scrollbar-hide pr-2">
              {[
                { id: 1, name: 'Sarah Johnson', rating: 5, date: '2 days ago', comment: 'Absolutely love this plant! It arrived in perfect condition and has been thriving in my living room. The ceramic planter is beautiful and the wooden stand is a nice touch.' },
                { id: 2, name: 'Michael Chen', rating: 5, date: '1 week ago', comment: 'Great quality product. The plant is healthy and the design is modern. Highly recommend for anyone looking to add some greenery to their space.' },
                { id: 3, name: 'Emily Davis', rating: 4, date: '2 weeks ago', comment: 'Beautiful plant and excellent customer service. The only minor issue was the packaging, but the plant itself is perfect. Very happy with my purchase!' },
                { id: 4, name: 'David Wilson', rating: 5, date: '3 weeks ago', comment: 'This is my third purchase from this seller. Always reliable quality. The plant adds so much life to my office space. The wooden stand makes it look very elegant.' },
                { id: 5, name: 'Jessica Martinez', rating: 4, date: '1 month ago', comment: 'Really happy with this purchase. The plant is easy to care for and looks great in my dining room. The ceramic planter is well-made and sturdy.' },
                { id: 6, name: 'Robert Taylor', rating: 5, date: '1 month ago', comment: 'Excellent product! The plant came well-packaged and is thriving. The combination of ceramic and wood is very stylish. Would definitely buy again.' },
                { id: 7, name: 'Amanda Brown', rating: 5, date: '1 month ago', comment: 'Perfect addition to my home! The plant is healthy, beautiful, and the planter design is exactly what I was looking for. Great value for money.' },
                { id: 8, name: 'James Anderson', rating: 4, date: '2 months ago', comment: 'Good quality plant and attractive design. The wooden stand elevates the plant nicely. My only suggestion would be to offer more size options.' },
                { id: 9, name: 'Lisa Thomas', rating: 5, date: '2 months ago', comment: 'Absolutely love it! The plant has been growing beautifully and the ceramic planter with wooden stand is a perfect combination. Highly recommend!' },
                { id: 10, name: 'Christopher Lee', rating: 5, date: '2 months ago', comment: 'Fantastic product! The plant arrived healthy and is doing great. The design is modern and fits perfectly with my home decor. Very satisfied!' },
                { id: 11, name: 'Maria Garcia', rating: 4, date: '3 months ago', comment: 'Great plant and beautiful design. The ceramic planter is high quality and the wooden stand adds a nice natural touch. Very happy with my purchase.' },
                { id: 12, name: 'Daniel Rodriguez', rating: 5, date: '3 months ago', comment: 'Excellent quality! The plant is thriving and the planter design is exactly what I wanted. The wooden stand makes it look very elegant. Highly recommended!' },
                { id: 13, name: 'Jennifer White', rating: 5, date: '3 months ago', comment: 'Perfect plant for my living room! It adds so much life and freshness to the space. The ceramic and wood combination is beautiful. Love it!' },
                { id: 14, name: 'Matthew Harris', rating: 4, date: '4 months ago', comment: 'Very nice plant and well-made planter. The wooden stand is sturdy and looks great. The plant is easy to maintain and has been growing well.' },
                { id: 15, name: 'Nicole Clark', rating: 5, date: '4 months ago', comment: 'Absolutely beautiful! The plant is healthy and the design is modern. The ceramic planter with wooden stand is a perfect combination. Great purchase!' },
                { id: 16, name: 'Ryan Lewis', rating: 5, date: '4 months ago', comment: 'Excellent product! The plant arrived in perfect condition and is thriving. The design is elegant and the quality is outstanding. Very satisfied!' },
                { id: 17, name: 'Stephanie Walker', rating: 4, date: '5 months ago', comment: 'Great plant and beautiful design. The ceramic planter is well-crafted and the wooden stand adds a nice touch. The plant is easy to care for.' },
                { id: 18, name: 'Kevin Hall', rating: 5, date: '5 months ago', comment: 'Perfect addition to my office! The plant is thriving and the planter design is exactly what I was looking for. Highly recommend this product!' },
                { id: 19, name: 'Rachel Young', rating: 5, date: '5 months ago', comment: 'Love this plant! It has been growing beautifully and the ceramic planter with wooden stand is a perfect combination. Great quality and value!' }
              ].map((review) => (
                <div key={review.id} className="border-b border-gray-200 pb-6 last:border-b-0">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-1">{review.name}</h4>
                      <Rate
                        disabled
                        defaultValue={review.rating}
                        className="text-sm mb-1"
                      />
                    </div>
                    <span className="text-sm text-gray-500">{review.date}</span>
                  </div>
                  <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      <CarousetProducks />

      {/* Modal 1: Order card + payment */}
      <Modal
        title={<span className="font-bold">Your order</span>}
        open={isOrderModalOpen}
        onCancel={() => setIsOrderModalOpen(false)}
        footer={null}
        width={720}
      >
        {selectedItem ? (
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex gap-3 flex-1">
              <img
                src={selectedItem.avatar}
                alt={selectedItem.name}
                className="w-24 h-24 rounded-xl object-cover"
              />
              <div className="min-w-0 flex-1">
                <p className="text-lg font-bold text-gray-900 line-clamp-2">
                  {selectedItem.name}
                </p>
                <p className="text-sm text-gray-500">
                  SKU: {selectedItem.sku || 'N/A'} • Size: {getSelectedSize()}
                </p>
                <div className="mt-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-[#46A358] hover:text-white transition-colors font-bold"
                      onClick={() => setCount((c) => clampCount((c || 1) - 1))}
                      disabled={count <= 1}
                    >
                      -
                    </button>
                    <span className="w-10 text-center font-semibold">{count}</span>
                    <button
                      className="w-9 h-9 rounded-lg bg-gray-100 hover:bg-[#46A358] hover:text-white transition-colors font-bold"
                      onClick={() => setCount((c) => clampCount((c || 1) + 1))}
                    >
                      +
                    </button>
                  </div>
                  <p className="text-lg font-bold text-[#46A358]">
                    ${(parseFloat(selectedItem.prase || 0) * (count || 1)).toFixed(2)}
                  </p>
                </div>
              </div>
            </div>

            <div className="w-full md:w-72 bg-gray-50 rounded-xl p-4">
              <p className="font-bold text-gray-900 mb-3">Summary</p>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span className="font-semibold">
                    ${(parseFloat(selectedItem.prase || 0) * (count || 1)).toFixed(2)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span className="font-semibold">$16.00</span>
                </div>
                <div className="border-t pt-2 flex justify-between">
                  <span className="font-bold">Total</span>
                  <span className="font-bold text-[#46A358]">
                    ${(parseFloat(selectedItem.prase || 0) * (count || 1) + 16).toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="mt-4">
                <PaymentMethod selectedPayment={selectedPayment} onPaymentChange={setSelectedPayment} />
              </div>

              <button
                onClick={proceedToCustomerModal}
                className="w-full mt-4 py-3 rounded-lg bg-[#46A358] text-white hover:bg-[#3a8a47] transition-colors font-semibold"
              >
                Continue
              </button>
            </div>
          </div>
        ) : null}
      </Modal>

      {/* Modal 2: Customer info */}
      <Modal
        title={<span className="font-bold">Customer information</span>}
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
        title={<span className="font-bold">Receipt</span>}
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
                <p className="font-bold text-gray-900">{receiptData.orderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Date</p>
                <p className="font-semibold text-gray-900">
                  {new Date(receiptData.date).toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment</p>
                <p className="font-semibold text-gray-900 capitalize">{receiptData.paymentMethod}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Total</p>
                <p className="font-bold text-[#46A358]">${receiptData.total}</p>
              </div>
            </div>

            <div className="space-y-3 mb-4">
              {receiptData.items.map((it) => (
                <div key={it.id} className="flex items-center justify-between border-b pb-2">
                  <div className="flex items-center gap-3 min-w-0">
                    <img src={it.avatar} alt={it.name} className="w-12 h-12 rounded-lg object-cover" />
                    <div className="min-w-0">
                      <p className="font-semibold text-gray-900 line-clamp-1">{it.name}</p>
                      <p className="text-xs text-gray-500">
                        Qty: {it.quantity} • Size: {it.size}
                      </p>
                    </div>
                  </div>
                  <p className="font-semibold text-[#46A358]">
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
  );
};

export default Shop;