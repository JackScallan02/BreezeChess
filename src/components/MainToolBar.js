import { React, useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from "../contexts/AuthContext";
import breezechesslogoblack from '../assets/breezechess-full-logo-black.png';
import breezechesslogowhite from '../assets/breezechess-full-logo-white.png';
import useDarkMode from '../darkmode/useDarkMode';
import { useNavigation } from '../navigator/navigate';
import { UserRoundCog } from 'lucide-react';
import { Menu } from 'primereact/menu';
import '../css/maintoolbar.css';

const MainToolBar = () => {
  const { user, handleLogout } = useAuth();

  const { handleNavigation, key } = useNavigation();

  const menuRight = useRef(null);
  const items = [
    { label: 'Profile', icon: 'pi pi-user', command: () => handleNavigation('/profile') },
    { label: 'Settings', icon: 'pi pi-cog', command: () => handleNavigation('/settings') },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => user && handleLogout() }
  ];

  const { isDarkMode } = useDarkMode();

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState({
    'Home': '/',
    'Store': '/store',
    'About': '/about',
    'Contact': '/contact',
  })


  useEffect(() => {
    const updateToolBar = () => {
      // Called every time user login status changes
      setMenuItems({
        'Home': !user ? '/' : '/home',
        'Store': '/store',
        'About': '/about',
        'Contact': '/contact',
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
            className={`p-3 hover:text-sky-400 rounded-md transition-all cursor-pointer ${['Sign in', 'Logout'].includes(menuItem) && 'outline-2 outline-slate-400 pt-1 pb-1 hover:outline-sky-400'}`}
            onClick={() => handleNavigation(menuItems[menuItem])}
          >
            {menuItem}
          </li>
        )
        )}
        <li
          className={`p-3 hover:text-sky-400 rounded-md transition-all cursor-pointer ${!user && 'outline-2 outline-slate-400 pt-1 pb-1 hover:outline-sky-400'}`}
          onClick={() => !user && handleNavigation('/login')}
        >
          {!user ? 'Login' : (
            <div className="relative">
              <Menu
                model={items}
                popup
                ref={menuRight}
                id="popup_menu_right"
                className="ml-[78px] dark:bg-slate-700 dark:dark-menu light-menu outline-1 outline-slate-200"

              />
              <button
                type="button"
                onClick={(event) => {
                  menuRight.current.toggle(event);

                }}
                aria-controls="popup_menu_right"
                aria-haspopup="true"
                className="p-2 rounded-full  focus:outline-hidden ml-4"
              >
                <UserRoundCog className="w-7 h-7 dark:text-white" />
              </button>
            </div>

          )}
        </li>
      </ul>
      <button className='flex flex-col gap-4 group xl:hidden' onClick={() => setMenuOpen(!menuOpen)}>
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
            onClick={() => !user ? handleNavigation('/login') : handleNavigation('/profile')}
            >
            {!user ? 'Login' : 'Profile'}
          </li>
        </div>,
        document.body
      )}
    </header>
  )
};

export default MainToolBar;