import React, { useEffect, useState } from 'react'
import CarousetProducks from '../../components/carousetProducks';
import { Link } from 'react-router';
import ModalAddres from '../../components/modalAddres';
import PaymentMethod from '../../components/PaymentMethod';

const ToCard = () => {
  let [getCart, setCart] = useState([])
  const [selectedImageId, setSelectedImageId] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    window.addEventListener('resize', handleResize);
    
    let stored = localStorage.getItem('Cart')
    if (stored) {
      setCart(JSON.parse(stored))
    }
    
    return () => window.removeEventListener('resize', handleResize);
  }, [])

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) {
      removeFromCart(id);
      return;
    }

    const updatedCart = getCart.map(item =>
      item.id === id ? { ...item, quantity: newQuantity } : item
    );

    setCart(updatedCart);
    localStorage.setItem('Cart', JSON.stringify(updatedCart));

    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { cartItems: updatedCart }
    }));
  };

  const removeFromCart = (id) => {
    const updatedCart = getCart.filter(item => item.id !== id);
    setCart(updatedCart);
    localStorage.setItem('Cart', JSON.stringify(updatedCart));

    window.dispatchEvent(new CustomEvent('cartUpdated', {
      detail: { cartItems: updatedCart }
    }));
  };

  const getItemTotal = (item) => {
    return (item.price * (item.quantity || 1)).toFixed(2);
  };

  const getCartTotal = () => {
    return getCart.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0).toFixed(2);
  };

  const [showReceipt, setShowReceipt] = useState(false);
  const [receiptData, setReceiptData] = useState(null);

  const handlePurchaseComplete = (purchaseData) => {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    const userData = localStorage.getItem('user');
    
    if (!isAuthenticated || !userData) {
      return;
    }

    const parsedUser = JSON.parse(userData);
    const userId = parsedUser.email || parsedUser.username;
    
    const shipping = 16.00;
    const subtotal = parseFloat(getCartTotal());
    const total = subtotal + shipping;
    
    const orderNumber = String(Date.now()).slice(-8);
    
    const receiptDataToSave = {
      ...purchaseData,
      items: [...getCart],
      subtotal: subtotal.toFixed(2),
      shipping: shipping.toFixed(2),
      total: total.toFixed(2),
      orderNumber: orderNumber,
      date: new Date().toISOString(),
      userId: userId
    };
    
    setReceiptData(receiptDataToSave);
    
    const purchaseHistory = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
    purchaseHistory.push(receiptDataToSave);
    localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
    
    setShowReceipt(true);

    setTimeout(() => {
      setShowReceipt(false);
      setCart([]);
      localStorage.removeItem('Cart');
      window.dispatchEvent(new CustomEvent('cartUpdated', {
        detail: { cartItems: [] }
      }));
      setSelectedPayment(null);
      setReceiptData(null);
    }, 4000);
  };

  if (getCart.length === 0) {
    return (
      <div className="p-4 md:p-8 text-center min-h-[50vh] flex flex-col items-center justify-center">
        <div className="text-4xl md:text-5xl mb-4">🛒</div>
        <p className="text-lg md:text-xl text-gray-600 mb-4">Your shopping cart is empty</p>
        <p className="text-gray-500 mb-6">Add some products to your cart!</p>
        <Link to="/" className="bg-[#46A358] text-white px-6 py-3 rounded-lg hover:bg-[#3a8a47] transition-colors">
          Continue Shopping
        </Link>
      </div>
    )
  }

  return (
    <div className="p-3 md:p-4 relative">
      {/* Receipt Modal - Mobile Optimized */}
      {showReceipt && receiptData && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-3 md:p-4">
          <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto animate-slideUp relative">
            {/* Close Button */}
            <button
              onClick={() => setShowReceipt(false)}
              className="absolute top-3 right-3 md:top-4 md:right-4 text-[#46A358] hover:text-[#3a8a47] transition-colors z-10 bg-white rounded-full p-1 shadow"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-3 md:p-4">
              {/* Header with Thank You Icon */}
              <div className="text-center mb-3 md:mb-4">
                <div className="flex justify-center">
                  <div className="relative">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" className="w-16 h-16 md:w-24 md:h-24">
                      <path d="M10 30 L50 55 L90 30 L90 75 L10 75 Z" fill="none" stroke="#46A358" strokeWidth="2" strokeLinejoin="round"/>
                      <path d="M10 30 L50 55 L90 30" fill="none" stroke="#46A358" strokeWidth="2" strokeLinecap="round"/>
                      <path d="M50 40 C45 35, 38 35, 38 40 C38 45, 50 55, 50 55 C50 55, 62 45, 62 40 C62 35, 55 35, 50 40 Z" fill="#46A358" opacity="0.3"/>
                      <text x="50" y="48" textAnchor="middle" fontSize="7" fill="#46A358" fontWeight="bold">THANK</text>
                      <text x="50" y="56" textAnchor="middle" fontSize="7" fill="#46A358" fontWeight="bold">YOU</text>
                    </svg>
                  </div>
                </div>
                <h2 className="text-lg md:text-xl font-bold text-gray-800 mt-2">Order Confirmed!</h2>
                <p className="text-xs md:text-sm text-gray-500">Your order has been received</p>
              </div>

              {/* Order Summary Bar */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mb-4 md:mb-6 pb-4 border-b border-gray-200">
                <div>
                  <p className="text-xs text-gray-500 mb-1">Order #</p>
                  <p className="text-sm font-semibold text-gray-800">{receiptData.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 mb-1">Date</p>
                  <p className="text-sm font-semibold text-gray-800">{new Date().toLocaleDateString('en-US', { day: 'numeric', month: 'short' })}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <p className="text-xs text-gray-500 mb-1">Total</p>
                  <p className="text-sm font-semibold text-gray-800">${receiptData.total}</p>
                </div>
                <div className="mt-2 md:mt-0">
                  <p className="text-xs text-gray-500 mb-1">Payment</p>
                  <p className="text-sm font-semibold text-gray-800 capitalize">
                    {receiptData.paymentMethod === 'paypal' ? 'PayPal' : 
                     receiptData.paymentMethod === 'mastercard' ? 'MasterCard' : 
                     receiptData.paymentMethod === 'visa' ? 'VISA' : 'Cash on delivery'}
                  </p>
                </div>
              </div>

              {/* Order Details */}
              <div className="mb-4 md:mb-6 max-h-48 md:max-h-64 overflow-y-auto pr-1">
                <h3 className="font-bold text-base md:text-lg mb-3">Order Details</h3>
                <div className="space-y-3">
                  {receiptData.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b border-gray-100 pb-2">
                      <div className="flex items-center gap-2">
                        <img
                          src={item.avatar}
                          alt={item.name}
                          className="w-12 h-12 md:w-16 md:h-16 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-semibold text-sm md:text-base text-gray-800 line-clamp-1">{item.name}</p>
                          <p className="text-xs text-gray-500">Qty: {item.quantity || 1}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-[#46A358] text-sm md:text-base">
                          ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping and Total */}
              <div className="border-t border-gray-200 pt-3 md:pt-4 mb-4">
                <div className="flex justify-between text-sm mb-1 md:mb-2">
                  <span className="text-gray-600">Shipping:</span>
                  <span className="text-gray-800">${receiptData.shipping || '16.00'}</span>
                </div>
                <div className="flex justify-between font-bold text-base md:text-lg pt-2 border-t border-gray-300">
                  <span className="text-gray-800">Total:</span>
                  <span className="text-[#46A358]">${receiptData.total}</span>
                </div>
              </div>
              
              <div className="text-center mt-4">
                <p className="text-xs md:text-sm text-gray-500">
                  This window will close automatically...
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="mb-4 md:mb-6 text-center">
        <h1 className="text-xl md:text-2xl font-bold text-[#46A358]">My Cart</h1>
        <p className="text-sm text-gray-600 mt-1">{getCart.length} item{getCart.length !== 1 ? 's' : ''} in cart</p>
      </div>

      {/* Mobile Cart Items */}
      {isMobile ? (
        <div className="flex flex-col gap-4 mb-6">
          {getCart.map((el) => (
            <div key={el.id} className="bg-white rounded-lg shadow-sm border border-gray-200 p-3">
              <div className="flex gap-3">
                <img
                  src={el.avatar}
                  alt={el.name}
                  className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800 line-clamp-2">{el.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">SKU: {el.sku || 'N/A'}</p>
                    </div>
                    <button
                      onClick={() => removeFromCart(el.id)}
                      className="text-red-500 hover:text-red-700 p-1 flex-shrink-0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-gray-100 hover:bg-[#46A358] hover:text-white text-gray-800 w-7 h-7 rounded-full flex items-center justify-center text-sm"
                        onClick={() => updateQuantity(el.id, (el.quantity || 1) - 1)}
                        disabled={el.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-10 text-center font-medium">
                        {el.quantity || 1}
                      </span>
                      <button
                        className="bg-gray-100 hover:bg-[#46A358] hover:text-white text-gray-800 w-7 h-7 rounded-full flex items-center justify-center text-sm"
                        onClick={() => updateQuantity(el.id, (el.quantity || 1) + 1)}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-right">
                      <p className="text-xs text-gray-600">Price: ${el.price?.toFixed(2)}</p>
                      <p className="font-bold text-base text-[#46A358]">
                        ${getItemTotal(el)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}

           <div className="w-full lg:w-[30%] mt-4 lg:mt-0">
            <div className="bg-gray-50 rounded-lg p-3 md:p-4">
              <h2 className="text-lg md:text-xl font-bold mb-3">Cart Summary</h2>
              <hr className='border-[#46A358] mb-3 md:mb-4' />

              {/* Coupon Section */}
              <div className="mb-4">
                <span className="text-gray-600 text-sm md:text-base">Coupon Apply:</span>
                <div className='border border-[#46A358] flex rounded-[5px] mt-2'>
                  <input 
                    type="text" 
                    placeholder='Enter coupon code...' 
                    className='w-full p-2 rounded-l-[5px] text-sm md:text-base' 
                  />
                  <button className='bg-[#46A358] text-white font-serif text-sm md:text-base py-2 px-3 md:px-4 rounded-r-[5px]'>
                    Apply
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 md:space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm md:text-base">Subtotal:</span>
                  <span className="font-medium">${getCartTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm md:text-base">Coupon Discount:</span>
                  <span className="font-medium text-gray-500">(-) 00.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm md:text-base">Shipping:</span>
                  <span className="font-medium text-[#46A358]">Free</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-[#46A358] pt-3 mt-3">
                <div className="flex justify-between text-base md:text-lg font-bold">
                  <span className='text-[#46A358]'>Total:</span>
                  <span className="text-[#46A358]">${getCartTotal()}</span>
                </div>
              </div>

              {/* Payment Method - Mobile Optimized */}
              <div className="mt-4 md:mt-6">
                <PaymentMethod 
                  selectedPayment={selectedPayment} 
                  onPaymentChange={setSelectedPayment}
                  isMobile={isMobile}
                />
              </div>

              {/* Address Modal */}
              <div className="mt-4">
                <ModalAddres 
                  selectedPayment={selectedPayment}
                  onPurchaseComplete={handlePurchaseComplete}
                  isMobile={isMobile}
                />
              </div>

              {/* Clear Cart Button */}
              <div className="mt-4 md:mt-6">
                <button
                  onClick={() => {
                    setCart([]);
                    localStorage.removeItem('Cart');
                    window.dispatchEvent(new CustomEvent('cartUpdated', {
                      detail: { cartItems: [] }
                    }));
                  }}
                  className="w-full py-2.5 md:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm md:text-base"
                >
                  Clear Cart
                </button>
              </div>

              {/* Continue Shopping Link */}
              <div className="mt-4 text-center">
                <Link 
                  to="/" 
                  className="text-[#46A358] hover:text-[#3a8a47] transition-colors text-sm md:text-base inline-flex items-center gap-1"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      ) : (
        /* Desktop Table View */
        <div className="flex flex-col lg:flex-row gap-4 md:gap-6 items-start">
          <div className="overflow-x-auto w-full lg:w-[70%]">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr className="border-b">
                  <th className="text-left p-3 md:p-4 font-semibold text-gray-700">Product</th>
                  <th className="text-left p-3 md:p-4 font-semibold text-gray-700">Price</th>
                  <th className="text-left p-3 md:p-4 font-semibold text-gray-700">Quantity</th>
                  <th className="text-left p-3 md:p-4 font-semibold text-gray-700">Total</th>
                  <th className="text-left p-3 md:p-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {getCart.map((el) => (
                  <tr key={el.id} className="hover:bg-gray-50">
                    <td className="p-2 md:p-3">
                      <div className="flex items-center gap-3 md:gap-4">
                        <img
                          src={el.avatar}
                          alt={el.name}
                          className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-semibold text-base md:text-lg">{el.name}</p>
                          <p className="text-gray-600 text-xs md:text-sm">
                            <span className="font-medium">SKU:</span> {el.sku || 'N/A'}
                          </p>
                          {el.data && (
                            <p className="text-gray-500 text-xs md:text-sm mt-1">{el.data}</p>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="p-2 md:p-3">
                      <p className="font-medium text-gray-700 text-base md:text-xl">${el.price?.toFixed(2)}</p>
                    </td>
                    <td className="p-2 md:p-3">
                      <div className="flex items-center gap-2">
                        <button
                          className="bg-gray-200 hover:bg-[#46A358] hover:text-white text-gray-800 font-bold w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm"
                          onClick={() => updateQuantity(el.id, (el.quantity || 1) - 1)}
                          disabled={el.quantity <= 1}
                        >
                          -
                        </button>
                        <span className="w-10 md:w-12 text-center font-medium text-base md:text-lg">
                          {el.quantity || 1}
                        </span>
                        <button
                          className="bg-gray-200 hover:bg-[#46A358] hover:text-white text-gray-800 font-bold w-7 h-7 md:w-8 md:h-8 rounded-full flex items-center justify-center text-sm"
                          onClick={() => updateQuantity(el.id, (el.quantity || 1) + 1)}
                        >
                          +
                        </button>
                      </div>
                    </td>
                    <td className="p-2 md:p-3">
                      <p className="font-bold text-base md:text-xl text-[#46A358]">
                        ${getItemTotal(el)}
                      </p>
                    </td>
                    <td className="p-2 md:p-3">
                      <button
                        onClick={() => removeFromCart(el.id)}
                        className="text-red-500 hover:text-red-700 p-1 md:p-2"
                        title="Remove from cart"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 md:w-6 md:h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cart Summary Sidebar */}
          <div className="w-full lg:w-[30%] mt-4 lg:mt-0">
            <div className="bg-gray-50 rounded-lg p-3 md:p-4">
              <h2 className="text-lg md:text-xl font-bold mb-3">Cart Summary</h2>
              <hr className='border-[#46A358] mb-3 md:mb-4' />

              {/* Coupon Section */}
              <div className="mb-4">
                <span className="text-gray-600 text-sm md:text-base">Coupon Apply:</span>
                <div className='border border-[#46A358] flex rounded-[5px] mt-2'>
                  <input 
                    type="text" 
                    placeholder='Enter coupon code...' 
                    className='w-full p-2 rounded-l-[5px] text-sm md:text-base' 
                  />
                  <button className='bg-[#46A358] text-white font-serif text-sm md:text-base py-2 px-3 md:px-4 rounded-r-[5px]'>
                    Apply
                  </button>
                </div>
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 md:space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm md:text-base">Subtotal:</span>
                  <span className="font-medium">${getCartTotal()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm md:text-base">Coupon Discount:</span>
                  <span className="font-medium text-gray-500">(-) 00.00</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 text-sm md:text-base">Shipping:</span>
                  <span className="font-medium text-[#46A358]">Free</span>
                </div>
              </div>

              {/* Total */}
              <div className="border-t border-[#46A358] pt-3 mt-3">
                <div className="flex justify-between text-base md:text-lg font-bold">
                  <span className='text-[#46A358]'>Total:</span>
                  <span className="text-[#46A358]">${getCartTotal()}</span>
                </div>
              </div>

              {/* Payment Method - Mobile Optimized */}
              <div className="mt-4 md:mt-6">
                <PaymentMethod 
                  selectedPayment={selectedPayment} 
                  onPaymentChange={setSelectedPayment}
                  isMobile={isMobile}
                />
              </div>

              {/* Address Modal */}
              <div className="mt-4">
                <ModalAddres 
                  selectedPayment={selectedPayment}
                  onPurchaseComplete={handlePurchaseComplete}
                  isMobile={isMobile}
                />
              </div>

              {/* Clear Cart Button */}
              <div className="mt-4 md:mt-6">
                <button
                  onClick={() => {
                    setCart([]);
                    localStorage.removeItem('Cart');
                    window.dispatchEvent(new CustomEvent('cartUpdated', {
                      detail: { cartItems: [] }
                    }));
                  }}
                  className="w-full py-2.5 md:py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors text-sm md:text-base"
                >
                  Clear Cart
                </button>
              </div>

              {/* Continue Shopping Link */}
              <div className="mt-4 text-center">
                <Link 
                  to="/" 
                  className="text-[#46A358] hover:text-[#3a8a47] transition-colors text-sm md:text-base inline-flex items-center gap-1"
                >
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Carousel Section */}
      <div className="mt-6 md:mt-8">
        <CarousetProducks />
      </div>
    </div>
  )
}

export default ToCard