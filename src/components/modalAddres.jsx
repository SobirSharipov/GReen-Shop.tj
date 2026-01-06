import { Input, Modal } from 'antd';
import TextArea from 'antd/es/input/TextArea';
import React, { useState } from 'react'

const ModalAddres = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <div>
            <button onClick={showModal} className="w-full mt-6 bg-[#46A358] text-white py-3 rounded-lg font-semibold hover:bg-[#3a8a47] transition-colors">
            Proceed to Checkout
          </button>
            <Modal
                title="Billing Address"
                closable={{ 'aria-label': 'Custom Close Button' }}
                open={isModalOpen}
                onOk={handleOk}
                onCancel={handleCancel}
            >
                <div className=''>
                    <div className='grid grid-cols-2 gap-5 my-5'>
                        <Input placeholder="First Name *" />
                        <Input type="text" placeholder='Last Name *' />
                        <Input type="text" placeholder='Email address *' />
                        <Input type="number" placeholder='Phone Number : +992 *' />
                        <Input type="text" placeholder='Country / Region *' />
                        <Input type="text" placeholder='Town / City *' />
                        <Input type="text" placeholder='Street Address *' />
                        <Input type="text" placeholder='Appartment, suite, unit, etc. (optional) *' />
                    </div>
                    <TextArea rows={4} placeholder="Order notes (optional)" maxLength={6} />
                </div>
            </Modal>
        </div>
    )
}

export default ModalAddres