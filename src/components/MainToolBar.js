import { React, useState } from 'react';
import {createPortal} from 'react-dom';
import tailwindcsslogo from '../assets/tailwindcsslogo.png';

const MainToolBar = () => {
    const [menuOpen, setMenuOpen] = useState(false);

    const menuItems = {
      'Home': '/',
      'Donate': '/donate',
      'Store': '/store',
      'Contact': '/contact',
      'Sign in': '/login'
    }

    return (
        <header className="flex justify-between items-center text-black py-6 px-8 md:px-32 bg-white drop-shadow-md">
          <a href="#">
            <img src={tailwindcsslogo} alt="" className="w-52 hover:scale-105 transition-all" />
          </a>
          <ul className="xl:flex hidden items-center gap-12 font-semibold text-base">
          {Object.keys(menuItems).map((menuItem) => (
              <li className={`p-3 hover:text-sky-400 rounded-md transition-all cursor-pointer ${menuItem === 'Sign in' && 'outline outline-2 outline-slate-600 pt-1 pb-1 hover:outline-sky-400'}`}>{<a href={menuItems[menuItem]}>{menuItem}</a>}</li>
           )
          )}
          </ul>
          <button className='space-y-1 group xl:hidden' onClick={() => setMenuOpen(!menuOpen)}>
            <div className='w-6 h-1 bg-black'></div>
            <div className='w-6 h-1 bg-black'></div>
            <div className='w-6 h-1 bg-black'></div>
          </button>
          {createPortal(
          <div className={`absolute xl:hidden top-20 left-0 w-full bg-white flex flex-col items-center gap-6 font-semibold text-lg transform
          ${menuOpen ? 'opacity-100 z-50' : 'opacity-0 pointer-events-none'} transition-opacity transition-transform duration-300 ease-in-out`}
          >
            {Object.keys(menuItems).map((menuItem) => (
              <li className="list-none w-full text-center p-4 hover:bg-sky-400 hover:text-white transition-all cursor-pointer">{<a href={menuItems[menuItem]}>{menuItem}</a>}</li>
            ))}
          </div>,
          document.body
          )}
        </header>
    )
};

export default MainToolBar;