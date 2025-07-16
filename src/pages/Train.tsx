import React from 'react';
import useDarkMode from '../darkmode/useDarkMode';
import MainToolBar from '../components/MainToolBar';
import { useNavigation } from '../navigator/navigate';
import { Swords, Wrench } from 'lucide-react';

const Train = () => {

    const { handleNavigation } = useNavigation();

    useDarkMode();

    return (
        <div className="flex flex-col min-h-screen w-full h-full">
            <MainToolBar />
            <main className="w-full h-full">
                <div className="flex flex-row w-full justify-center mt-8">
                    <p className="dark:text-white text-4xl font-bold">Choose a training method</p>
                </div>
                <div className="flex flex-row w-full justify-center mt-8">
                    <p className="dark:text-white text-xl">Earn points and collect chess pieces by selecting the Puzzle Trainer!</p>
                </div>
                <br />
                <div className="flex md:flex-row flex-col w-full items-start justify-center mt-8 gap-x-8 gap-y-4">
                    <button
                        className="text-xl bg-indigo-500 text-white font-bold py-4 px-8 rounded cursor-pointer hover:bg-indigo-600 transition duration-200 ease-in-out transform hover:scale-105"
                        onClick={() => handleNavigation('/train/board-builder')}
                    >
                        <div className="flex flex-row gap-x-2 items-center stroke-10">
                            <Wrench className="w-6 h-6" />
                            Board Builder
                        </div>
                    </button>
                    <button
                        className="text-xl bg-indigo-500 text-white font-bold py-4 px-8 rounded cursor-pointer hover:bg-indigo-600 transition duration-200 ease-in-out transform hover:scale-105"
                        onClick={() => handleNavigation('/train/puzzle')}
                    >
                        <div className="flex flex-row gap-x-2 items-center stroke-10">
                            <Swords className="w-6 h-6" />
                            Puzzle Trainer
                        </div>
                    </button>
                </div>
            </main>
        </div>
    );
};

export default Train;
