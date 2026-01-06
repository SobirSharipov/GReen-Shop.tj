import React, { useEffect, useState } from 'react'
import CarousetProducks from '../../components/carousetProducks';
import { Link } from 'react-router';
import ModalAddres from '../../components/modalAddres';
import logo1 from '../../assets/Logo1.svg'
import PaymentMethod from '../../components/PaymentMethod';

const ToCard = () => {
  let [getCart, setCart] = useState([])
  const [selectedImageId, setSelectedImageId] = useState(null);

  useEffect(() => {
    let stored = localStorage.getItem('Cart')
    if (stored) {
      setCart(JSON.parse(stored))
    }
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

  // Функция расчета общей суммы для товара
  const getItemTotal = (item) => {
    return (item.price * (item.quantity || 1)).toFixed(2);
  };

  // Функция расчета общей суммы всей корзины
  const getCartTotal = () => {
    return getCart.reduce((total, item) => {
      return total + (item.price * (item.quantity || 1));
    }, 0).toFixed(2);
  };

  if (getCart.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-4">🛒</div>
        <p className="text-lg text-gray-600 mb-4">Your shopping cart is empty</p>
        <p className="text-gray-500">Add some products to your cart!</p>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="mb-6">
        <p>
          <span className="font-bold text-[#46A358]">Home</span> /
          <span className="text-gray-600"> Shop</span> /
          <span className="font-medium"> Shopping Cart</span>
        </p>
      </div>

      <div className='flex gap-4 items-start'>

        <div className="overflow-x-auto w-[70%]">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr className="border-b">
                <th className="text-left p-4 font-semibold text-gray-700">Product</th>
                <th className="text-left p-4 font-semibold text-gray-700">Price</th>
                <th className="text-left p-4 font-semibold text-gray-700">Quantity</th>
                <th className="text-left p-4 font-semibold text-gray-700">Total</th>
                <th className="text-left p-4 font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {getCart.map((el) => (
                <tr key={el.id} className=" hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-4">
                      <img
                        src={el.avatar}
                        alt={el.name}
                        className="w-20 h-20 object-cover rounded-lg"
                      />
                      <div>
                        <p className="font-semibold text-lg">{el.name}</p>
                        <p className="text-gray-600 text-sm">
                          <span className="font-medium">SKU:</span> {el.sku || 'N/A'}
                        </p>
                        {el.data && (
                          <p className="text-gray-500 text-sm mt-1">{el.data}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="font-medium text-gray-700 text-xl">${el.price?.toFixed(2)}</p>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <button
                        className="bg-gray-200 hover:bg-[#46A358] hover:text-white text-gray-800 font-bold w-8 h-8 rounded-full flex items-center justify-center"
                        onClick={() => updateQuantity(el.id, (el.quantity || 1) - 1)} disabled={el.quantity <= 1}
                      >
                        -
                      </button>
                      <span className="w-12 text-center font-medium text-lg">
                        {el.quantity || 1}
                      </span>
                      <button
                        className="bg-gray-200 hover:bg-[#46A358] hover:text-white text-gray-800 font-bold w-8 h-8 rounded-full flex items-center justify-center"
                        onClick={() => updateQuantity(el.id, (el.quantity || 1) + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className="p-3">
                    <p className="font-bold text-xl text-[#46A358]">
                      ${getItemTotal(el)}
                    </p>
                  </td>
                  <td className="p-3">
                    <button
                      onClick={() => removeFromCart(el.id)}
                      className="text-red-500 hover:text-red-700 p-2"
                      title="Remove from cart"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                      </svg>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className=" p-4 bg-gray-50 rounded-lg w-[30%] ">
          <h2 className="text-xl font-bold mb-3">Cart Total</h2>
          <hr className='text-[#46A358] font-bold mb-4' />

          <div>
            <span className="text-gray-600">Coupon Apply:</span>
            <div className='border border-[#46A358] flex rounded-[5px] my-4 '>
              <input type="text" placeholder='Enter coupon code here...' className='w-full p-2 rounded-l-xl' />
              <button className='w-[30%] bg-[#46A358] text-white font-serif text-xl rounded-r-[5px] p-2'>Apply</button>
            </div>

          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Subtotal:</span>
              <span className="font-medium">${getCartTotal()}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Coupon Discount:</span>
              <span className="font-medium">(-) 00.00</span>
            </div>

            <div className="flex justify-between">
              <span className="text-gray-600">Shipping:</span>
              <span className="font-medium text-[#46A358]">Free</span>
            </div>

            <div className="border-t border-[#46A358] pt-3 mt-3">
              <div className="flex justify-between text-lg font-bold">
                <span className='text-[#46A358]'>Total:</span>
                <span className="text-[#46A358]">${getCartTotal()}</span>
              </div>
            </div>
          </div>

                 <PaymentMethod />
          <ModalAddres />

          <div className="mt-6">
            <button
              onClick={() => {
                setCart([]);
                localStorage.removeItem('Cart');
                window.dispatchEvent(new CustomEvent('cartUpdated', {
                  detail: { cartItems: [] }
                }));
              }}
              className="px-6 py-3 w-full bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </div>
      <CarousetProducks />

    </div>
  )
}

export default ToCard