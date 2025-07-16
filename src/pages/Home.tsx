import React, { useEffect, useState } from 'react';
import MainToolBar from '../components/MainToolBar';
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from './Loading';
import { useNavigation } from '../navigator/navigate';
import { Swords, WalletCards, Bot } from 'lucide-react';

const Home = () => {
  const { user, loading } = useAuth();
  const { handleNavigation, key } = useNavigation();

  const [hovered, setHovered] = useState(-1); // Assigns a number for each div, depending on if it is being hovered

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
          <div className="flex md:flex-row flex-col w-full items-center justify-center mt-8 gap-x-16 gap-y-4">
            <button
              className="text-xl bg-indigo-500 text-white font-bold py-4 px-8 rounded cursor-pointer hover:bg-indigo-600 transition duration-200 ease-in-out transform hover:scale-105"
              onClick={() => {}}
            >
              <div className="flex flex-row gap-x-2 items-center stroke-10">
                <WalletCards className="w-6 h-6" />
                Collection
              </div>
            </button>
            <button
              className="text-xl bg-indigo-500 text-white font-bold py-4 px-8 rounded cursor-pointer hover:bg-indigo-600 transition duration-200 ease-in-out transform hover:scale-105"
              onClick={() => handleNavigation('/train')}
            >
              <div className="flex flex-row gap-x-2 items-center stroke-10">
                <Swords className="w-6 h-6" />
                Training
              </div>
            </button>
            <button
              className="text-xl bg-indigo-500 text-white font-bold py-4 px-8 rounded cursor-pointer hover:bg-indigo-600 transition duration-200 ease-in-out transform hover:scale-105"
              onClick={() => {}}
            >
              <div className="flex flex-row gap-x-2 items-center stroke-10">
                <Bot className="w-6 h-6" />
                Online play
              </div>
            </button>
          </div>
        </main>
      </div>
    );
  }

  return null;
};

export default Home;
