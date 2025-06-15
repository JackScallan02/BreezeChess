import React, { useState, useCallback, useEffect } from 'react'; // Import useEffect
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

  // Function to be called when a move is attempted
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
          // If the move is illegal, just return.
          console.error("Illegal move in BoardBuilder:", e);
          moveResult = null;
      }

      if (moveResult === null) {
          // If the move is illegal, do nothing
          return;
      }

      // Update the game state with the valid move
      setGame(tempGame);

  }, [game]); // Depend on 'game' state to get the latest board for validation

  // Effect to set board ready after initial render (approximate)
  useEffect(() => {
    setIsBoardReady(true);
  }, []);

  return (
    <div className="flex flex-col min-h-screen w-full overflow-hidden">
      <div className="h-16 shrink-0">
        <MainToolBar />
      </div>

      <main className="flex-1 w-full overflow-hidden">
        <ChessBoard
          showLabels
          game={game}
          onMoveAttempt={handleMoveAttempt} // Renamed for clarity
          isPlayerTurn={true} // In BoardBuilder, the user always "has the turn" to manipulate pieces
          userColor={'w'} // For BoardBuilder, userColor can be arbitrary as canMoveAnyPiece handles control
          canMoveAnyPiece={true}  // NEW PROP: Signal to ChessBoard that any piece can be moved
        />
        {/* Conditionally render this div based on isBoardReady */}
        {isBoardReady && (
          <div className="text-center text-gray-700 dark:text-gray-300">
            {game.isCheckmate() ? (
              <span className="font-bold">{game.turn() === 'w' ? 'Black wins by checkmate' : 'White wins by checkmate'}</span>
            ): (
              <span className="font-bold">{game.turn() === 'w' ? 'White to move' : 'Black to move'}</span>
            )}
          </div>
        )}
      </main>
    </div>
  );
};

export default BoardBuilder;