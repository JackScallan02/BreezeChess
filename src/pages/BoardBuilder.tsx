import React, { useState, useCallback, useEffect } from 'react';
import useDarkMode from '../darkmode/useDarkMode';
import MainToolBar from '../components/MainToolBar';
import ChessBoard from '../components/ChessBoard';
import { useNavigation } from '../navigator/navigate';
import { Chess, Square } from 'chess.js';

const BoardBuilder = () => {
  const { handleNavigation } = useNavigation();
  const [game, setGame] = useState(new Chess());
  const [isBoardReady, setIsBoardReady] = useState(false);
  const [boardOrientation, setBoardOrientation] = useState<'w' | 'b'>('w');

  useDarkMode();

  const handleMoveAttempt = useCallback((from: Square, to: Square, promotion?: 'q' | 'r' | 'b' | 'n') => {
    const tempGame = new Chess(game.fen());
    const moveOptions: { from: Square; to: Square; promotion?: 'q' | 'r' | 'b' | 'n' } = { from, to };
    if (promotion) {
      moveOptions.promotion = promotion;
    }

    let moveResult;
    try {
      moveResult = tempGame.move(moveOptions);
    } catch (e) {
      console.error("Illegal move in BoardBuilder:", e);
      moveResult = null;
    }

    if (moveResult === null) {
      return;
    }
    setGame(tempGame);

  }, [game]);

  useEffect(() => {
    setIsBoardReady(true);
  }, []);

  const handleFlipBoard = () => {
    setBoardOrientation(prev => (prev === 'w' ? 'b' : 'w'));
  };

  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden bg-slate-50 dark:bg-slate-900">
      <div className="h-16 shrink-0"> {/* This is 4rem */}
        <MainToolBar />
      </div>

      <main className="flex-1 flex flex-col justify-center items-center p-4">
        {/* Main layout container: Stays as a flex row on large screens */}
        <div className="w-full max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 lg:gap-6 justify-center items-center">
          
          {/* CHANGE: Board container now uses flex-1 again to claim space */}
          <div className="w-full lg:flex-1 flex justify-center items-center">
            {/* NEW: Wrapper div that enforces aspect ratio and size constraints */}
            <div 
              className="w-full aspect-square" 
              // This is the key: The board's max width is tied to the viewport height.
              // 4rem for the toolbar, 2rem for p-4 (top/bottom), 2rem for safety.
              style={{ maxWidth: 'calc(100vh - 8rem)' }}
            >
              <ChessBoard
                showLabels
                game={game}
                onMoveAttempt={handleMoveAttempt}
                isPlayerTurn={true}
                userColor={'w'}
                canMoveAnyPiece={true}
                orientation={boardOrientation}
              />
            </div>
          </div>

          {/* Sidebar for controls remains the same */}
          <div className="w-full lg:w-80 flex-shrink-0 flex flex-col items-center justify-center">
            <button
              onClick={handleFlipBoard}
className="cursor-pointer px-6 py-2 sm:px-5 sm:py-2 text-base sm:text-sm bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors mb-2"
            >
              Flip Board
            </button>
            <div className="mt-4">
              {isBoardReady && (
                <div className="text-center text-gray-700 dark:text-gray-300">
                  {game.isCheckmate() ? (
                    <span className="font-bold">{game.turn() === 'w' ? 'Black wins by checkmate' : 'White wins by checkmate'}</span>
                  ) : (
                    <span className="font-bold">{game.turn() === 'w' ? 'White to move' : 'Black to move'}</span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BoardBuilder;