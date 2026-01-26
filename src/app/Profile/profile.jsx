import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Spin, message, Modal, Input } from 'antd';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [purchaseHistory, setPurchaseHistory] = useState([]);
  const [isItemsModalOpen, setIsItemsModalOpen] = useState(false);
  const [selectedReceipt, setSelectedReceipt] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isPhotoViewerOpen, setIsPhotoViewerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [editFormData, setEditFormData] = useState({
    username: '',
    email: ''
  });

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      if (parsedUser.photo) {
        setProfilePhoto(parsedUser.photo);
      }
      
      // Filter purchase history to show only current user's receipts
      const userId = parsedUser.email || parsedUser.username;
      const allHistory = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
      const userHistory = allHistory.filter(receipt => receipt.userId === userId);
      setPurchaseHistory(userHistory);
    } else {
      setPurchaseHistory([]);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        message.error('Photo size should be less than 5MB');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result;
        setProfilePhoto(base64String);
        
        const userData = localStorage.getItem('user');
        if (userData) {
          const parsedUser = JSON.parse(userData);
          parsedUser.photo = base64String;
          localStorage.setItem('user', JSON.stringify(parsedUser));
          setUser(parsedUser);
          window.dispatchEvent(new CustomEvent('userPhotoUpdated', { detail: { photo: base64String } }));
        }
        message.success('Profile photo updated!');
      };
      reader.readAsDataURL(file);
    }
  };

  const openPhotoViewer = () => {
    if (!isMobile) return;
    setIsPhotoViewerOpen(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem('adminAuth');
    localStorage.removeItem('adminEmail');
    window.location.href = '/';
  };

  const handleDeleteReceipt = (index) => {
    if (!user) return;
    
    const userId = user.email || user.username;
    const receiptToDelete = purchaseHistory[index];
    
    // Get all purchase history from localStorage
    const allHistory = JSON.parse(localStorage.getItem('purchaseHistory') || '[]');
    
    // Find and remove the receipt by orderNumber and userId
    const updatedAllHistory = allHistory.filter(receipt => 
      !(receipt.orderNumber === receiptToDelete.orderNumber && receipt.userId === userId)
    );
    
    // Save updated history
    localStorage.setItem('purchaseHistory', JSON.stringify(updatedAllHistory));
    
    // Update local state with filtered history
    const userHistory = updatedAllHistory.filter(receipt => receipt.userId === userId);
    setPurchaseHistory(userHistory);
    message.success('Receipt deleted successfully');
  };

  const handleShowItems = (receipt) => {
    setSelectedReceipt(receipt);
    setIsItemsModalOpen(true);
  };

  const handleEditProfile = () => {
    setEditFormData({
      username: user.username,
      email: user.email
    });
    setIsEditModalOpen(true);
  };

  const handleSaveProfile = () => {
    if (!editFormData.username || !editFormData.email) {
      message.error('Please fill in all fields');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(editFormData.email)) {
      message.error('Please enter a valid email address');
      return;
    }

    const updatedUser = {
      ...user,
      username: editFormData.username,
      email: editFormData.email
    };

    localStorage.setItem('user', JSON.stringify(updatedUser));
    setUser(updatedUser);
    setIsEditModalOpen(false);
    message.success('Profile updated successfully!');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <Spin size="large" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center p-8">
        <div className="text-red-500 text-xl mb-4">No user data found</div>
        <Link to="/">
          <button className="bg-[#46A358] text-white px-6 py-2 rounded-lg hover:bg-[#3a8a47] transition-colors">
            Go to Home
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Profile Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
            {/* Profile Photo */}
            <div className="relative">
              {profilePhoto ? (
                <button
                  type="button"
                  onClick={openPhotoViewer}
                  className="block rounded-full"
                  title="View profile photo"
                >
                  <img
                    src={profilePhoto}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-[#46A358]"
                  />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={openPhotoViewer}
                  className="w-32 h-32 rounded-full bg-gray-200 border-4 border-[#46A358] flex items-center justify-center"
                  title="View profile photo"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                </button>
              )}
              <label className="absolute bottom-0 right-0 bg-[#46A358] hover:bg-[#3a8a47] text-white p-2 rounded-full cursor-pointer transition-colors shadow-lg">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoUpload}
                  className="hidden"
                />
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
              </label>
            </div>

            {/* User Info */}
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{user.username}</h1>
              <p className="text-gray-600 mb-4">{user.email}</p>
              {user.registeredAt && (
                <p className="text-sm text-gray-500">
                  Member since {new Date(user.registeredAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3">
              <button
                onClick={handleEditProfile}
                className="px-6 py-2 bg-[#46A358] hover:bg-[#3a8a47] text-white rounded-lg transition-colors font-medium flex items-center gap-2"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                </svg>
                Profile
              </button>
              <button
                onClick={handleLogout}
                className="px-6 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg transition-colors font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>

       
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-900">
                  Purchase History
                </h2>
                <span className="bg-[#46A358]/10 text-[#46A358] px-3 py-1 rounded-full text-sm font-medium">
                  {purchaseHistory.length} {purchaseHistory.length === 1 ? 'order' : 'orders'}
                </span>
              </div>

              {purchaseHistory.length > 0 ? (
                <div className="space-y-4">
                  {purchaseHistory.map((receipt, index) => (
                    <div 
                      key={index} 
                      className="border border-gray-200 rounded-lg p-4 hover:border-[#46A358] transition-colors relative"
                    >
                      <button
                        onClick={() => handleDeleteReceipt(index)}
                        className="absolute top-4 right-4 text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded-lg transition-colors"
                        title="Delete receipt"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                        </svg>
                      </button>
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pr-10">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <div className="w-10 h-10 bg-[#46A358]/10 rounded-lg flex items-center justify-center">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#46A358" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                              </svg>
                            </div>
                            <div>
                              <p className="font-semibold text-gray-900">Order #{receipt.orderNumber}</p>
                              <p className="text-sm text-gray-500">
                                {new Date(receipt.date).toLocaleDateString('en-US', {
                                  day: 'numeric',
                                  month: 'short',
                                  year: 'numeric'
                                })}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center flex-wrap gap-2 text-sm text-gray-600">
                            <button
                              onClick={() => handleShowItems(receipt)}
                              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-gray-200 bg-white hover:border-[#46A358] hover:bg-[#46A358]/5 hover:text-[#46A358] transition-colors cursor-pointer"
                            >
                              <span className="font-medium">Items</span>
                              <span className="bg-[#46A358]/10 text-[#46A358] text-xs font-semibold px-2 py-0.5 rounded-full">
                                {receipt.items?.length || 0}
                              </span>
                            </button>
                            <span>
                              <span className="font-medium">Payment:</span>{' '}
                              {receipt.paymentMethod === 'paypal' ? 'PayPal' : 
                               receipt.paymentMethod === 'mastercard' ? 'MasterCard' : 
                               receipt.paymentMethod === 'visa' ? 'VISA' : 
                               'Cash on delivery'}
                            </span>
                          </div>
                        </div>
                        <div className="text-left md:text-right flex justify-between items-center">
                          <p className="text-2xl font-bold text-[#46A358] mb-1">${receipt.total}</p>
                          <span className="inline-block bg-green-50 text-green-700 text-xs font-medium px-2 py-1 rounded">
                            Completed
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 text-gray-300 mx-auto mb-4">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                  </svg>
                  <p className="text-gray-500 text-lg mb-2">No orders yet</p>
                  <p className="text-gray-400 text-sm mb-4">Start shopping to see your purchase history</p>
                  <Link to="/ToCard">
                    <button className="bg-[#46A358] hover:bg-[#3a8a47] text-white px-6 py-2 rounded-lg transition-colors font-medium">
                      Start Shopping
                    </button>
                  </Link>
                </div>
              )}
            </div>
          </div>
      </div>

      {/* Items Modal */}
      <Modal
        open={isItemsModalOpen}
        onCancel={() => setIsItemsModalOpen(false)}
        footer={null}
        width={700}
        title={
          <div className="flex items-center gap-3">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#46A358" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 0 0-16.536-1.84M7.5 14.25 5.106 5.272M6 20.25a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Zm12.75 0a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
            </svg>
            <span className="text-xl font-semibold">Order Items - #{selectedReceipt?.orderNumber}</span>
          </div>
        }
      >
        {selectedReceipt && (
          <div className="mt-4">
            <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
              {selectedReceipt.items?.map((item, index) => (
                <div key={index} className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg hover:border-[#46A358] transition-colors">
                  <img
                    src={item.avatar}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <p className="font-semibold text-gray-900 mb-1">{item.name}</p>
                    {item.sku && (
                      <p className="text-xs text-gray-500 mb-2">SKU: {item.sku}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-gray-600">
                      <span>Quantity: <span className="font-medium text-gray-900">{item.quantity || 1}</span></span>
                      <span>Price: <span className="font-medium text-gray-900">${(item.price || 0).toFixed(2)}</span></span>
                    </div>
                  </div>
                  <div className="hidden md:block text-right">
                    <p className="text-lg font-bold text-[#46A358]">
                      ${((item.price || 0) * (item.quantity || 1)).toFixed(2)}
                    </p>
                    <p className="text-xs text-gray-500">Subtotal</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Subtotal:</span>
                <span className="font-semibold text-gray-900">${selectedReceipt.subtotal || '0.00'}</span>
              </div>
              <div className="flex justify-between items-center mb-2">
                <span className="text-gray-600">Shipping:</span>
                <span className="font-semibold text-gray-900">${selectedReceipt.shipping || '16.00'}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-lg font-semibold text-gray-900">Total:</span>
                <span className="text-2xl font-bold text-[#46A358]">${selectedReceipt.total}</span>
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Fullscreen Profile Photo (mobile only) */}
      {isMobile && (
      <Modal
        open={isPhotoViewerOpen}
        onCancel={() => setIsPhotoViewerOpen(false)}
        footer={null}
        closable={false}
        wrapClassName="profile-photo-fullscreen"
      >
        <div className="relative w-full h-180 bg-black rounded-2xl">
          {/* Close */}
          <button
            type="button"
            onClick={() => setIsPhotoViewerOpen(false)}
            className="absolute top-4 right-4 z-20 bg-white/10 hover:bg-white/20 text-white rounded-full p-2 transition-colors"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Edit photo */}
          <label className="absolute top-4 left-4 z-20 bg-[#46A358] hover:bg-[#3a8a47] text-white px-4 py-2 rounded-xl cursor-pointer transition-colors font-semibold flex items-center gap-2 shadow-lg">
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="hidden"
            />
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
            </svg>
            
          </label>

          <div className="w-full h-full flex items-center justify-center">
            {profilePhoto ? (
              <img
                src={profilePhoto}
                alt="Profile"
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="text-white/80 text-center px-6">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-20 h-20 text-white/50 mx-auto mb-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                </svg>
                <p className="text-lg font-semibold">No profile photo</p>
                <p className="text-sm text-white/60 mt-1">Tap “Edit profile photo” to upload one.</p>
              </div>
            )}
          </div>
        </div>
      </Modal>
      )}

      {/* Edit Profile Modal */}
      <Modal
        open={isEditModalOpen}
        onCancel={() => setIsEditModalOpen(false)}
        onOk={handleSaveProfile}
        title="Edit Profile"
        okText="Save Changes"
        cancelText="Cancel"
        okButtonProps={{ className: 'bg-[#46A358] hover:bg-[#3a8a47]' }}
        width={500}
      >
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Username</label>
            <Input
              value={editFormData.username}
              onChange={(e) => setEditFormData({ ...editFormData, username: e.target.value })}
              placeholder="Enter username"
              size="large"
              className="h-12"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
            <Input
              type="email"
              value={editFormData.email}
              onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
              placeholder="Enter email address"
              size="large"
              className="h-12"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Profile;
