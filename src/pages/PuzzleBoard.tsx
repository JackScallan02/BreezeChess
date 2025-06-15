import React, { useEffect, useState, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import ChessBoard from '../components/ChessBoard';

// PuzzleBoard Component
interface PuzzleBoardProps {
    puzzleSolution: {
        fen: string;
        moves: string[];
        name?: string;
        fetchPuzzle: () => void;
    };
    showLabels?: boolean;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ puzzleSolution, fetchPuzzle, showLabels = true }) => {
    const [game, setGame] = useState(new Chess(puzzleSolution.fen));
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [puzzleStatus, setPuzzleStatus] = useState<"playing" | "correct" | "incorrect" | "solved">("playing");
    const [feedbackMessage, setFeedbackMessage] = useState<string>("");
    const [userColor, setUserColor] = useState<'w' | 'b' | null>(null);
    const [resetKey, setResetKey] = useState(0);
    const [incorrectSquare, setIncorrectSquare] = useState<Square | null>(null);
    const [isPlayerTurn, setIsPlayerTurn] = useState(false);
    const [showHighlights, setShowHighlights] = useState(true);

    useEffect(() => {
        const initialGame = new Chess(puzzleSolution.fen);
        const moves = puzzleSolution.moves;
        const totalMoves = moves.length;
        const fenTurn = initialGame.turn();
        const userPlaysFirst = totalMoves % 2 !== 0;
        const determinedUserColor = userPlaysFirst ? fenTurn : (fenTurn === 'w' ? 'b' : 'w');
        
        setUserColor(determinedUserColor);
        setGame(new Chess(puzzleSolution.fen));
        setCurrentMoveIndex(0);
        setPuzzleStatus("playing");
        setFeedbackMessage("");
        setShowHighlights(true);

        if (userPlaysFirst) {
            setIsPlayerTurn(true);
            setFeedbackMessage(`${determinedUserColor === 'w' ? 'White' : 'Black'} to move`);
        } else {
            setIsPlayerTurn(false);
            setTimeout(() => {
                const opponentMove = moves[0];
                const gameAfterOpponentMove = new Chess(puzzleSolution.fen);
                const from = opponentMove.substring(0, 2) as Square;
                const to = opponentMove.substring(2, 4) as Square;
                let moveOptions: { from: Square; to: Square; promotion?: string } = { from, to };
                if (opponentMove.length === 5) moveOptions.promotion = opponentMove.substring(4);

                if (gameAfterOpponentMove.move(moveOptions)) {
                    setShowHighlights(true);
                    setGame(gameAfterOpponentMove);
                    setIsPlayerTurn(true);
                    setCurrentMoveIndex(1);
                    setFeedbackMessage(`${determinedUserColor === 'w' ? 'White' : 'Black'} to move`);
                }
            }, 1000);
        }
    }, [puzzleSolution, resetKey]);

    const resetPuzzle = () => {
        setResetKey(prevKey => prevKey + 1);
        setIncorrectSquare(null);
    };

    const nextPuzzle = async () => {
        await fetchPuzzle();
        setIncorrectSquare(null);
    };

    const handleMoveAttempt = useCallback((from: Square, to: Square, promotion?: 'q' | 'r' | 'b' | 'n') => {
        if (puzzleStatus !== "playing" || game.turn() !== userColor) {
            return;
        }

        const expectedMove = puzzleSolution.moves[currentMoveIndex];
        const tempGame = new Chess(game.fen()); // Create a temporary game instance for move validation
        const moveOptions = { from, to, promotion };

        let moveResult;
        try {
            moveResult = tempGame.move(moveOptions);
        } catch (e) {
            // If the move is illegal (e.g., trying to move an empty square), just return.
            // The Chess.js library handles illegal moves by returning null or throwing an error.
            // We only care about legally invalid moves here.
            return; 
        }
        
        if (moveResult === null) {
            // This means the move was illegal as per Chess.js rules, e.g., King in check, invalid piece movement
            return;
        }

        const userMoveFullAlgebraic = `${from}${to}${moveResult.promotion || ''}`;

        if (userMoveFullAlgebraic === expectedMove) {
            // Correct move logic
            setShowHighlights(true);
            setGame(tempGame); // Update game state with the correct move
            const nextMoveIndex = currentMoveIndex + 1;

            if (nextMoveIndex >= puzzleSolution.moves.length) {
                setPuzzleStatus("solved");
                setFeedbackMessage("Puzzle Solved!");
            } else {
                setPuzzleStatus("correct");
                setFeedbackMessage("Correct! Opponent is thinking...");
                setCurrentMoveIndex(nextMoveIndex);
                setIsPlayerTurn(false);

                setTimeout(() => {
                    const opponentMoveStr = puzzleSolution.moves[nextMoveIndex];
                    const opponentGame = new Chess(tempGame.fen()); // Create new game instance from user's correct move
                    const oppFrom = opponentMoveStr.substring(0, 2) as Square;
                    const oppTo = opponentMoveStr.substring(2, 4) as Square;
                    const oppPromotion = opponentMoveStr.length === 5 ? opponentMoveStr.substring(4, 5) as 'q' | 'r' | 'b' | 'n' : undefined;
                    
                    if (opponentGame.move({ from: oppFrom, to: oppTo, promotion: oppPromotion })) {
                        setShowHighlights(true);
                        setGame(opponentGame);
                        setIsPlayerTurn(true);
                        setCurrentMoveIndex(nextMoveIndex + 1);
                        setPuzzleStatus("playing");
                        setFeedbackMessage(`Your turn as ${userColor === 'w' ? 'White' : 'Black'}.`);
                    }
                }, 700);
            }
        } else {
            // Incorrect (but legal) move logic.
            // Update the game state with the incorrect move temporarily
            const originalFen = game.fen(); // Store the original FEN to revert later
            setGame(tempGame); // Show the incorrect move on the board
            setPuzzleStatus("incorrect");
            setIncorrectSquare(to);
            setFeedbackMessage("Incorrect move. Try again!");

            setTimeout(() => {
                setGame(new Chess(originalFen)); // Revert the game state to before the incorrect move
                setIncorrectSquare(null);
                setPuzzleStatus("playing");
                setFeedbackMessage(`Your turn as ${userColor === 'w' ? 'White' : 'Black'}.`); // Reset feedback message
            }, 500);
        }
    }, [game, currentMoveIndex, puzzleSolution, userColor, puzzleStatus]);

    return (
        <div className="flex flex-col items-center h-full w-full overflow-hidden">
            <h2 className="text-2xl font-bold mt-4 mb-2 text-slate-800 dark:text-white">
                {puzzleSolution.name || "Chess Puzzle"}
            </h2>
            <div className="flex flex-row justify-between w-full max-w-5xl items-start ml-12">
                <div className="w-full"></div>
                <div className="flex justify-center w-full">
                    <ChessBoard
                        showLabels={showLabels}
                        game={game}
                        onMoveAttempt={handleMoveAttempt}
                        incorrectSquare={incorrectSquare}
                        isPlayerTurn={isPlayerTurn}
                        showLastMoveHighlight={showHighlights}
                    />
                </div>
                <div className="ml-12 mt-36 flex flex-col items-center">
                    <button
                        onClick={resetPuzzle}
                        className="cursor-pointer px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors w-42"
                    >
                        Reset Puzzle
                    </button>
                    <button
                        onClick={nextPuzzle}
                        className="mt-4 cursor-pointer px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus://www.google.com/search?q=puzzle+chess+next+puzzle+button+style&sca_esv=fb408e001dfa158b&bih=927&biw=1920&hl=en&sxsrf=ADLYWIL2t1i2J8p1l1N43XJ1X6eP4L9dFQ%3A1718314816999&ei=0399ZtH7M_W9ptQP7d602AQ&oq=puzzle+chess+next+puzzle+button+style&gs_lp=Egxnd3Mtd2l6LXNlcnAiInB1enpsZSBjaGVzcyBuZXh0IHB1enpsZSBidXR0b24gc3R5bGUyBRAhGKABMgUQIRigAUjJgAFY6QJgAXgAkAEAmAFpoAGlCKoBAzMuNogBA8gBApABAw&sclient=gws-wiz-serp&ved=0ahUKEwiw0L2MxeGGAxX1plYDHW1vDUoQ4dUDCBA&uact=5ring-blue-500 focus:ring-offset-2 transition-colors w-42"
                    >
                        Next Puzzle
                    </button>
                    <p
                        className={`pt-8 text-lg font-semibold text-center ${
                            puzzleStatus === "correct" ? "text-green-600 dark:text-green-400"
                            : puzzleStatus === "incorrect" ? "text-red-600 dark:text-red-400"
                            : puzzleStatus === "solved" ? "text-purple-600 dark:text-purple-400"
                            : "text-gray-700 dark:text-slate-200"
                        }`}
                    >
                        {feedbackMessage}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PuzzleBoard;