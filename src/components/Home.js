import { React } from 'react';
import MainToolBar from './MainToolBar';

const Home = () => {
    
  return (
    <>
      <div className="w-full h-full absolute bg-gradient-to-r from-sky-50 to-sky-100">
        <MainToolBar />
        <div className="z-0 w-1/2 mx-auto relative top-20 ">
          <p className="text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center">
            Boost your chess rating fast, all in one place.
          </p>
        </div>
      </div>
    </>
  );
}

export default Home;
