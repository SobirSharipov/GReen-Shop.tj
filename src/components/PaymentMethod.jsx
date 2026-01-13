import React from 'react';
import logo from '../assets/logo (1).svg';
import logo1 from '../assets/logo (2).svg';
import logo2 from '../assets/Visa.svg';

const PaymentMethod = ({ selectedPayment, onPaymentChange }) => {
    const handlePaymentSelect = (method) => {
        if (onPaymentChange) {
            onPaymentChange(method);
        }
    };

    return (
        <div className="mt-6">
            <p className="font-bold text-[#46A358] mb-4">Payment Method</p>

            {/* PayPal */}
            <div
                className={`border rounded-xl p-4 mb-3 cursor-pointer flex items-center justify-between ${selectedPayment === 'paypal'
                        ? 'border-[#46A358] bg-[#46A358]/10'
                        : 'border-gray-300'
                    }`}
                onClick={() => handlePaymentSelect('paypal')}
            >
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                        {selectedPayment === 'paypal' && (
                            <div className="w-2 h-2 rounded-full bg-[#46A358]"></div>
                        )}
                    </div>
                    <div className={`${selectedPayment === 'paypal'
                            ? 'text-[#46A358]'
                            : ''
                        }`}>
                            <div className='flex items-center gap-4'>
                        <p className="font-bold">PayPal</p>
                                <img src={logo} alt="" />
                            </div>
                        <p className="text-gray-500 text-sm">ADVERTISING EXPERIENCE</p>
                    </div>
                </div>
                {selectedPayment === 'paypal' && (
                    <div className="text-[#46A358]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>

            {/* MasterCard */}
            <div
                className={`border rounded-xl p-4 mb-3 cursor-pointer flex items-center justify-between ${selectedPayment === 'mastercard'
                        ? 'border-[#46A358] bg-[#46A358]/10'
                        : 'border-gray-300'
                    }`}
                onClick={() => handlePaymentSelect('mastercard')}
            >
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                        {selectedPayment === 'mastercard' && (
                            <div className="w-2 h-2 rounded-full bg-[#46A358]"></div>
                        )}
                    </div>
                    
                    <div  className={`${selectedPayment === 'mastercard'
                            ? 'text-[#46A358]'
                            : ''
                        }`}>
                              <div className='flex items-center gap-4'>
                        <p className="font-bold">MasterCard</p>
                                <img src={logo1} alt="" />
                                </div>
                        <p className="text-gray-500 text-sm">ADVERTISING EXPERIENCE</p>
                    </div>
                </div>
                {selectedPayment === 'mastercard' && (
                    <div className="text-[#46A358]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>

            {/* Visa */}
            <div
                className={`border rounded-xl p-4 mb-3 cursor-pointer flex items-center justify-between ${selectedPayment === 'visa'
                        ? 'border-[#46A358] bg-[#46A358]/10'
                        : 'border-gray-300'
                    }`}
                onClick={() => handlePaymentSelect('visa')}
            >
                <div className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center">
                        {selectedPayment === 'visa' && (
                            <div className="w-2 h-2 rounded-full bg-[#46A358]"></div>
                        )}
                    </div>

                    <div  className={`${selectedPayment === 'visa'
                            ? 'text-[#46A358]'
                            : ''
                        }`}>
                            <div className='flex items-center gap-4'>
                        <p className="font-bold">VISA</p>
                                <img src={logo2} alt="" />
                            </div>
                        <p className="text-gray-500 text-sm">ADVERTISING EXPERIENCE</p>
                    </div>
                </div>
                {selectedPayment === 'visa' && (
                    <div className="text-[#46A358]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                    </div>
                )}
            </div>

        </div>
    );
};

export default PaymentMethod;