import { React, useState, useEffect } from 'react';
import {createPortal} from 'react-dom';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import tailwindcsslogo from '../assets/tailwindcsslogo.png';

const MainToolBar = () => {
    const { user, handleLogout } = useAuth();

    const [menuOpen, setMenuOpen] = useState(false);
    const [menuItems, setMenuItems] = useState({
      'Home': '/',
      'Donate': '/donate',
      'About': '/about',
      'Contact': '/contact',
    })
    const [authButton, setAuthButton] = useState({
      'label' : 'Sign in',
      'link' : '/'
    });

    const navigate = useNavigate();

    const updateToolBar = () => {
      // Called every time user login status changes

      setMenuItems({
        'Home': !user ? '/' : '/home',
        'Donate': '/donate',
        'About': '/about',
        'Contact': '/contact',
      });

      setAuthButton({
        'label' : !user ? 'Sign in' : 'Logout',
        'link' : !user ? '/login' : '/'
      });
    }

    useEffect(() => {
      updateToolBar();
    }, [user])

    return (
        <header className="flex justify-between items-center text-black py-6 px-8 md:px-32 bg-white drop-shadow-md">
          <a href={!user ? "/" : "/home"}>
            <img src={tailwindcsslogo} alt="" className="w-52 hover:scale-105 transition-all" />
          </a>
          <ul className="xl:flex hidden items-center gap-12 font-semibold text-base">
          {Object.keys(menuItems).map((menuItem, i) => (
              <li
                key={i}
                className={`p-3 hover:text-sky-400 rounded-md transition-all cursor-pointer ${['Sign in', 'Logout'].includes(menuItem) && 'outline outline-2 outline-slate-400 pt-1 pb-1 hover:outline-sky-400'}`}
                onClick={() => navigate(menuItems[menuItem])}
              >
                {menuItem}
              </li>
           )
          )}
          <li
              className="p-3 hover:text-sky-400 rounded-md transition-all cursor-pointer outline outline-2 outline-slate-400 pt-1 pb-1 hover:outline-sky-400"
              onClick={() => {navigate(authButton['link']); user && handleLogout()}}
          >
            {authButton['label']}
          </li>
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
            {Object.keys(menuItems).map((menuItem, i) => (
              <li
                key={i}
                className="list-none w-full text-center p-4 hover:bg-sky-400 hover:text-white transition-all cursor-pointer"
                onClick={() => navigate(menuItems[menuItem])}
              >
                {menuItem}
              </li>
            ))}
            <li
                className="list-none w-full text-center p-4 hover:bg-sky-400 hover:text-white transition-all cursor-pointer"
                onClick={() => {navigate(authButton['link']); user && handleLogout()}}
            >
            {authButton['label']}
          </li>
          </div>,
          document.body
          )}
        </header>
    )
};

export default MainToolBar;