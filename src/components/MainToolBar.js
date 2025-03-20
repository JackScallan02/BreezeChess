import { React, useState, useEffect } from 'react';
import {createPortal} from 'react-dom';
import { useAuth } from "../contexts/AuthContext";
import breezechesslogoblack from '../assets/breezechess-full-logo-black.png';
import breezechesslogowhite from '../assets/breezechess-full-logo-white.png';
import useDarkMode from '../darkmode/useDarkMode';
import { useNavigation } from '../navigator/navigate';
import { UserRoundCog } from 'lucide-react';

const MainToolBar = () => {
    const { user, handleLogout } = useAuth();

    const { handleNavigation, key } = useNavigation();

    const { isDarkMode } = useDarkMode();

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



    useEffect(() => {
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
      updateToolBar();
    }, [user])

    return (
        <header key={key} className="h-16 flex justify-between items-center text-black dark:text-white py-6 px-8 md:px-32 bg-white dark:bg-slate-800 bg-drop-shadow-md">
          <a href={!user ? "/" : "/home"}>
            <img src={isDarkMode ? breezechesslogowhite : breezechesslogoblack} alt="" className="w-52 hover:scale-105 transition-all" />
          </a>
          <ul className="xl:flex hidden items-center gap-12 font-semibold text-base">
          {Object.keys(menuItems).map((menuItem, i) => (
              <li
                key={i}
                className={`p-3 hover:text-sky-400 rounded-md transition-all cursor-pointer ${['Sign in', 'Logout'].includes(menuItem) && 'outline outline-2 outline-slate-400 pt-1 pb-1 hover:outline-sky-400'}`}
                onClick={() => handleNavigation(menuItems[menuItem])}
              >
                {menuItem}
              </li>
           )
          )}
          <li
              className="p-3 hover:text-sky-400 rounded-md transition-all cursor-pointer"
              onClick={() => {handleNavigation(authButton['link']); user && handleLogout()}}
          >
            <UserRoundCog className="w-7 h-7 text-white-500 ml-4" />
          </li>
          </ul>
          <button className='space-y-1 group xl:hidden' onClick={() => setMenuOpen(!menuOpen)}>
            <div className='w-6 h-1 bg-black dark:bg-white'></div>
            <div className='w-6 h-1 bg-black dark:bg-white'></div>
            <div className='w-6 h-1 bg-black dark:bg-white'></div>
          </button>
          {createPortal(
          <div className={`absolute xl:hidden top-16 left-0 w-full bg-white dark:bg-slate-800 flex flex-col items-center gap-6 font-semibold text-lg transform
          ${menuOpen ? 'opacity-100 z-50' : 'opacity-0 pointer-events-none'} transition-opacity transition-transform duration-300 ease-in-out`}
          >
            {Object.keys(menuItems).map((menuItem, i) => (
              <li
                key={i}
                className="list-none w-full text-center dark:text-white p-4 hover:bg-sky-400 hover:text-white dark:hover:text-black transition-all cursor-pointer"
                onClick={() => handleNavigation(menuItems[menuItem])}
              >
                {menuItem}
              </li>
            ))}
            <li
                className="list-none w-full text-center dark:text-white p-4 hover:bg-sky-400 hover:text-white dark:hover:text-black transition-all cursor-pointer"
                onClick={() => {handleNavigation(authButton['link']); user && handleLogout()}}
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