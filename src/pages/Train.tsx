import React from 'react';
import useDarkMode from '../darkmode/useDarkMode';
import MainToolBar from '../components/MainToolBar';
import { useNavigation } from '../navigator/navigate';

const Train = () => {

    const { handleNavigation } = useNavigation();

    useDarkMode();

    return (
        <div className="flex flex-col min-h-screen w-full h-full">
            <MainToolBar />
            <main className="w-full h-full">
                <div className="flex flex-row w-full justify-center mt-8">
                    <p className="dark:text-white text-[3rem] font-bold">Choose a training method</p>
                </div>
                <br />
                <div className="flex flex-row w-full justify-center mt-8">
                    <button
                        className="ml-4 bg-indigo-500 text-white font-bold py-2 px-4 rounded cursor-pointer hover:bg-indigo-600 transition duration-200 ease-in-out transform hover:scale-105"
                        onClick={() => handleNavigation('/train/board-builder')}
                    >
                        Board Builder
                    </button>
                    <button
                        className="ml-4 bg-indigo-500 text-white font-bold py-2 px-4 rounded cursor-pointer hover:bg-indigo-600 transition duration-200 ease-in-out transform hover:scale-105"
                        onClick={() => handleNavigation('/train/puzzle')}
                    >
                        Puzzle Trainer
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Train;
