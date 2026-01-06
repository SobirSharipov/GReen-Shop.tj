import React, { useEffect, useState } from 'react'

const Heart = () => {
  let [getHeart, setHeart] = useState([])
  const [selectedImageId, setSelectedImageId] = useState(null);

  useEffect(() => {
    let stored = localStorage.getItem('Heart')
    if (stored) {
      setHeart(JSON.parse(stored))
    }
  }, [])

  const removeFromHeart = (id) => {
    const updatedHeart = getHeart.filter(item => item.id !== id);
    setHeart(updatedHeart);
    localStorage.setItem('Heart', JSON.stringify(updatedHeart));

    window.dispatchEvent(new CustomEvent('heartUpdated', {
      detail: { heartItems: updatedHeart }
    }));
  };

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


  if (getHeart.length === 0) {
    return (
      <div className="p-8 text-center">
        <div className="text-4xl mb-4">❤️</div>
        <p className="text-lg text-gray-600 mb-4">Your favorites list is empty</p>
        <p className="text-gray-500">Add some products to your favorites!</p>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-[#46A358]">My Favorites</h1>
        <p className="text-gray-600">{getHeart.length} items</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {getHeart?.map((el) => (
          <div
            key={el.id}
            className={`relative group border rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${selectedImageId === el.id
              ? 'border-[#46A358] bg-green-50 shadow-md'
              : 'border-gray-200 hover:border-gray-300'
              }`}
            onClick={() => setSelectedImageId(el.id)}
          >
            <div className="relative overflow-hidden rounded-lg mb-3">
              <img
                src={el.avatar}
                alt={el.name}
                className="w-full h-40 object-cover group-hover:brightness-75 transition-all duration-300"
              />

              <div className="absolute inset-0 flex items-center justify-center gap-3  opacity-0 group-hover:opacity-100  transition-opacity duration-300 bg-black/20">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFromHeart(el.id);
                  }}
                  className="bg-white p-3 rounded-full cursor-pointer shadow-lg hover:bg-red-50 hover:text-red-500 transition-colors"
                  title="Remove from favorites"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                  </svg>
                </button>

                <button
                  className="bg-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  title="Add to cart"
                  onClick={()=>ShopFunction(el)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill={isInCart(el.id) ? "#46A358" : "none"} viewBox="0 0 24 24" strokeWidth={1.5} stroke={isInCart(el.id) ? "#46A358" :"currentColor"} className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                </button>

                <button
                  className="bg-white p-3 rounded-full shadow-lg cursor-pointer hover:bg-gray-100 transition-colors"
                  title="View details"
                  onClick={(e) => e.stopPropagation()}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                  </svg>
                </button>
              </div>
            </div>

            <p className="text-[#46A358] font-medium text-lg">{el.data}</p>
            <h3 className="font-semibold text-lg truncate">{el.name}</h3>
            <p className="text-[#46A358] font-bold text-xl mt-2">${el.prase}</p>

            {/* Индикатор что товар в избранном */}
            <div className="absolute top-3 right-3">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#46A358" className="size-6">
                <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default Heart