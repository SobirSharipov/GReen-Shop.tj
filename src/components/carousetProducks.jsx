import { Carousel, Spin } from 'antd';
import React, { useState } from 'react';
import { useGetUsersQuery } from '../services/UserApi';

const CarousetProducks = () => {
    const { data: allData, isLoading, error } = useGetUsersQuery();
    const [selectedImageId, setSelectedImageId] = useState(null);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Spin size="large" />
            </div>
        );
    }

    if (error) {
        return <div className="text-center text-red-500">Error loading data</div>;
    }

    const chunkArray = (array, chunkSize) => {
        const chunks = [];
        for (let i = 0; i < array.length; i += chunkSize) {
            chunks.push(array.slice(i, i + chunkSize));
        }
        return chunks;
    };

    const dataChunks = chunkArray(allData || [], 4);

    return (
        <div className="mt-12">
            <div className='border-b-2 border-[#46A358] mb-8'>
            <h2 className="text-2xl font-bold text-[#46A358] mb-2">Releted Products</h2>
            </div>
            
            <Carousel 
                autoplay 
                autoplaySpeed={3000}
                dots={true}
                className="custom-carousel"
            >
                {dataChunks.map((chunk, chunkIndex) => (
                    <div key={chunkIndex} className="px-4 mb-10">
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                            {chunk.map((el) => (
                                <div
                                    key={el.id}
                                    className={`border rounded-xl p-4 cursor-pointer transition-all duration-300 hover:shadow-lg ${
                                        selectedImageId === el.id 
                                            ? 'border-[#46A358] bg-green-50 shadow-md' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => setSelectedImageId(el.id)}
                                >
                                    <img
                                        src={el.avatar}
                                        alt={el.name}
                                        className="w-full md:h-40 h-20 object-cover rounded-lg mb-3"
                                    />
                                    <h3 className="font-semibold text-lg truncate">{el.name}</h3>
                                    <p className="text-[#46A358] font-medium text-xl">${el.prase}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </Carousel>
        </div>
    );
};

export default CarousetProducks;