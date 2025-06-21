import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from "../contexts/AuthContext";
import breezechesslogoblack from '../assets/breezechess-full-logo-black.png';
import breezechesslogowhite from '../assets/breezechess-full-logo-white.png';
import useDarkMode from '../darkmode/useDarkMode';
import { useNavigation } from '../navigator/navigate';
import { UserRoundCog } from 'lucide-react';
import { Menu } from 'primereact/menu';
import '../css/maintoolbar.css';

interface MenuItems {
  [key: string]: string;
}

const MainToolBar = () => {
  const { user, handleLogout } = useAuth();
  const { handleNavigation, key, curPage } = useNavigation();

  const [menuOpen, setMenuOpen] = useState(false);
  const [menuItems, setMenuItems] = useState<MenuItems>({
    'Home': '/',
    'Store': '/store',
    'About': '/about',
    'Contact': '/contact',
  });

  const menuRight = useRef<Menu | null>(null);

  const { isDarkMode } = useDarkMode();

  const dropdownItems: Array<Object> = [
    { label: 'Profile', icon: 'pi pi-user', command: () => handleNavigation('/profile') },
    { label: 'Settings', icon: 'pi pi-cog', command: () => handleNavigation('/settings') },
    { label: 'Logout', icon: 'pi pi-sign-out', command: () => user && handleLogout() }
  ];


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
<header key={key} className="h-16 flex items-center justify-between px-8 md:px-32 bg-white dark:bg-slate-900 shadow-md">
      <img
        src={isDarkMode ? breezechesslogowhite : breezechesslogoblack} alt="" className="w-52 hover:scale-105 hover:cursor-pointer transition-all"
        onClick={() => {
          let nextPage = !user ? '/' : '/home';
          if (curPage === nextPage) {
            setMenuOpen(false);
          } else {
            handleNavigation(nextPage)
          }
        }
      }
      />
      <ul className="xl:flex hidden items-center gap-12 font-semibold text-base">
        {Object.keys(menuItems).map((menuItem, i) => (
          <li
            key={i}
            className={`p-3 hover:text-sky-400 rounded-md transition-all cursor-pointer ${['Sign in', 'Logout'].includes(menuItem) && 'pt-1 pb-1'}`}
            onClick={() => handleNavigation(menuItems[menuItem])}
          >
            {menuItem}
          </li>
        )
        )}
        <li
          className={`p-3 rounded-md ${!user && 'pt-1 pb-1 hover:text-sky-400 hover:cursor-pointer'}`}
          onClick={() => !user && handleNavigation('/login')}
        >
          {!user ? (<p className="hover:text-sky-400">Login</p>) : (
            <div className="relative">
              <Menu
                model={dropdownItems}
                popup
                ref={menuRight}
                id="popup_menu_right"
                className={`ml-[78px] dark:bg-slate-700 ${isDarkMode ? 'dark-menu' : 'light-menu'} outline-1 outline-slate-200 dark:outline-slate-600`}
              />
              <button
                type="button"
                onClick={(event) => {
                  if (menuRight.current) {
                    menuRight.current.toggle(event);
                  }
                }}
                aria-controls="popup_menu_right"
                aria-haspopup="true"
                className="p-2 rounded-full focus:outline-hidden ml-4 hover:cursor-pointer"
              >
                <UserRoundCog
                  className="w-7 h-7 hover:cursor-pointer hover:text-sky-400"
                />
              </button>
            </div>

          )}
        </li>
      </ul>
      <button className='xl:hidden' onClick={() => setMenuOpen(!menuOpen)}>
        <div className='hover:cursor-pointer flex flex-col gap-2 group '>
          <div className='w-6 h-1 bg-black dark:bg-white'></div>
          <div className='w-6 h-1 bg-black dark:bg-white'></div>
          <div className='w-6 h-1 bg-black dark:bg-white'></div>
        </div>
      </button>
      {menuOpen && createPortal(
        <div className={`absolute xl:hidden top-16 left-0 w-full bg-white bc-dark-bg-light flex flex-col items-center gap-6 font-semibold text-lg transform
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
          <li
            className="list-none w-full text-center dark:text-white p-4 hover:bg-sky-400 hover:text-white transition-all cursor-pointer"
            onClick={() => {
              let nextPage = !user ? '/login' : '/profile';
              if (curPage === nextPage) {
                setMenuOpen(false);
              } else {
                handleNavigation(nextPage);
              }
            }}
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