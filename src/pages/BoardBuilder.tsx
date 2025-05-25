import React, { useState } from 'react';
import useDarkMode from '../darkmode/useDarkMode';
import MainToolBar from '../components/MainToolBar';
import ChessBoard from '../components/ChessBoard';
import { useNavigation } from '../navigator/navigate';
import { Chess } from 'chess.js';

const BoardBuilder = () => {

  const { handleNavigation } = useNavigation();
  const [game] = useState(new Chess());
  const [reRender, setRerender] = useState(false);


  useDarkMode();

  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden">
      <div className="h-16 shrink-0">
        <MainToolBar />
      </div>

      <main className="flex-1 w-full overflow-hidden">
        <ChessBoard
          showLabels
          game={game}
          setRerender={setRerender}
        />
        <div className="text-center text-gray-700 dark:text-gray-300">
          Current Turn: <span className="font-bold">{game.turn() === 'w' ? 'White' : 'Black'}</span>
        </div>
      </main>
    </div>


  );
};

export default BoardBuilder;
