import { React } from 'react';
import MainToolBar from '../components/MainToolBar';

const About = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <MainToolBar />
      <main className="w-screen">
        <div className="flex flex-col mt-24">
          {/* Left-aligned section */}
          <div className="mb-12 relative lg:left-[10%] self-center lg:self-start">
            <p className="text-2xl lg:text-[2.5rem] text-slate-900 dark:text-white font-extrabold tracking-tight whitespace-nowrap">
              Why BreezeChess?
            </p>
            <p className="mt-8 max-w-[500px] text-[1.25rem]">
              Step into a world where chess meets creativity. BreezeChess redefines training with advanced, result-driven tools that outshines other typical apps, and combines it with captivating visuals that make every move more engaging and meaningful. BreezeChess is the ultimate destination to sharpen your skills and achieve real results— all within an immersive chess environment.
            </p>
          </div>
          {/* Right-aligned section */}
          <div className="mb-12 relative lg:self-end self-center lg:mr-[10%]">
            <p className="text-2xl lg:text-[2.5rem] text-slate-900 dark:text-white font-extrabold tracking-tight whitespace-nowrap">
              Unleash Your Inner Strategist
            </p>
            <p className="mt-8 max-w-[500px] text-[1.25rem]">
              Chess is more than just a game— it's a journey of learning and growth. That's why our app is thoughtfully crafted to elevate your skills like no other. BreezeChess includes a range of tools that will transcend your abilities - from opening theory, checkmate practicing, tactic building, all the way to endgame perfection.
            </p>
          </div>
          {/* Left-aligned section */}
          <div className="mb-12 relative lg:left-[10%] self-center lg:self-start">
            <p className="text-2xl lg:text-[2.5rem] text-slate-900 dark:text-white font-extrabold tracking-tight whitespace-nowrap">
              A Visual Stimulation
            </p>
            <p className="mt-8 max-w-[500px] text-[1.25rem]">
              Say goodbye to lifeless chess boards! With customizable themes, appealing animations, and dynamic soundscapes, every match is more engaging than before. Play with unique pieces and explore new environments that bring the beautiful game of chess to life.
            </p>
          </div>
          {/* Right-aligned section */}
          <div className="mb-12 relative lg:self-end self-center lg:mr-[10%]">
            <p className="text-2xl lg:text-[2.5rem] text-slate-900 dark:text-white font-extrabold tracking-tight whitespace-nowrap">
              Join the Community
            </p>
            <p className="mt-8 max-w-[500px] text-[1.25rem]">
              Chess is better with friends! Connect with players from around the globe, participate in tournaments, and climb various leaderboards. Whether you’re competing or practicing, the BreezeChess community will make it all the more entertaining. Start practicing now, for free.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
};




export default About;
