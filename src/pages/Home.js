import { React } from 'react';
import MainToolBar from '../components/MainToolBar';

const Home = () => {
    
  return (
    <>
      <MainToolBar />
      <div className="z-0 w-1/2 mx-auto relative top-20 ">
        <p className="text-slate-900 font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center">
          Boost your chess rating fast, all in one place.
        </p>
      </div>
    </>
  );
}

export default Home;
