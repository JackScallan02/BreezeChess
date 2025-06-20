import React, { useEffect, useState, useCallback, useRef } from 'react';
import { Chess, Square } from 'chess.js';
import { Lightbulb, RotateCcw, ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import ChessBoard, { ChessBoardHandle } from '../components/ChessBoard';

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
    // New state to track the user's max progress
    const [maxReachedMoveIndex, setMaxReachedMoveIndex] = useState(0);
    const [puzzleStatus, setPuzzleStatus] = useState<"playing" | "correct" | "incorrect" | "solved">("playing");
    const [feedbackMessage, setFeedbackMessage] = useState<string>("");
    const [userColor, setUserColor] = useState<'w' | 'b' | null>(null);
    const [resetKey, setResetKey] = useState(0);
    const [incorrectSquare, setIncorrectSquare] = useState<Square | null>(null);
    const [isPlayerTurn, setIsPlayerTurn] = useState(false);
    const [showHighlights, setShowHighlights] = useState(true);
    const [hintSquare, setHintSquare] = useState<Square | null>(null);

    const timeoutIds = useRef<NodeJS.Timeout[]>([]);
    const chessboardRef = useRef<ChessBoardHandle>(null);

    useEffect(() => {
        timeoutIds.current.forEach(clearTimeout);
        timeoutIds.current = [];

        const initialGame = new Chess(puzzleSolution.fen);
        const moves = puzzleSolution.moves;
        const fenTurn = initialGame.turn();
        const userPlaysFirst = moves.length % 2 !== 0;
        const determinedUserColor = userPlaysFirst ? fenTurn : (fenTurn === 'w' ? 'b' : 'w');

        // Determine initial max progress
        const initialMaxReachedIndex = userPlaysFirst ? 0 : 1;
        setMaxReachedMoveIndex(initialMaxReachedIndex);

        setUserColor(determinedUserColor);
        setGame(new Chess(puzzleSolution.fen));
        setCurrentMoveIndex(0);
        setPuzzleStatus("playing");
        setFeedbackMessage("");
        setShowHighlights(true);
        setHintSquare(null);

        if (userPlaysFirst) {
            setIsPlayerTurn(true);
            setFeedbackMessage(`${determinedUserColor === 'w' ? 'White' : 'Black'} to move`);
        } else {
            setIsPlayerTurn(false);
            const initialOpponentMoveTimeout = setTimeout(() => {
                const gameAfterOpponentMove = new Chess(puzzleSolution.fen);
                const move = gameAfterOpponentMove.move(moves[0]);

                if (move) {
                    setShowHighlights(true);
                    setGame(gameAfterOpponentMove);
                    setIsPlayerTurn(true);
                    setCurrentMoveIndex(1);
                    setFeedbackMessage(`${determinedUserColor === 'w' ? 'White' : 'Black'} to move`);
                }
            }, 1000);
            timeoutIds.current.push(initialOpponentMoveTimeout);
        }

        return () => {
            timeoutIds.current.forEach(clearTimeout);
            timeoutIds.current = [];
        };
    }, [puzzleSolution, resetKey]);

    const resetPuzzle = useCallback(() => {
        timeoutIds.current.forEach(clearTimeout);
        timeoutIds.current = [];
        chessboardRef.current?.resetState();
        setResetKey(prevKey => prevKey + 1);
        setIncorrectSquare(null);
        setHintSquare(null);
    }, []);

    const nextPuzzle = useCallback(async () => {
        await fetchPuzzle();
        chessboardRef.current?.resetState();
        setIncorrectSquare(null);
        setHintSquare(null);
    }, [fetchPuzzle]);

    const handleGetHint = useCallback(() => {
        if (isPlayerTurn && puzzleStatus === "playing" && currentMoveIndex < puzzleSolution.moves.length) {
            const nextExpectedMove = puzzleSolution.moves[currentMoveIndex];
            const fromSquareForHint = nextExpectedMove.substring(0, 2) as Square;
            setHintSquare(fromSquareForHint);
        }
    }, [isPlayerTurn, puzzleStatus, currentMoveIndex, puzzleSolution.moves]);

    const handleMoveAttempt = useCallback((from: Square, to: Square, promotion?: 'q' | 'r' | 'b' | 'n') => {
        if (puzzleStatus !== "playing" || game.turn() !== userColor) {
            return;
        }

        setHintSquare(null);

        const expectedMove = puzzleSolution.moves[currentMoveIndex];
        const tempGame = new Chess(game.fen());
        const moveOptions = { from, to, promotion };

        let moveResult;
        try {
            moveResult = tempGame.move(moveOptions);
        } catch (e) { return; }

        if (moveResult === null) return;

        const userMoveFullAlgebraic = `${from}${to}${moveResult.promotion || ''}`;

        if (userMoveFullAlgebraic === expectedMove) {
            setShowHighlights(true);
            setGame(tempGame);
            const nextMoveIndex = currentMoveIndex + 1;
            setMaxReachedMoveIndex(prev => Math.max(prev, nextMoveIndex));

            if (nextMoveIndex >= puzzleSolution.moves.length) {
                setPuzzleStatus("solved");
                setFeedbackMessage("Puzzle solved!");
                // THIS IS THE FIX: Update currentMoveIndex to its final value
                setCurrentMoveIndex(nextMoveIndex);
                setMaxReachedMoveIndex(puzzleSolution.moves.length);
            } else {
                setPuzzleStatus("correct");
                setFeedbackMessage("Correct! Opponent is thinking...");
                setCurrentMoveIndex(nextMoveIndex);
                setIsPlayerTurn(false);

                const opponentMoveTimeout = setTimeout(() => {
                    const opponentGame = new Chess(tempGame.fen());
                    const opponentMove = opponentGame.move(puzzleSolution.moves[nextMoveIndex]);
                    if (opponentMove) {
                        setShowHighlights(true);
                        setGame(opponentGame);
                        setIsPlayerTurn(true);
                        const finalMoveIndex = nextMoveIndex + 1;
                        setCurrentMoveIndex(finalMoveIndex);
                        setMaxReachedMoveIndex(prev => Math.max(prev, finalMoveIndex));
                        setPuzzleStatus("playing");
                        setFeedbackMessage(`Your turn as ${userColor === 'w' ? 'White' : 'Black'}.`);
                    }
                }, 1000);
                timeoutIds.current.push(opponentMoveTimeout);
            }
        } else {
            const originalFen = game.fen();
            setGame(tempGame);
            setPuzzleStatus("incorrect");
            setIncorrectSquare(to);
            setFeedbackMessage("Incorrect move. Try again!");

            const incorrectMoveTimeout = setTimeout(() => {
                setGame(new Chess(originalFen));
                setIncorrectSquare(null);
                setPuzzleStatus("playing");
                setFeedbackMessage(`Your turn as ${userColor === 'w' ? 'White' : 'Black'}.`);
            }, 500);
            timeoutIds.current.push(incorrectMoveTimeout);
        }
    }, [game, currentMoveIndex, puzzleSolution, userColor, puzzleStatus]);

    const navigateMoves = useCallback((newIndex: number) => {
        if (newIndex < 0 || newIndex > maxReachedMoveIndex) return;

        const tempGame = new Chess(puzzleSolution.fen);
        for (let i = 0; i < newIndex; i++) {
            tempGame.move(puzzleSolution.moves[i]);
        }

        setGame(tempGame);
        setCurrentMoveIndex(newIndex);
        setPuzzleStatus(newIndex === puzzleSolution.moves.length ? "solved" : "playing");
        setIsPlayerTurn(tempGame.turn() === userColor);
        setShowHighlights(true);
        setFeedbackMessage(newIndex === maxReachedMoveIndex && newIndex === puzzleSolution.moves.length ? "Puzzle solved!" : `Your turn as ${userColor === 'w' ? 'White' : 'Black'}.`);
    }, [maxReachedMoveIndex, puzzleSolution, userColor]);

    const handleGoBack = () => navigateMoves(currentMoveIndex - 1);
    const handleGoForward = () => navigateMoves(currentMoveIndex + 1);

    return (
        <div className="flex flex-col items-center h-full w-full overflow-hidden">
            <h2 className="text-2xl font-bold mt-4 mb-2 text-slate-800 dark:text-white">
                {puzzleSolution.name || "Chess Puzzle"}
            </h2>
            <div className="flex flex-row justify-between w-full max-w-5xl items-start ml-12">
                <div className="w-full"></div>
                <div className="flex justify-center w-full">
                    <ChessBoard
                        ref={chessboardRef}
                        showLabels={showLabels}
                        game={game}
                        onMoveAttempt={handleMoveAttempt}
                        incorrectSquare={incorrectSquare}
                        isPlayerTurn={isPlayerTurn}
                        showLastMoveHighlight={showHighlights}
                        userColor={userColor}
                        hintSquare={hintSquare}
                        orientation={userColor || 'w'}
                    />
                </div>
                <div className="ml-12 mt-36 flex flex-col items-center">
                    <button
                        onClick={resetPuzzle}
                        className="cursor-pointer px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none transition-colors w-48"
                    >
                        <span className="flex items-center justify-center">
                            <RotateCcw className="mr-2" />
                            Reset Puzzle
                        </span>
                    </button>
                    <button
                        onClick={nextPuzzle}
                        className="mt-4 cursor-pointer px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none transition-colors w-48"
                    >
                        <span className="flex items-center justify-center">
                            <ArrowRight className="mr-2" />
                            Next Puzzle
                        </span>
                    </button>
                    <button
                        onClick={handleGetHint}
                        disabled={!isPlayerTurn || puzzleStatus !== "playing"}
                        className="mt-4 cursor-pointer px-6 py-3 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 bg-indigo-400 focus:outline-none transition-colors w-48 disabled:opacity-50 disabled:cursor-default"
                    >
                        <span className="flex items-center justify-center">
                            <Lightbulb className="mr-2" />
                            Get a Hint
                        </span>
                    </button>
                    <p
                        className={`pt-8 text-lg font-semibold text-center h-12 ${puzzleStatus === "correct" ? "text-green-600 dark:text-green-400"
                            : puzzleStatus === "incorrect" ? "text-red-600 dark:text-red-400"
                                : puzzleStatus === "solved" ? "text-purple-600 dark:text-purple-400"
                                    : "text-gray-700 dark:text-slate-200"
                            }`}
                    >
                        {feedbackMessage}
                    </p>
                    {/* Navigation Buttons */}
                    <div className="flex items-center justify-center mt-8">
                        <button
                            onClick={handleGoBack}
                            // Only disable if at the very beginning of the puzzle
                            disabled={currentMoveIndex === 0}
                            className="p-2 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:hover:bg-slate-200 dark:disabled:hover:bg-slate-700 disabled:opacity-40 cursor-pointer disabled:cursor-default transition-colors"
                            aria-label="Previous move"
                        >
                            <ChevronLeft className="h-6 w-6 text-slate-800 dark:text-slate-200" />
                        </button>
                        <button
                            onClick={handleGoForward}
                            // Only disable if the user is at the last move they've seen or successfully played
                            disabled={currentMoveIndex >= maxReachedMoveIndex}
                            className="p-2 ml-4 rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:hover:bg-slate-200 dark:disabled:hover:bg-slate-700 disabled:opacity-40 cursor-pointer disabled:cursor-default transition-colors"
                            aria-label="Next move"
                        >
                            <ChevronRight className="h-6 w-6 text-slate-800 dark:text-slate-200" />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PuzzleBoard;