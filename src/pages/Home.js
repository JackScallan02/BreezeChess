import { React } from 'react';
import MainToolBar from '../components/MainToolBar';
import ChessBoard from '../components/ChessBoard';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <MainToolBar />
      <main>
        <div className="z-0 lg:w-1/2 md:w-2/3 w-full mx-auto flex-grow flex flex-col items-center pt-20">
          <p className="text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center">
            Redefining the World of Chess
          </p>
        </div>
        <div>
          <p className="text-slate-900 lg:text-2xl tracking-tight text-center m-12 lg:leading-[2] text-[2.5vh] leading-[2]">
            Experience chess like never before with BreezeChess—with advanced training tools, captivating visuals, and an engaging global community come together to elevate your skills, make every move more meaningful. From opening theory to endgame mastery, unleash your inner strategist and enjoy a dynamic, immersive chess environment.
          </p>
        </div>
        <div className="flex justify-center h-full mt-10">
          {/* <ChessBoard /> */}
        </div>
      </main>
    </div>
  );
};




export default Home;
