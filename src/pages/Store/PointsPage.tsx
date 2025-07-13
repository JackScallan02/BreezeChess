import React, { useState, useEffect } from "react";
import { Skeleton } from "primereact/skeleton";

const PointsItemBlockSkeleton = () => {
    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md flex flex-col items-center">
            <Skeleton width="60%" height="1.75rem" className="mb-2" />
            <Skeleton height="150px" className="mb-4 w-[70%]" />
            <Skeleton width="70%" height="50px" />
        </div>
    );
};

const PointsItemBlock = ({ item }: { item: { amount: number; price: number; image: string } }) => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);

    return (
        <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center">
            <h2 className="md:text-2xl text-xl font-semibold mb-2">Points: {item.amount}</h2>
            <img
                src={item.image}
                alt={`Points Item ${item.amount}`}
                className="object-contain rounded mt-2 mb-4 w-full h-[150px]"
                style={{ display: isImageLoaded ? 'block' : 'none' }}
                onLoad={() => setIsImageLoaded(true)}
            />
            {!isImageLoaded && (
                <Skeleton height="150px" className="rounded w-full" />
            )}
            <button className={`cursor-pointer mt-4 bg-blue-500 text-white md:text-xl text-lg font-bold py-3 rounded hover:bg-blue-600 transition-colors duration-200 w-[60%]`}>
                ${item.price.toFixed(2)}
            </button>
        </div>
    );
};

const PointsPage = () => {
    const [pointItems, setPointItems] = useState<Array<{ amount: number; price: number; image: string }>>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        setTimeout(() => {
            const itemsFromApi = Array.from({ length: 12 }, (_, i) => ({
                amount: (i + 1) * 100000,
                price: (i + 1) * 9.99,
                image: 'https://picsum.photos/200'
            }));
            setPointItems(itemsFromApi);
            // Set loading to false after data is "fetched"
            setLoading(false);
        }, 1000); // Simulate a 2-second loading time
    }, []);

    return (
        <>
            <div className="flex flex-col md:flex-row gap-8">
                {/* Main Featured Item */}
                {/* Grid of other items */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 w-full">
                    {loading ? (
                        // 5. Render a list of skeletons while loading
                        Array.from({ length: 12 }).map((_, i) => (
                            <PointsItemBlockSkeleton key={i} />
                        ))
                    ) : (
                        // Render actual items when data is available
                        pointItems.map((item, i) => (
                            <PointsItemBlock
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

export default PointsPage;