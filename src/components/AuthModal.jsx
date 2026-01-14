import React, { useState } from 'react';
import { Modal, Input, message } from 'antd';
import { EyeInvisibleOutlined, EyeTwoTone } from '@ant-design/icons';

const AuthModal = ({ isOpen, onClose, onRegisterSuccess }) => {
  const [activeTab, setActiveTab] = useState('register'); // 'login' or 'register'
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleRegister = () => {
    // Validation
    if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
      message.error('Please fill in all fields');
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      message.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      message.error('Password must be at least 6 characters');
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      message.error('Please enter a valid email address');
      return;
    }

    // Save user data to localStorage
    const userData = {
      username: formData.username,
      email: formData.email,
      registeredAt: new Date().toISOString()
    };

    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('isAuthenticated', 'true');

    message.success('Registration successful!');
    onRegisterSuccess();
    onClose();
    
    // Reset form
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleLogin = () => {
    // Validation
    if (!formData.email || !formData.password) {
      message.error('Please fill in all fields');
      return;
    }

    // Check if user exists
    const userData = localStorage.getItem('user');
    if (!userData) {
      message.error('No account found. Please register first.');
      return;
    }

    const user = JSON.parse(userData);
    if (user.email !== formData.email) {
      message.error('Invalid email or password');
      return;
    }

    localStorage.setItem('isAuthenticated', 'true');
    message.success('Login successful!');
    onRegisterSuccess();
    onClose();
    
    // Reset form
    setFormData({
      username: '',
      email: '',
      password: '',
      confirmPassword: ''
    });
  };

  const handleSocialLogin = (provider) => {
    message.info(`Continue with ${provider} - Feature coming soon!`);
  };

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={500}
      className="auth-modal"
      closeIcon={
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="#46A358" className="w-6 h-6">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      }
    >
      <div className="p-3">
        {/* Tabs */}
        <div className="flex justify-center items-center mb-6 border-b border-gray-200">
          <button
            onClick={() => setActiveTab('login')}
            className={`flex-1 py-3 text-center font-semibold text-lg transition-colors ${
              activeTab === 'login' ? 'text-gray-800 border-b-2 border-[#46A358]' : 'text-gray-500'
            }`}
          >
            Login
          </button>
          <div className="w-px h-6 bg-gray-300"></div>
          <button
            onClick={() => setActiveTab('register')}
            className={`flex-1 py-3 text-center font-semibold text-lg transition-colors ${
              activeTab === 'register' ? 'text-[#46A358] border-b-2 border-[#46A358]' : 'text-gray-500'
            }`}
          >
            Register
          </button>
        </div>

        {/* Instruction Text */}
        <p className="text-center text-gray-600 mb-6 text-sm">
          {activeTab === 'register' 
            ? 'Enter your email and password to register.'
            : 'Enter your email and password to login.'}
        </p>

        {/* Form Fields */}
        <div className="space-y-4 mb-6">
          {activeTab === 'register' && (
            <div>
              <Input
                placeholder="Username"
                size="large"
                value={formData.username}
                onChange={(e) => handleInputChange('username', e.target.value)}
                className="h-12 border-2 border-gray-200 rounded-lg focus:border-[#46A358]"
              />
            </div>
          )}
          
          <div>
            <Input
              placeholder="Enter your email address"
              size="large"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              className="h-12 border-2 border-gray-200 rounded-lg focus:border-[#46A358]"
            />
          </div>

          <div className="relative">
            <Input.Password
              placeholder="Password"
              size="large"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
              className="h-12 border-2 border-gray-200 rounded-lg focus:border-[#46A358]"
            />
          </div>

          {activeTab === 'register' && (
            <div className="relative">
              <Input.Password
                placeholder="Confirm Password"
                size="large"
                value={formData.confirmPassword}
                onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                iconRender={(visible) => (visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />)}
                className="h-12 border-2 border-gray-200 rounded-lg focus:border-[#46A358]"
              />
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          onClick={activeTab === 'register' ? handleRegister : handleLogin}
          className="w-full bg-[#46A358] hover:bg-[#3a8a47] text-white py-3 px-6 rounded-lg font-semibold transition-colors mb-6"
        >
          {activeTab === 'register' ? 'Register' : 'Login'}
        </button>

        {/* Separator */}
        <div className="text-center mb-6">
          <p className="text-gray-500 text-sm">Or {activeTab === 'register' ? 'register' : 'login'} with</p>
        </div>

        {/* Social Login Buttons */}
        <div className="space-y-3">
          <button
            onClick={() => handleSocialLogin('Google')}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button
            onClick={() => handleSocialLogin('Facebook')}
            className="w-full flex items-center justify-center gap-3 bg-white border-2 border-gray-200 hover:border-gray-300 text-gray-800 py-3 px-6 rounded-lg font-medium transition-colors"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="#1877F2">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Continue with Facebook
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;


