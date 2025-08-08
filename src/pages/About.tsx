import React from 'react';
import MainToolBar from '../components/MainToolBar';
import LoadingScreen from './Loading';
import { useAuth } from "../contexts/AuthContext";

const About = () => {
  const { loading } = useAuth();

  if (loading) return <LoadingScreen />;

  return (
    <div className="flex flex-col min-h-screen">
      <MainToolBar />
      <main>
        <div className="flex flex-col">
          <div className="">
            <div className="z-0 lg:w-1/2 md:w-2/3 w-full mx-auto grow flex flex-col items-center pt-20">
              <p className="dark:text-white font-extrabold text-4xl sm:text-5xl lg:text-6xl tracking-tight text-center">
                Redefining the World of Chess
              </p>
            </div>
            <div className="flex justify-center">
              <p className="dark:text-white lg:text-2xl tracking-tight text-center m-8 lg:leading-[2] text-[2.5vh] leading-[2] w-[90%] md:w-[70%]">
                Experience chess like never before with BreezeChess—with captivating visuals, collectible pieces and boards, and an engaging global community, give each move a greater purpose.
              </p>
            </div>
          </div>
          <div className="flex justify-center h-full mt-10 border border-slate-600 dark:border-gray-800">
            <div className="bc-dark-bg-light w-full">
              <div className="z-0 lg:w-1/2 md:w-2/3 w-full mx-auto grow flex flex-col items-center pt-8">
                <p className=" dark:text-white font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-center">
                  Participate in a thoughtfully crafted chess world
                </p>
              </div>
              <div className="flex flex-row justify-center">
                <p className="dark:text-white lg:text-2xl tracking-tight text-center m-8 lg:leading-[2] text-[2.5vh] leading-[2] w-[90%] md:w-[50%]">
                  Say goodbye to rigid chess boards! With customizable themes, appealing animations, and dynamic soundscapes, every match is more engaging than before. Play with unique pieces and explore new environments that bring the beautiful game of chess to life.
                </p>  
              </div>
            </div>
          </div>
          <div className="flex justify-center h-full border border-slate-600 dark:border-gray-800">
            <div className="w-full">
              <div className="z-0 lg:w-1/2 md:w-2/3 w-full mx-auto grow flex flex-col items-center pt-8">
                <p className=" dark:text-white font-bold text-2xl sm:text-3xl lg:text-4xl tracking-tight text-center">
                  Elevate your skills
                </p>
              </div>
              <div className="flex flex-row justify-center">
                <p className="dark:text-white lg:text-2xl tracking-tight text-center m-8 lg:leading-[2] text-[2.5vh] leading-[2] w-[90%] md:w-[50%]">
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
  
  // if (!loading) return (
  //   <div className="flex flex-col min-h-screen">
  //     <MainToolBar />
  //     <main className="w-screen">
  //       <div className="flex flex-col mt-24">
  //         {/* Left-aligned section */}
  //         <div className="mb-12 relative lg:left-[10%] self-center lg:self-start">
  //           <p className="text-2xl lg:text-[2.5rem] dark:text-white font-extrabold tracking-tight whitespace-nowrap">
  //             Why BreezeChess?
  //           </p>
  //           <p className="mt-8 max-w-[500px] text-[1.25rem]">
  //             Step into a world where chess meets creativity. BreezeChess redefines training with advanced, result-driven tools that outshines other typical apps, and combines it with captivating visuals that make every move more engaging and meaningful. BreezeChess is the ultimate destination to sharpen your skills and achieve real results— all within an immersive chess environment.
  //           </p>
  //         </div>
  //         {/* Right-aligned section */}
  //         <div className="mb-12 relative lg:self-end self-center lg:mr-[10%]">
  //           <p className="text-2xl lg:text-[2.5rem] dark:text-white font-extrabold tracking-tight whitespace-nowrap">
  //             Unleash Your Inner Strategist
  //           </p>
  //           <p className="mt-8 max-w-[500px] text-[1.25rem]">
  //             Chess is more than just a game— it&apos;s a journey of learning and growth. That&apos;s why our app is thoughtfully crafted to elevate your skills like no other. BreezeChess includes a range of tools that will transcend your abilities - from opening theory, checkmate practicing, tactic building, all the way to endgame perfection.
  //           </p>
  //         </div>
  //         {/* Left-aligned section */}
  //         <div className="mb-12 relative lg:left-[10%] self-center lg:self-start">
  //           <p className="text-2xl lg:text-[2.5rem] dark:text-white font-extrabold tracking-tight whitespace-nowrap">
  //             A Visual Stimulation
  //           </p>
  //           <p className="mt-8 max-w-[500px] text-[1.25rem]">
  //           </p>
  //         </div>
  //         {/* Right-aligned section */}
  //         <div className="mb-12 relative lg:self-end self-center lg:mr-[10%]">
  //           <p className="text-2xl lg:text-[2.5rem] dark:text-white font-extrabold tracking-tight whitespace-nowrap">
  //             Join the Community
  //           </p>
  //           <p className="mt-8 max-w-[500px] text-[1.25rem]">
  //             Chess is better with friends! Connect with players from around the globe, participate in tournaments, and climb various leaderboards. Whether you’re competing or practicing, the BreezeChess community will make it all the more entertaining. Start practicing now, for free.
  //           </p>
  //         </div>
  //       </div>
  //     </main>



      
  //   </div>
  // );

export default About;
