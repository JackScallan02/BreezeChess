import React, { useState, useEffect } from "react";
import MainToolBar from "../components/MainToolBar";
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { Skeleton } from "primereact/skeleton";

interface MenuItems {
    [key: string]: string;
}

// Fake featured item data for now
const FEATURED_ITEM = {
    name: 'Main Featured Item',
    price: 19.99,
    description: 'This is a featured item description.',
    image: 'https://picsum.photos/400'
}

const StoreToolBar = () => {

    const [_, setSearchParams] = useSearchParams();

    const [menuOpen, setMenuOpen] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItems>({
        'Featured': 'featured',
        'Chess pieces': 'pieces',
        'Chess sets': 'sets',
        'Points': 'points',
        'Loot Boxes': 'lootboxes',
        'Checkmate Effects': 'cmeffects',
    });
    // Get the currently active page from the URL query parameters
    // This will update automatically when the URL changes due to the hook's internal state

    // Handler for clicking a store menu item
    const handleStoreMenuItemClick = (pageIdentifier: string) => {
        // Use the setParam function from your custom hook to update the 'page' query parameter
        setSearchParams({ page: pageIdentifier });
        setMenuOpen(false); // Close the mobile menu after selection
    };
    return (
        <div className="w-full h-16 flex items-center md:justify-center px-16 bg-white dark:bg-slate-700 shadow-md">
            <ul className="hidden md:flex lg:max-w-[90%] justify-between items-center font-semibold lg:text-xl text-base w-full">
                {Object.keys(menuItems).map((menuItem, i) => (
                    <li
                        key={i}
                        className={`text-nowrap p-3 hover:text-sky-400 rounded-md transition-all cursor-pointer ${['Sign in', 'Logout'].includes(menuItem) ? 'pt-1 pb-1' : ''
                            }`}
                        onClick={() => handleStoreMenuItemClick(menuItems[menuItem])}
                    >
                        {menuItem}
                    </li>
                ))}
            </ul>

            <button className='md:hidden' onClick={() => setMenuOpen(!menuOpen)}>
                <div className='hover:cursor-pointer flex flex-col gap-2 group '>
                    <div className='w-6 h-1 bg-black dark:bg-white'></div>
                    <div className='w-6 h-1 bg-black dark:bg-white'></div>
                    <div className='w-6 h-1 bg-black dark:bg-white'></div>
                </div>
            </button>
            {menuOpen && createPortal(
                <div className={`absolute md:hidden top-48 left-0 w-full bg-white bc-dark-bg-light flex flex-col items-center gap-2 font-semibold text-lg transform
          ${menuOpen ? 'opacity-100 z-50' : 'opacity-0 pointer-events-none'} transition-opacity transition-transform duration-300 ease-in-out`}
                >
                    {Object.keys(menuItems).map((menuItem, i) => (
                        <li
                            key={i}
                            className="list-none w-full text-center dark:text-white p-4 hover:bg-sky-400 hover:text-white transition-all cursor-pointer"
                            onClick={() => handleStoreMenuItemClick(menuItems[menuItem])}
                        >
                            {menuItem}
                        </li>
                    ))}

                </div>,
                document.body
            )}
        </div>
    )
}

const Store = () => {
    const [searchParams] = useSearchParams();
    const currentPage = searchParams.get('page') || 'featured';

    return (
        <div className="flex flex-col w-full h-full">
            <MainToolBar />
            <div className="flex items-center w-full justify-center md:mt-8 mt-4 md:mb-8 mb-4 md:h-12 h-8">
                <h1 className="md:text-4xl text-2xl font-bold mb-4">Item Shop</h1>
            </div>
            <div>
                <StoreToolBar />
            </div>
            <div className="flex-grow p-4">
                {currentPage === 'featured' && <FeaturedPage />}
                {currentPage === 'pieces' && <div>Chess Pieces Content</div>}
                {currentPage === 'sets' && <div>Chess Sets Content</div>}
                {currentPage === 'points' && <div>Points Content</div>}
                {currentPage === 'lootboxes' && <div>Loot Boxes Content</div>}
                {currentPage === 'cmeffects' && <div>Checkmate Effects Content</div>}
            </div>
        </div>
    );
};

const ItemBlockSkeleton = ({ isFeatured = false }) => {
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

const ItemBlock = ({ item, isFeatured }: { item: { name: string; price: number; description: string, image: string }; isFeatured?: boolean; }) => {

    const [isImageLoaded, setIsImageLoaded] = useState(false);

    // Define styles that change based on whether the item is featured
    const imageContainerClass = isFeatured ? 'md:w-[80%] w-[40%]' : 'w-[60%]';
    const skeletonHeight = isFeatured ? '300px' : '150px';
    return (
        <div className={`${FEATURED_ITEM.name === item.name && 'md:h-full md:max-h-[70vh]'} bg-white dark:bg-slate-800 p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 flex flex-col items-center`}>
            <h2 className="text-3xl font-semibold mb-2">{item.name}</h2>
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
            <button className={`cursor-pointer mt-4 bg-blue-500 ${isFeatured ? 'w-[90%]' : 'w-[70%]'} text-white text-xl font-bold px-8 py-3 rounded hover:bg-blue-600 transition-colors duration-200`}>
                ${item.price.toFixed(2)}
            </button>
        </div>
    );
}


const FeaturedPage = () => {
    const [featuredItems, setFeaturedItems] = useState<Array<{ name: string; price: number; description: string; image: string }>>([]);
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Simulate an API call with a timeout
        setTimeout(() => {
            // TODO: fetch our data here
            const itemsFromApi = Array.from({ length: 12 }, (_, i) => (FEATURED_ITEM));
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
                        <ItemBlockSkeleton isFeatured={true} />
                    ) : (
                        <ItemBlock item={FEATURED_ITEM} isFeatured={true} />
                    )}
                </div>

                {/* Grid of other items */}
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 w-full">
                    {loading ? (
                        // 5. Render a list of skeletons while loading
                        Array.from({ length: 12 }).map((_, i) => (
                            <ItemBlockSkeleton key={i} />
                        ))
                    ) : (
                        // Render actual items when data is available
                        featuredItems.map((item, i) => (
                            <ItemBlock
                                key={i}
                                item={item}
                            />
                        ))
                    )}
                </div>
            </div>
        </>
    )
}

export default Store;