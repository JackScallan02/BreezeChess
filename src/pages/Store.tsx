import React, { useState, useRef } from "react";
import MainToolBar from "../components/MainToolBar";
import { createPortal } from 'react-dom';
import { useAuth } from "../contexts/AuthContext";
import useDarkMode from '../darkmode/useDarkMode';
import { useNavigation } from '../navigator/navigate';
import { Menu } from 'primereact/menu';

interface MenuItems {
    [key: string]: string;
}

const StoreToolBar = () => {

    const { user, handleLogout } = useAuth();
    const { handleNavigation, key, curPage } = useNavigation();

    const [menuOpen, setMenuOpen] = useState(false);
    const [menuItems, setMenuItems] = useState<MenuItems>({
        'Chess pieces': '/store/pieces',
        'Chess sets': '/store/sets',
        'Points': '/store/points',
        'Loot Boxes': '/store/lootboxes',
        'Checkmate Effects': '/store/cmeffects',
    });

    return (
        <header key={key} className="w-full h-16 flex items-center md:justify-center px-16 bg-white dark:bg-slate-700 shadow-md">
            <ul className="hidden md:flex lg:max-w-[90%] justify-between items-center font-semibold text-base w-full">
                {Object.keys(menuItems).map((menuItem, i) => (
                    <li
                        key={i}
                        className={`text-nowrap p-3 hover:text-sky-400 rounded-md transition-all cursor-pointer ${['Sign in', 'Logout'].includes(menuItem) ? 'pt-1 pb-1' : ''
                            }`}
                        onClick={() => handleNavigation(menuItems[menuItem])}
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
                <div className={`absolute md:hidden top-48 left-0 w-full bg-white bc-dark-bg-light flex flex-col items-center gap-6 font-semibold text-lg transform
          ${menuOpen ? 'opacity-100 z-50' : 'opacity-0 pointer-events-none'} transition-opacity transition-transform duration-300 ease-in-out`}
                >
                    {Object.keys(menuItems).map((menuItem, i) => (
                        <li
                            key={i}
                            className="list-none w-full text-center dark:text-white p-4 hover:bg-sky-400 hover:text-white transition-all cursor-pointer"
                            onClick={() => { handleNavigation(menuItems[menuItem]); if (curPage === menuItems[menuItem]) setMenuOpen(false); }}
                        >
                            {menuItem}
                        </li>
                    ))}

                </div>,
                document.body
            )}
        </header>
    )
}

const Store = () => {
    return (
        <div className="flex flex-col w-screen h-screen">
            <MainToolBar />
            <div className="flex items-center w-full justify-center md:mt-8 mt-4 md:mb-8 mb-4 md:h-12 h-8">
                <h1 className="md:text-4xl text-2xl font-bold mb-4">Item Shop</h1>
            </div>
            <div>
                <StoreToolBar />
            </div>

        </div>
    );
};

export default Store;