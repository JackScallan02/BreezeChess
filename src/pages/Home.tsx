import React, { useEffect, useState } from 'react';
import MainToolBar from '../components/MainToolBar';
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from './Loading';
import { useNavigation } from '../navigator/navigate';
import { Swords, WalletCards, Bot } from 'lucide-react';
import { CalendarArrowDown } from 'lucide-react';

const Home = () => {
  const { user, loading } = useAuth();
  const { handleNavigation, key } = useNavigation();

  useEffect(() => {
    if (!loading && !user) handleNavigation('/')
  }, [handleNavigation, loading, user]);

  if (loading) return <LoadingScreen />

  if (user && !loading) {
    return (
      <div key={key} className="flex flex-col min-h-screen w-full h-full">
        <MainToolBar />
        <main className="w-full h-full">
          <div className="flex flex-row w-full justify-center mt-8">
            <p className="dark:text-white text-4xl font-bold">Welcome, {user.username}</p>
          </div>
          <div className="flex flex-row w-full justify-center mt-8">
            <p className="dark:text-white text-xl">Choose an option from below!</p>
          </div>
          <br />

          <div className="flex md:flex-row flex-col w-full items-start justify-center gap-x-16 gap-y-4 p-8">
            <button
              className="text-xl bg-indigo-500 text-white font-bold py-4 px-8 rounded cursor-pointer hover:bg-indigo-600 transition duration-200 ease-in-out transform hover:scale-105 w-full md:w-auto" // Added w-full for small screens, md:w-auto for medium+
              onClick={() => { }}
            >
              <div className="flex flex-row gap-x-2 items-center justify-center stroke-10"> {/* Added justify-center */}
                <WalletCards className="w-6 h-6" />
                Collection
              </div>
            </button>
            <button
              className="text-xl bg-indigo-500 text-white font-bold py-4 px-8 rounded cursor-pointer hover:bg-indigo-600 transition duration-200 ease-in-out transform hover:scale-105 w-full md:w-auto" // Added w-full for small screens, md:w-auto for medium+
              onClick={() => handleNavigation('/train')}
            >
              <div className="flex flex-row gap-x-2 items-center justify-center stroke-10"> {/* Added justify-center */}
                <Swords className="w-6 h-6" />
                Training
              </div>
            </button>

            <div className="flex flex-col items-center w-full md:w-auto">
              <button
                className="text-xl bg-indigo-500 text-white font-bold py-4 px-8 rounded opacity-60 w-full md:w-auto" // Added w-full for small screens, md:w-auto for medium+
                onClick={() => { }}
              >
                <div className="flex flex-row gap-x-2 items-center justify-center"> {/* Added justify-center */}
                  <Bot className="w-6 h-6" />
                  Online play
                </div>
              </button>
              <div className="flex flex-row items-center justify-center gap-x-2 mt-2 w-full"> {/* justify-center already present */}
                <CalendarArrowDown className="text-gray-200 select-none" />
                <p className="text-sm text-gray-200">Coming soon!</p>
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return null;
};

export default Home;