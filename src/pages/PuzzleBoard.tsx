/**
 * PuzzleBoard Component
 * This component wraps the ChessBoard and manages the state for a chess puzzle,
 * ensuring the user always plays the final move in the sequence.
 */
import React, { useEffect, useState, useCallback } from 'react';
import { Chess, Square } from 'chess.js';
import ChessBoard from '../components/ChessBoard';


// PuzzleBoard Component
interface PuzzleBoardProps {
    puzzleSolution: {
        fen: string;
        moves: string[];
        name?: string;
        description?: string;
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
    const [resetKey, setResetKey] = useState(0); // Key to force re-initialization on reset
    const [incorrectSquare, setIncorrectSquare] = useState<Square | null>(null);
    const [isPlayerTurn, setIsPlayerTurn] = useState(false);

    useEffect(() => {
        const initialGame = new Chess(puzzleSolution.fen);
        const moves = puzzleSolution.moves;
        const totalMoves = moves.length;
        const fenTurn = initialGame.turn();
        const userPlaysFirst = totalMoves % 2 !== 0;
        const determinedUserColor = userPlaysFirst ? fenTurn : (fenTurn === 'w' ? 'b' : 'w');
        setUserColor(determinedUserColor);

        // Reset game and status
        setGame(new Chess(puzzleSolution.fen));
        setCurrentMoveIndex(0);
        setPuzzleStatus("playing");
        setFeedbackMessage("");

        if (userPlaysFirst) {
            // USER STARTS: The board is ready as is.
            setGame(initialGame); // Set the game to the initial FEN
            setCurrentMoveIndex(0); // User makes the 0th move
            setFeedbackMessage(`${determinedUserColor === 'w' ? 'White' : 'Black'} to move`);
        } else {
            // OPPONENT STARTS: We must play the first move for them automatically.
            setFeedbackMessage("");
            // Use a timeout to make the opponent's move feel more natural.
            setTimeout(() => {
                const opponentMove = moves[0];
                const gameAfterOpponentMove = new Chess(puzzleSolution.fen);

                let moveOptions: { from: Square; to: Square; promotion?: 'q' | 'r' | 'b' | 'n' };
                // Extract from and to squares from the opponentMove string (e.g., "e2e4" or "e7e8q")
                const from = opponentMove.substring(0, 2) as Square;
                const to = opponentMove.substring(2, 4) as Square;
                moveOptions = { from, to };

                if (opponentMove.length === 5) {
                    moveOptions.promotion = opponentMove.substring(4, 5) as 'q' | 'r' | 'b' | 'n';
                }

                try {
                    const moveResult = gameAfterOpponentMove.move(moveOptions);

                    if (moveResult) {
                        setGame(gameAfterOpponentMove);
                        setIsPlayerTurn(true);
                        setCurrentMoveIndex(1); // Next move is user's (at index 1)
                        setFeedbackMessage(`${determinedUserColor === 'w' ? 'White' : 'Black'} to move`);
                    } else {
                        console.error("Puzzle Data Error: The opponent's first move is illegal.", opponentMove);
                        setPuzzleStatus("incorrect");
                        setFeedbackMessage("Error in puzzle data. Please reset.");
                    }
                } catch (e) {
                    console.error("Error making opponent's first move:", e);
                    setPuzzleStatus("incorrect");
                    setFeedbackMessage("An error occurred with the puzzle data.");
                }
            }, 1000); // 1 second delay for opponent's first move
        }
    }, [puzzleSolution, resetKey]); // Reruns when puzzle changes or is reset

    /**
     * Resets the puzzle to its initial state by incrementing the resetKey.
     */
    const resetPuzzle = () => {
        setResetKey(prevKey => prevKey + 1);
        setIncorrectSquare(null);
    };

    const nextPuzzle = async () => {
        await fetchPuzzle();
        setIncorrectSquare(null);
    }

    /**
     * Handles an attempted move by the user.
     */
    const handleMoveAttempt = useCallback((from: Square, to: Square, promotion?: 'q' | 'r' | 'b' | 'n') => {
        // Only allow moves if the puzzle is "playing" and it's the user's turn
        if (puzzleStatus !== "playing" || game.turn() !== userColor) {
            return;
        }

        const expectedMove = puzzleSolution.moves[currentMoveIndex];
        // Create a temporary game instance to validate the user's move
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

        // Check if the user's move matches the expected move from the puzzle solution
        if (userMoveFullAlgebraic === expectedMove) { // Direct comparison now that both include promotion if applicable
            // If the user's move is correct, update the game state
            const gameAfterUserMove = new Chess(tempGame.fen());
            setGame(gameAfterUserMove);
            const nextMoveIndex = currentMoveIndex + 1;

            // Check if the puzzle is solved
            if (nextMoveIndex >= puzzleSolution.moves.length) {
                setPuzzleStatus("solved");
                setFeedbackMessage("Puzzle Solved!");
            } else {
                // Puzzle is not yet solved, prepare for opponent's reply
                setPuzzleStatus("correct");
                setFeedbackMessage("Correct! Opponent is thinking...");
                setCurrentMoveIndex(nextMoveIndex);

                // Simulate opponent's reply after a short delay
                setTimeout(() => {
                    const opponentMoveStr = puzzleSolution.moves[nextMoveIndex];
                    const opponentGame = new Chess(gameAfterUserMove.fen());

                    let opponentMoveOptions: { from: Square; to: Square; promotion?: 'q' | 'r' | 'b' | 'n' };
                    const oppFrom = opponentMoveStr.substring(0, 2) as Square;
                    const oppTo = opponentMoveStr.substring(2, 4) as Square;
                    opponentMoveOptions = { from: oppFrom, to: oppTo };

                    if (opponentMoveStr.length === 5) {
                        opponentMoveOptions.promotion = opponentMoveStr.substring(4, 5) as 'q' | 'r' | 'b' | 'n';
                    }

                    try {
                        const opponentMoveResult = opponentGame.move(opponentMoveOptions);
                        if (opponentMoveResult) {
                            setGame(opponentGame);
                            setIsPlayerTurn(true);
                            setCurrentMoveIndex(nextMoveIndex + 1);
                            setPuzzleStatus("playing");
                            setFeedbackMessage(`Your turn as ${userColor === 'w' ? 'White' : 'Black'}.`);
                        } else {
                            // This should ideally not happen with valid puzzle data
                            console.error("Puzzle data error: Opponent's reply is illegal.", opponentMoveStr);
                            setPuzzleStatus("incorrect");
                            setFeedbackMessage("An error occurred with the puzzle data. Please reset.");
                        }
                    } catch (e) {
                        console.error("Error making opponent's move:", e);
                        setPuzzleStatus("incorrect");
                        setFeedbackMessage("An error occurred with the puzzle data.");
                    }
                }, 700); // 700ms delay for subsequent opponent moves
            }
        } else {
            // If the user's move is incorrect
            setPuzzleStatus("incorrect");
            setIncorrectSquare(to); // ✅ Mark square as incorrect
            setGame(tempGame); // ✅ Show the move anyway
            setFeedbackMessage("Incorrect move. Try again!");

        }
    }, [game, currentMoveIndex, puzzleSolution, userColor, puzzleStatus]);

    return (
        <div className="flex flex-col items-center h-full w-full overflow-hidden">
            <h2 className="text-2xl font-bold mb-2 text-slate-800 dark:text-white">
                {puzzleSolution.name || "Chess Puzzle"}
            </h2>
            {puzzleSolution.description && (
                <p className="text-center text-slate-600 dark:text-white mb-4">
                    {puzzleSolution.description}
                </p>
            )}
            <div className="flex flex-row justify-between w-full max-w-5xl items-start ml-12">
                {/* Optional placeholder for future content */}
                <div className="w-full"></div>

                {/* Chess board in center */}
                <div className="flex justify-center w-full">
                    <ChessBoard
                        showLabels={showLabels}
                        game={game}
                        onMoveAttempt={handleMoveAttempt}
                        incorrectSquare={incorrectSquare}
                        isPlayerTurn={isPlayerTurn}
                    />
                </div>

                {/* Sidebar with button and feedback */}
                <div className="ml-12 mt-36 flex flex-col items-center">
                    <button
                        onClick={resetPuzzle}
                        className="cursor-pointer px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors w-42"
                    >
                        Reset Puzzle
                    </button>
                    <button
                        onClick={nextPuzzle}
                        className="mt-4 cursor-pointer px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors w-42"
                    >
                        Next Puzzle
                    </button>
                    <p
                        className={`pt-8 text-lg font-semibold text-center ${puzzleStatus === "correct"
                                ? "text-green-600 dark:text-green-400"
                                : puzzleStatus === "incorrect"
                                    ? "text-red-600 dark:text-red-400"
                                    : puzzleStatus === "solved"
                                        ? "text-purple-600 dark:text-purple-400"
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