import React, { useEffect, useState } from 'react';
import MainToolBar from '../components/MainToolBar';
import { useAuth } from "../contexts/AuthContext";
import LoadingScreen from './Loading';
import { useNavigation } from '../navigator/navigate';

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
            <p className="text-[3rem] font-bold">Welcome, {user.username}</p>
          </div>
          <div className="flex flex-row w-full justify-evenly mt-16 h-[30rem]">
          <div
              className="group relative rounded-2xl p-4 bg-white shadow-md border w-[25%] h-full text-center flex flex-col justify-center items-center active:scale-[.98] active:duration-75 hover:scale-[1.01] hover:cursor-pointer ease-in-out transition-all overflow-hidden"
              onMouseOver={() => setHovered(0)}
              onMouseLeave={() => setHovered(-1)}
              onClick={() => handleNavigation('/train')}
            >
              <img
                src="/assets/other_images/training-image.jpeg"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="relative z-10 text-white text-[2.5rem] tracking-wide font-bold transition-all duration-300 ease-in-out group-hover:text-[2.75rem]"
                style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.9)' }}
              >
                Train
              </div>
              <div className={`absolute inset-0 ${hovered !== 0 && 'bg-black/20'} z-0`} />
            </div>
            <div
              className="group relative rounded-2xl p-4 bg-white shadow-md border w-[25%] h-full text-center flex flex-col justify-center items-center active:scale-[.98] active:duration-75 hover:scale-[1.01] hover:cursor-pointer ease-in-out transition-all overflow-hidden"
              onMouseOver={() => setHovered(1)}
              onMouseLeave={() => setHovered(-1)}
            >
              <img
                src="/assets/other_images/play-image.jpeg"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="relative z-10 text-white text-[2.5rem] tracking-wide font-bold transition-all duration-300 ease-in-out group-hover:text-[2.75rem]"
                style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.9)' }}
              >
                Play
              </div>
              <div className={`absolute inset-0 ${hovered !== 1 && 'bg-black/20'} z-0`} />
            </div>
            <div
              className="group relative rounded-2xl p-4 bg-white shadow-md border w-[25%] h-full text-center flex flex-col justify-center items-center active:scale-[.98] active:duration-75 hover:scale-[1.01] hover:cursor-pointer ease-in-out transition-all overflow-hidden"
              onMouseOver={() => setHovered(2)}
              onMouseLeave={() => setHovered(-1)}
            >
              <img
                src="/assets/other_images/collection-image.jpeg"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div
                className="relative z-10 text-white text-[2.5rem] tracking-wide font-bold transition-all duration-300 ease-in-out group-hover:text-[2.75rem]"
                style={{ textShadow: '2px 2px 6px rgba(0, 0, 0, 0.9)' }}
              >
                Collection
              </div>
              <div className={`absolute inset-0 ${hovered !== 2 && 'bg-black/20'} z-0`} />
            </div>

          </div>
        </main>
      </div>
    );
  }

  return null;
};

export default Home;
