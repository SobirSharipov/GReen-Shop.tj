import { Carousel, Spin } from 'antd';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { useGetUsersQuery } from '../services/UserApi';
import { useNavigate } from 'react-router';

const CarousetProducks = () => {
    const { data: allData, isLoading, error } = useGetUsersQuery();
    const [selectedImageId, setSelectedImageId] = useState(null);
    const [viewportWidth, setViewportWidth] = useState(() => window.innerWidth);
    const navigate = useNavigate();
    const navigateTimerRef = useRef(null);

    useEffect(() => {
        const onResize = () => setViewportWidth(window.innerWidth);
        window.addEventListener('resize', onResize);
        return () => window.removeEventListener('resize', onResize);
    }, []);

    useEffect(() => {
        return () => {
            if (navigateTimerRef.current) {
                clearTimeout(navigateTimerRef.current);
                navigateTimerRef.current = null;
            }
        };
    }, []);

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

    // Show no more than 40 products in this component
    const limitedData = useMemo(() => (allData || []).slice(0, 40), [allData]);

    // Responsive chunk size: 1 (mobile) / 2 (tablet) / 4 (desktop)
    const chunkSize = viewportWidth < 640 ? 1 : viewportWidth < 1024 ? 2 : 4;
    const dataChunks = useMemo(() => chunkArray(limitedData, chunkSize), [limitedData, chunkSize]);

    const gridColsClass =
        chunkSize === 1 ? 'grid-cols-1' : chunkSize === 2 ? 'grid-cols-2' : 'grid-cols-2 lg:grid-cols-4';

    return (
        <div className="mt-10 md:mt-12">
            <div className='border-b-2 border-[#46A358] mb-8'>
            <h2 className="text-xl md:text-2xl font-bold text-[#46A358] mb-2" style={{ fontFamily: 'Montserrat-Bold, sans-serif' }}>
                Related Products
            </h2>
            </div>
            
            <Carousel 
                autoplay 
                autoplaySpeed={3000}
                dots={true}
                className="custom-carousel related-carousel"
            >
                {dataChunks.map((chunk, chunkIndex) => (
                    <div key={chunkIndex} className="px-2 sm:px-4 pb-6">
                        <div className={`grid ${gridColsClass} gap-3 sm:gap-5 lg:gap-6`}>
                            {chunk.map((el) => (
                                <div
                                    key={el.id}
                                    className={`bg-white border rounded-2xl p-3 sm:p-4 cursor-pointer transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5 ${
                                        selectedImageId === el.id 
                                            ? 'border-[#46A358] bg-green-50 shadow-md' 
                                            : 'border-gray-200 hover:border-gray-300'
                                    }`}
                                    onClick={() => {
                                        setSelectedImageId(el.id);

                                        if (navigateTimerRef.current) {
                                            clearTimeout(navigateTimerRef.current);
                                        }

                                        navigateTimerRef.current = setTimeout(() => {
                                            navigate(`/info/${el.id}`);
                                        }, 2000);
                                    }}
                                >
                                    <img
                                        src={el.avatar}
                                        alt={el.name}
                                        className="w-full h-52 sm:h-44 md:h-48 lg:h-40 object-cover rounded-xl mb-3"
                                    />
                                    <h3 className="font-semibold text-base sm:text-lg truncate text-gray-900" style={{ fontFamily: 'Inter-SemiBold, sans-serif' }}>
                                        {el.name}
                                    </h3>
                                    <p className="text-[#46A358] font-bold text-lg sm:text-xl mt-1" style={{ fontFamily: 'Montserrat-Bold, sans-serif' }}>
                                        ${el.prase}
                                    </p>
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