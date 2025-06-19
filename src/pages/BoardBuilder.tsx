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
      <div className="h-16 shrink-0">
        <MainToolBar />
      </div>

      <main className="flex-1 flex flex-col justify-center items-center p-4">

        {/* New horizontal container for the board and side-button.
          - flex-row: Aligns children (board and button) side-by-side.
          - items-center: Vertically aligns the board and button to their center.
        */}
        <div className="flex flex-row items-center ml-46"> {/*Left margin of right div plus width*/}

          <ChessBoard
            showLabels
            game={game}
            onMoveAttempt={handleMoveAttempt}
            isPlayerTurn={true}
            userColor={'w'}
            canMoveAnyPiece={true}
            orientation={boardOrientation}
          />

          {/* Container for the button, positioned to the right of the board. */}
          <div className="ml-16">
            <button
              onClick={handleFlipBoard}
              className="w-30 cursor-pointer px-4 py-2 bg-gray-200 dark:bg-gray-700 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 shadow-md"
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