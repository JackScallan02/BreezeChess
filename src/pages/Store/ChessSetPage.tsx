import React, { useState, useEffect } from "react";
import { Skeleton } from "primereact/skeleton";

const CHESS_SET_ITEM = {
    name: 'Chess Set',
    price: 19.99,
    description: 'This is a chess set item description.',
    image: 'https://picsum.photos/400'
};

const ChessSetPage = () => {
    const [featuredItems, setFeaturedItems] = useState<Array<{ name: string; price: number; description: string; image: string }>>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Simulate an API call with a timeout
        setTimeout(() => {
            // TODO: fetch our data here
            const itemsFromApi = Array.from({ length: 12 }, (_, i) => (CHESS_SET_ITEM));
            setFeaturedItems(itemsFromApi);
            // Set loading to false after data is "fetched"
            setLoading(false);
        }, 1000); // Simulate a 2-second loading time
    }, []);

    return (
        <>
            <div className="flex flex-col md:flex-row gap-8">
                {/* Main Featured Item */}
                <div className="w-full md:w-[35%]">
                    {/* 4. Conditionally render skeleton or item */}
                    {loading ? (
                        <ChessSetBlockSkeleton isFeatured={true} />
                    ) : (
                        <ChessSetBlock item={CHESS_SET_ITEM} isFeatured={true} />
                    )}
                </div>

                {/* Grid of other items */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full">
                    {loading ? (
                        // 5. Render a list of skeletons while loading
                        Array.from({ length: 12 }).map((_, i) => (
                            <ChessSetBlockSkeleton key={i} />
                        ))
                    ) : (
                        // Render actual items when data is available
                        featuredItems.map((item, i) => (
                            <ChessSetBlock
                                key={i}
                                item={item}
                            />
                        ))
                    )}
                </div>
            </div>
        </>
    )
};

const ChessSetBlockSkeleton = ({ isFeatured = false }) => {
    const imageContainerClass = isFeatured ? 'md:w-[80%] w-[40%]' : 'w-[60%]';

    return (
        <div className={`${isFeatured ? 'md:h-full md:max-h-[70vh]' : ''} bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex flex-col items-center`}>
            {/* Skeleton for the title */}
            <Skeleton width="60%" height="1.75rem" className="mb-2" />

            {/* Skeleton for the description */}
            <Skeleton width="80%" height="1rem" className="mb-4" />

            {/* Skeleton for the image, with different heights for featured vs. regular items */}
            <div className={`${imageContainerClass}`}>
                <Skeleton height={isFeatured ? "300px" : "150px"} className="mb-4" />
            </div>

            {/* Skeleton for the button */}
            <Skeleton width={isFeatured ? "90%" : "70%"} height="50px" />
        </div>
    );
};

const ChessSetBlock = ({ item, isFeatured }: { item: { name: string; price: number; description: string, image: string }; isFeatured?: boolean; }) => {

    const [isImageLoaded, setIsImageLoaded] = useState(false);

    // Define styles that change based on whether the item is featured
    const imageContainerClass = isFeatured ? 'md:w-[80%] w-[40%]' : 'w-[60%]';
    const skeletonHeight = isFeatured ? '300px' : '150px';
    return (
        <div className={`${CHESS_SET_ITEM.name === item.name && 'md:h-full md:max-h-[70vh]'} bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center`}>
            <h2 className="md:text-3xl text-2xl font-semibold mb-2">{item.name}</h2>
            <p className="text-gray-600 dark:text-gray-300 mb-4 text-lg">{item.description}</p>
            <div className={imageContainerClass}>
            <img
                src={item.image}
                alt={item.name}
                className="object-contain rounded mt-2 mb-4"
                style={{ display: isImageLoaded ? 'block' : 'none' }}
                onLoad={() => setIsImageLoaded(true)}
            />
                {!isImageLoaded && (
                    <Skeleton height={skeletonHeight} className="rounded" />
                )}
            </div>
            <button className={`cursor-pointer mt-4 bg-blue-500 ${isFeatured ? 'w-[90%]' : 'w-[70%]'} text-white md:text-xl text-lg font-bold py-3 rounded hover:bg-blue-600 transition-colors duration-200`}>
                ${item.price.toFixed(2)}
            </button>
        </div>
    );
};

export default ChessSetPage;