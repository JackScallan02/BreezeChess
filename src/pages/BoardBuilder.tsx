// pages/BoardBuilder.tsx

import React, { useState, useCallback } from 'react'; // Import useCallback
import useDarkMode from '../darkmode/useDarkMode';
import MainToolBar from '../components/MainToolBar';
import ChessBoard from '../components/ChessBoard';
import { useNavigation } from '../navigator/navigate';
import { Chess, Square } from 'chess.js';

const BoardBuilder = () => {
  const { handleNavigation } = useNavigation();
  const [game, setGame] = useState(new Chess());
  const [isBoardReady, setIsBoardReady] = useState(false); // New state for board readiness

  useDarkMode();

  const handleMove = useCallback((from: Square, to: Square, promotion?: 'q' | 'r' | 'b' | 'n') => {
          // TODO: Currently not working
          const tempGame = new Chess(game.fen());
  
          let moveResult;
          const moveOptions: { from: Square; to: Square; promotion?: 'q' | 'r' | 'b' | 'n' } = { from, to };
          if (promotion) {
              moveOptions.promotion = promotion;
          }
  
          try {
              moveResult = tempGame.move(moveOptions);
          } catch (e) {
              // Catch errors for illegal moves
              moveResult = null;
          }
  
          if (moveResult === null) {
              // If the move is illegal, do nothing
              return;
          }
  
          // Construct the user's move string, including promotion if it occurred
          let userMoveFullAlgebraic = `${from}${to}`;
          if (promotion) {
              userMoveFullAlgebraic += promotion;
          }
  
      }, [game]);

  // Callback function to be passed to ChessBoard
  const handleBoardReady = useCallback((ready: boolean) => {
    setIsBoardReady(ready);
  }, []); // Empty dependency array as it doesn't depend on any props/states inside BoardBuilder

  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden">
      <div className="h-16 shrink-0">
        <MainToolBar />
      </div>

      <main className="flex-1 w-full overflow-hidden">
        <ChessBoard
          showLabels
          game={game}
          onBoardReady={handleBoardReady} // Pass the callback
          onMoveAttempt={handleMove}
        />
        {/* Conditionally render this div based on isBoardReady */}
        {isBoardReady && (
          <div className="text-center text-gray-700 dark:text-gray-300">
            <span className="font-bold">{game.turn() === 'w' ? 'White' : 'Black'}</span> to move
          </div>
        )}
      </main>
    </div>
  );
};

export default BoardBuilder;