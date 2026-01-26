import React, { useState } from 'react';
import { Drawer as AntDrawer } from 'antd';
import { Link, useLocation, useNavigate } from 'react-router';
import logo from '../assets/Logo.svg';

const MobileDrawer = ({ isAuthenticated, userPhoto, getHeart, getCart, onUserClick }) => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const brandName = (typeof document !== 'undefined' && document.title) ? document.title : 'GreenShop';

  const showDrawer = () => {
    setOpen(true);
  };

  const onClose = () => {
    setOpen(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLinkClick = (path) => {
    navigate(path);
    onClose();
  };

  const handleUserIconClick = () => {
    onUserClick();
    onClose();
  };

  const isAdminAuth = typeof window !== 'undefined' && localStorage.getItem('adminAuth') === 'true';

  const menuItems = [
    { path: '/', label: 'Home', icon: '🏠' },
    { path: '/Shop', label: 'Shop', icon: '🛍️' },
    { path: '/Plant Care', label: 'Plant Care', icon: '🌱' },
    { path: '/Blogs', label: 'Blogs', icon: '📝' },
  ];

  return (
    <>
      <button 
        onClick={showDrawer}
        className="md:hidden p-2 text-gray-700 hover:text-[#46A358] transition-colors"
        aria-label="Open menu"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
        </svg>
      </button>
      <AntDrawer
        title={
          <div className="flex items-center gap-3">
            <img src={logo} alt={brandName} className="h-8" />
          </div>
        }
        placement="left"
        onClose={onClose}
        open={open}
        width={320}
        className="mobile-drawer"
        styles={{
          body: {
            padding: 0,
          },
          header: {
            borderBottom: '1px solid #e5e7eb',
            padding: '16px 24px',
          }
        }}
      >
        <div className="flex flex-col h-full">
          {/* Navigation Links */}
          <div className="flex-1 overflow-y-auto">
            <nav className="py-4">
              {menuItems.map((item) => (
                <button
                  key={item.path}
                  onClick={() => handleLinkClick(item.path)}
                  className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors ${
                    isActive(item.path)
                      ? 'bg-[#46A358]/10 text-[#46A358] border-l-4 border-[#46A358]'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#46A358]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <span className="font-medium">{item.label}</span>
                  </div>
                  {item.badge && item.badge > 0 && (
                    <span className="bg-[#46A358] text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-semibold">
                      {item.badge}
                    </span>
                  )}
                </button>
              ))}

              {/* Dashboard (only for admin auth) */}
              {isAdminAuth && (
                <button
                  onClick={() => handleLinkClick('/Dashboard')}
                  className={`w-full flex items-center justify-between px-6 py-4 text-left transition-colors ${
                    isActive('/Dashboard')
                      ? 'bg-[#46A358]/10 text-[#46A358] border-l-4 border-[#46A358]'
                      : 'text-gray-700 hover:bg-gray-50 hover:text-[#46A358]'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-xl">📊</span>
                    <span className="font-medium">Dashboard</span>
                  </div>
                </button>
              )}
            </nav>

            {/* Divider */}
            <div className="border-t border-gray-200 my-2"></div>

            {/* Profile Section */}
            <div className="px-6 py-4">
              <button
                onClick={handleUserIconClick}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive('/Profile')
                    ? 'bg-[#46A358]/10 text-[#46A358]'
                    : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                }`}
              >
                {isAuthenticated ? (
                  <>
                    {userPhoto ? (
                      <img
                        src={userPhoto}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-[#46A358]"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-[#46A358]/10 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="#46A358" className="w-6 h-6">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                        </svg>
                      </div>
                    )}
                    <span className="font-semibold">My Profile</span>
                  </>
                ) : (
                  <>
                    <div className="w-10 h-10 rounded-full bg-[#46A358] flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="white" className="w-5 h-5">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
                      </svg>
                    </div>
                    <span className="font-semibold">Login / Register</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 p-6">
            <p className="text-xs text-gray-500 text-center">
              © {currentYear} {brandName}. All rights reserved.
            </p>
          </div>
        </div>
      </AntDrawer>
    </>
  );
};

export default MobileDrawer;
