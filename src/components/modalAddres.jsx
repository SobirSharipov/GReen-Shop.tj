import { Input, Modal, message } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState, useEffect } from 'react'

const ModalAddres = ({ selectedPayment, onPurchaseComplete }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        city: '',
        street: '',
        notes: ''
    });

    const showModal = () => {
        // Check if user is authenticated
        const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
        const userData = localStorage.getItem('user');
        
        if (!isAuthenticated || !userData) {
            message.warning('Please register or login to complete your purchase. Profile photo updated!');
            // Dispatch event to open auth modal (handled by Layout)
            window.dispatchEvent(new CustomEvent('openAuthModal'));
            return;
        }

        // Check if payment method is selected (must be one of: paypal, mastercard, visa)
        const validPaymentMethods = ['paypal', 'mastercard', 'visa'];
        if (!selectedPayment || !validPaymentMethods.includes(selectedPayment)) {
            message.warning('Please select a payment method (PayPal, MasterCard, or VISA) before proceeding to checkout.');
            return;
        }
        setIsModalOpen(true);
    };

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
    };

    const validateForm = () => {
        const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'city', 'street'];
        const missingFields = requiredFields.filter(field => !formData[field] || formData[field].trim() === '');
        
        if (missingFields.length > 0) {
            message.error('Please fill in all required fields (*)');
            return false;
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            message.error('Please enter a valid email address');
            return false;
        }

        return true;
    };

    const handleOk = () => {
        if (!validateForm()) {
            return;
        }

        // Close modal with animation
        setIsModalOpen(false);

        // Wait for modal close animation, then trigger purchase completion
        setTimeout(() => {
            // Trigger purchase completion callback
            if (onPurchaseComplete) {
                onPurchaseComplete({
                    ...formData,
                    paymentMethod: selectedPayment
                });
            }

            // Reset form
            setFormData({
                firstName: '',
                lastName: '',
                email: '',
                phone: '',
                city: '',
                street: '',
                notes: ''
            });
        }, 300); // Wait for modal close animation (~300ms)
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <div>
            <button 
              onClick={showModal} 
              className={`w-full mt-6 py-3 rounded-lg font-semibold transition-colors ${
                selectedPayment && ['paypal', 'mastercard', 'visa'].includes(selectedPayment)
                  ? 'bg-[#46A358] text-white hover:bg-[#3a8a47]'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed'
              }`}
              disabled={!selectedPayment || !['paypal', 'mastercard', 'visa'].includes(selectedPayment)}
            >
              Proceed to Checkout
            </button>
            <Modal
                title={
                    <h2 className="text-2xl font-bold text-gray-800 mb-2">Billing Address</h2>
                }
                closable={true}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
                okText="OK"
                cancelText="Cancel"
                okButtonProps={{
                    className: 'bg-[#46A358] hover:bg-[#3a8a47] text-white font-semibold px-6 py-2 rounded-lg'
                }}
                cancelButtonProps={{
                    className: 'border-gray-300 text-gray-700 hover:border-gray-400 font-semibold px-6 py-2 rounded-lg'
                }}
                width={700}
                className="billing-address-modal"
            >
                <div className='py-4'>
                    <div className='grid grid-cols-2 gap-6 mb-6'>
                        <div className='space-y-2'>
                            <label className='block text-sm font-semibold text-gray-700'>
                                First Name <span className='text-red-500'>*</span>
                            </label>
                            <Input 
                                placeholder="Enter your first name" 
                                value={formData.firstName}
                                onChange={(e) => handleInputChange('firstName', e.target.value)}
                                className='h-11 border-2 border-gray-200 rounded-lg px-4 focus:border-[#46A358] focus:shadow-sm transition-all'
                                size="large"
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='block text-sm font-semibold text-gray-700'>
                                Last Name <span className='text-red-500'>*</span>
                            </label>
                            <Input 
                                type="text" 
                                placeholder='Enter your last name' 
                                value={formData.lastName}
                                onChange={(e) => handleInputChange('lastName', e.target.value)}
                                className='h-11 border-2 border-gray-200 rounded-lg px-4 focus:border-[#46A358] focus:shadow-sm transition-all'
                                size="large"
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='block text-sm font-semibold text-gray-700'>
                                Email Address <span className='text-red-500'>*</span>
                            </label>
                            <Input 
                                type="email" 
                                placeholder='example@email.com' 
                                value={formData.email}
                                onChange={(e) => handleInputChange('email', e.target.value)}
                                className='h-11 border-2 border-gray-200 rounded-lg px-4 focus:border-[#46A358] focus:shadow-sm transition-all'
                                size="large"
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='block text-sm font-semibold text-gray-700'>
                                Phone Number <span className='text-red-500'>*</span>
                            </label>
                            <Input 
                                type="tel" 
                                placeholder='+992 123 456 789' 
                                value={formData.phone}
                                onChange={(e) => handleInputChange('phone', e.target.value)}
                                className='h-11 border-2 border-gray-200 rounded-lg px-4 focus:border-[#46A358] focus:shadow-sm transition-all'
                                size="large"
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='block text-sm font-semibold text-gray-700'>
                                Town / City <span className='text-red-500'>*</span>
                            </label>
                            <Input 
                                type="text" 
                                placeholder='Enter your city' 
                                value={formData.city}
                                onChange={(e) => handleInputChange('city', e.target.value)}
                                className='h-11 border-2 border-gray-200 rounded-lg px-4 focus:border-[#46A358] focus:shadow-sm transition-all'
                                size="large"
                            />
                        </div>
                        <div className='space-y-2'>
                            <label className='block text-sm font-semibold text-gray-700'>
                                Street Address <span className='text-red-500'>*</span>
                            </label>
                            <Input 
                                type="text" 
                                placeholder='Enter your street address' 
                                value={formData.street}
                                onChange={(e) => handleInputChange('street', e.target.value)}
                                className='h-11 border-2 border-gray-200 rounded-lg px-4 focus:border-[#46A358] focus:shadow-sm transition-all'
                                size="large"
                            />
                        </div>
                    </div>
                    <div className='space-y-2'>
                        <label className='block text-sm font-semibold text-gray-700'>
                            Order Notes <span className='text-gray-500 text-xs font-normal'>(optional)</span>
                        </label>
                        <TextArea 
                            rows={4} 
                            placeholder="Add any special instructions or notes for your order..." 
                            value={formData.notes}
                            onChange={(e) => handleInputChange('notes', e.target.value)}
                            maxLength={200}
                            className='border-2 border-gray-200 rounded-lg px-4 py-3 focus:border-[#46A358] focus:shadow-sm transition-all resize-none'
                            showCount
                        />
                    </div>
                </div>
            </Modal>
        </div>
    )
}

export default ModalAddres