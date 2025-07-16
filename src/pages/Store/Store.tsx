import React, { useState, useEffect } from "react";
import MainToolBar from "../../components/MainToolBar";
import { createPortal } from 'react-dom';
import { useSearchParams } from 'react-router-dom';
import { Skeleton } from "primereact/skeleton";
import PointsPage from "./PointsPage";
import FeaturedPage from "./FeaturedPage";
import ChessPiecePage from "./ChessPiecePage";
import ChessSetPage from "./ChessSetPage";
import { Sparkles } from "lucide-react";
import { useUserData } from "../../contexts/UserDataContext";

interface MenuItems {
    [key: string]: string;
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
        'Game Effects': 'gameeffects',
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
    const { points } = useUserData();

    return (
        <div className="flex flex-col w-full h-full">
            <MainToolBar />
            <div className="relative w-full flex items-center h-12 p-8">
                {/* Item Shop (Centered to page) */}
                <div className="md:absolute md:left-1/2 md:transform md:-translate-x-1/2">
                    <h1 className="md:text-4xl text-2xl font-bold">Item Shop</h1>
                </div>

                {/* Points (Right side) */}
                <div className="ml-auto flex flex-row items-center gap-x-2">
                    <div className="flex flex-row items-center gap-x-1">
                        <Sparkles className="md:w-6 md:h-6 h-4 w-4" />
                        <p className="md:text-2xl text-lg">{points}</p>
                    </div>
                    <p className="md:text-2xl text-lg">points</p>
                </div>
            </div>

            <div>
                <StoreToolBar />
            </div>
            <div className="flex-grow p-4">
                {currentPage === 'featured' && <FeaturedPage />}
                {currentPage === 'pieces' && <ChessPiecePage />}
                {currentPage === 'sets' && <ChessSetPage />}
                {currentPage === 'points' && <PointsPage />}
                {currentPage === 'lootboxes' && <div>Loot Boxes Content</div>}
                {currentPage === 'gameeffects' && <div>Game Effects Content</div>}
            </div>
        </div>
    );
};



export default Store;