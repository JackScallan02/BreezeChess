import React from 'react';
import useDarkMode from '../darkmode/useDarkMode';
import MainToolBar from '../components/MainToolBar';

const Train = () => {

    useDarkMode();

    return (
        <div className="flex flex-col min-h-screen w-full h-full">
            <MainToolBar />
            <main className="w-full h-full">
                <div className="flex flex-row w-full justify-center mt-8">
                    <p className="dark:text-white text-[3rem] font-bold">Choose a training method</p>  
                </div>
            </main>
        </div>
  );
};

export default Train;
