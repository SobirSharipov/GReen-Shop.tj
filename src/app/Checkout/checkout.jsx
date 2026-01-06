import { Input } from 'antd'
import TextArea from 'antd/es/input/TextArea'
import React from 'react'
import { Link } from 'react-router'

const Checkout = () => {
    return (
        <div className='p-4'>
            <div className="mb-6">
                <p>
                    <span className="font-bold text-[#46A358]">Home</span> /
                    <Link to={'/Shop'}>
                        <span className="text-gray-600"> Shop</span> /
                    </Link>
                    <Link to={'/ToCard'}>
                        <span className="text-gray-600"> Shopping Cart</span> /
                    </Link>
                    <span className="font-medium"> Checkout</span>
                </p>
            </div>

            <div>
                <div>
                    <h1 className="text-2xl font-bold text-[#46A358]">Billing Address</h1>

                    <div className='w-[70%]'>
                        <div className='grid grid-cols-2 gap-5 my-5'>
                            <Input placeholder="First Name *" />
                            <Input type="text" placeholder='Last Name *' />
                            <Input type="text" placeholder='Country / Region *' />
                            <Input type="text" placeholder='Town / City *' />
                            <Input type="text" placeholder='Street Address *' />
                            <Input type="text" placeholder='Appartment, suite, unit, etc. (optional) *' />
                            <Input type="text" placeholder='State *' />
                            <Input type="text" placeholder='Zip *' />
                            <Input type="text" placeholder='Email address *' />
                            <Input type="number" placeholder='Phone Number : +992 *' />
                        </div>
                        <TextArea rows={4} placeholder="Order notes (optional)" maxLength={6} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Checkout