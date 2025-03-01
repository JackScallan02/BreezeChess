import { React } from 'react';
import MainToolBar from '../components/MainToolBar';
import LoadingScreen from './Loading';
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";

const FrontPage = () => {
  const {user, loading} = useAuth();
  const navigate = useNavigate();

  if (loading) return <LoadingScreen />

  if (user) navigate('/home');

  if (!user && !loading) return (
    <div className="flex flex-col min-h-screen">
      <MainToolBar />
      <main>
        <div className="flex flex-col">
          <div className="">
            <div className="z-0 lg:w-1/2 md:w-2/3 w-full mx-auto flex-grow flex flex-col items-center pt-20">
              <p className="text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center">
                Redefining the World of Chess
              </p>
            </div>
            <div className="flex justify-center">
              <p className="text-slate-900 lg:text-2xl tracking-tight text-center m-12 lg:leading-[2] text-[2.5vh] leading-[2] w-[90%] md:w-[70%]">
                Experience chess like never before with BreezeChess—with advanced training tools, captivating visuals, and an engaging global community, give each move a greater purpose.
              </p>
            </div>
          </div>
          <div className="flex justify-center h-full mt-10 border border-gray-300">
            <div className="bg-sky-200 w-full">
              <div className="z-0 lg:w-1/2 md:w-2/3 w-full mx-auto flex-grow flex flex-col items-center pt-8">
                <p className="text-slate-900 font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-center">
                  Participate in a thoughtfully crafted chess world
                </p>
              </div>
              <div className="flex flex-row justify-center">
                <p className="text-slate-900 lg:text-2xl tracking-tight text-center m-12 lg:leading-[2] text-[2.5vh] leading-[2] w-[90%] md:w-[50%]">
                  Make every move more engaging and meaningful. Customize board themes, unlock new skins and animations, and earn rewards- simply by playing chess.
                </p>  
              </div>
            </div>
          </div>
          <div className="flex justify-center h-full border border-gray-300">
            <div className="w-full">
              <div className="z-0 lg:w-1/2 md:w-2/3 w-full mx-auto flex-grow flex flex-col items-center pt-8">
                <p className="text-slate-900 font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-center">
                  Elevate your skills
                </p>
              </div>
              <div className="flex flex-row justify-center">
                <p className="text-slate-900 lg:text-2xl tracking-tight text-center m-12 lg:leading-[2] text-[2.5vh] leading-[2] w-[90%] md:w-[50%]">
                   Cutting-edge tools for practicing chess: from opening theory, checkmate practicing, tactic building, all the way to endgame perfection.
                </p>  
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};




export default FrontPage;
