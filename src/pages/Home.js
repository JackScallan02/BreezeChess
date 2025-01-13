import { React } from 'react';
import MainToolBar from '../components/MainToolBar';
import ChessBoard from '../components/ChessBoard';

const Home = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <MainToolBar />
      <main className="flex flex-col flex-grow">
        <div className="z-0 w-1/2 mx-auto flex-grow flex flex-col items-center pt-20">
          <p className="text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center">
            Boost your chess rating fast, all in one place.
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
