import React, { useEffect, useState, useCallback, useRef, useLayoutEffect, use } from 'react';
import { Chess, Square, Move } from 'chess.js';
import { ChevronLeft, ChevronRight, Lightbulb } from 'lucide-react';
import ChessBoard, { ChessBoardHandle } from '../components/ChessBoard';
import useMovePieceSound from '../util/MovePieceSound';

interface PuzzleBoardProps {
    puzzleSolution: {
        fen: string;
        moves: string[];
        name?: string;
        fetchPuzzle: () => void;
    };
    showLabels?: boolean;
}

const PuzzleBoard: React.FC<PuzzleBoardProps> = ({ puzzleSolution, showLabels = true }) => {
    const { fetchPuzzle } = puzzleSolution;

    const [game, setGame] = useState(new Chess(puzzleSolution.fen));
    const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
    const [maxReachedMoveIndex, setMaxReachedMoveIndex] = useState(0);
    const [puzzleStatus, setPuzzleStatus] = useState<'playing' | 'correct' | 'incorrect' | 'solved'>('playing');
    const [feedbackMessage, setFeedbackMessage] = useState('');
    const [userColor, setUserColor] = useState<'w' | 'b' | null>(null);
    const [resetKey, setResetKey] = useState(0);
    const [incorrectSquare, setIncorrectSquare] = useState<Square | null>(null);
    const [isPlayerTurn, setIsPlayerTurn] = useState(false);
    const [showHighlights, setShowHighlights] = useState(true);
    const [hintSquare, setHintSquare] = useState<Square | null>(null);

    const timeoutIds = useRef<NodeJS.Timeout[]>([]);
    const chessboardRef = useRef<ChessBoardHandle>(null);
    const boardContainerRef = useRef<HTMLDivElement>(null);

    const [boardWidth, setBoardWidth] = useState(0);
    const [scale, setScale] = useState(1);

    const { handlePlaySound } = useMovePieceSound();

    useLayoutEffect(() => {
        const boardElement = boardContainerRef.current;
        if (!boardElement) return;

        const resizeObserver = new ResizeObserver(entries => {
            for (let entry of entries) {
                if (entry.target === boardElement) {
                    const newBoardWidth = entry.contentRect.width;
                    setBoardWidth(newBoardWidth);
                    setScale(newBoardWidth / 700);
                }
            }
        });

        resizeObserver.observe(boardElement);
        const initialBoardWidth = boardElement.getBoundingClientRect().width;
        setBoardWidth(initialBoardWidth);
        setScale(initialBoardWidth / 700);

        return () => resizeObserver.disconnect();
    }, []);

    useEffect(() => {
        timeoutIds.current.forEach(clearTimeout);
        timeoutIds.current = [];

        const initialGame = new Chess(puzzleSolution.fen);
        const moves = puzzleSolution.moves;
        const fenTurn = initialGame.turn();
        const userPlaysFirst = moves.length % 2 !== 0;
        const determinedUserColor = userPlaysFirst ? fenTurn : fenTurn === 'w' ? 'b' : 'w';
        const initialMaxReachedIndex = userPlaysFirst ? 0 : 1;

        setMaxReachedMoveIndex(initialMaxReachedIndex);
        setUserColor(determinedUserColor);
        setGame(new Chess(puzzleSolution.fen));
        setCurrentMoveIndex(0);
        setPuzzleStatus('playing');
        setFeedbackMessage('');
        setShowHighlights(true);
        setHintSquare(null);

        if (userPlaysFirst) {
            setIsPlayerTurn(true);
            setFeedbackMessage(`${determinedUserColor === 'w' ? 'White' : 'Black'} to move`);
        } else {
            setIsPlayerTurn(false);
            const timeout = setTimeout(() => {
                const gameAfterMove = new Chess(puzzleSolution.fen);
                const move = gameAfterMove.move(moves[0]);
                if (move) {
                    setGame(gameAfterMove);
                    handlePlaySound(move, gameAfterMove);
                    setCurrentMoveIndex(1);
                    setIsPlayerTurn(true);
                    setFeedbackMessage(`${determinedUserColor === 'w' ? 'White' : 'Black'} to move`);
                }
            }, 1000);
            timeoutIds.current.push(timeout);
        }

        return () => timeoutIds.current.forEach(clearTimeout);
    }, [puzzleSolution, resetKey]);

    const nextPuzzle = useCallback(async () => {
        await fetchPuzzle();
        chessboardRef.current?.resetState();
        setIncorrectSquare(null);
        setHintSquare(null);
    }, [fetchPuzzle]);

    const resetPuzzle = useCallback(() => {
        timeoutIds.current.forEach(clearTimeout);
        timeoutIds.current = [];
        chessboardRef.current?.resetState();
        setResetKey(prevKey => prevKey + 1);
        setIncorrectSquare(null);
        setHintSquare(null);
    }, []);

    const handleGetHint = useCallback(() => {
        if (isPlayerTurn && puzzleStatus === "playing" && currentMoveIndex < puzzleSolution.moves.length) {
            const nextExpectedMove = puzzleSolution.moves[currentMoveIndex];
            const fromSquareForHint = nextExpectedMove.substring(0, 2) as Square;
            setHintSquare(fromSquareForHint);
        }
    }, [isPlayerTurn, puzzleStatus, currentMoveIndex, puzzleSolution.moves]);

    const handleMoveAttempt = useCallback(
        (from: Square, to: Square, promotion?: 'q' | 'r' | 'b' | 'n') => {
            if (puzzleStatus !== 'playing' || game.turn() !== userColor) return;

            setHintSquare(null);
            const expectedMove = puzzleSolution.moves[currentMoveIndex];
            const tempGame = new Chess(game.fen());
            const moveResult = tempGame.move({ from, to, promotion });

            if (!moveResult) return;

            const userMoveAlgebraic = `${from}${to}${promotion || ''}`;
            if (userMoveAlgebraic === expectedMove) {
                setGame(tempGame);
                const nextIndex = currentMoveIndex + 1;
                setMaxReachedMoveIndex(prev => Math.max(prev, nextIndex));
                setCurrentMoveIndex(nextIndex);

                if (nextIndex >= puzzleSolution.moves.length) {
                    setPuzzleStatus('solved');
                    setFeedbackMessage('Puzzle solved!');
                } else {
                    setPuzzleStatus('correct');
                    setFeedbackMessage('Correct! Opponent is thinking...');
                    setIsPlayerTurn(false);
                    const timeout = setTimeout(() => {
                        const opponentGame = new Chess(tempGame.fen());
                        const opponentMove = puzzleSolution.moves[nextIndex];
                        const opponentMoveObj = opponentGame.move(opponentMove);
                        const finalgame = new Chess(opponentGame.fen());
                        if (opponentMoveObj) {
                            setGame(opponentGame);
                            handlePlaySound(opponentMoveObj, finalgame);
                            setCurrentMoveIndex(nextIndex + 1);
                            setMaxReachedMoveIndex(prev => Math.max(prev, nextIndex + 1));
                            setPuzzleStatus('playing');
                            setIsPlayerTurn(true);
                            setFeedbackMessage(`Your turn as ${userColor === 'w' ? 'White' : 'Black'}`);
                        } else {
                            setFeedbackMessage('Error in puzzle data. Please reset.');
                        }
                    }, 1000);
                    timeoutIds.current.push(timeout);
                }
            } else {
                const originalFen = game.fen();
                setGame(tempGame);
                setIncorrectSquare(to);
                setPuzzleStatus('incorrect');
                setFeedbackMessage('Incorrect move. Try again!');
                const timeout = setTimeout(() => {
                    setGame(new Chess(originalFen));
                    setIncorrectSquare(null);
                    setPuzzleStatus('playing');
                    setFeedbackMessage(`Your turn as ${userColor === 'w' ? 'White' : 'Black'}`);
                }, 500);
                timeoutIds.current.push(timeout);
            }
        },
        [game, currentMoveIndex, puzzleSolution, userColor, puzzleStatus]
    );

    const navigateMoves = useCallback(
        (newIndex: number) => {
            if (newIndex < 0 || newIndex > maxReachedMoveIndex) return;
            const tempGame = new Chess(puzzleSolution.fen);
            for (let i = 0; i < newIndex; i++) {
                if (!tempGame.move(puzzleSolution.moves[i])) break;
            }
            setGame(tempGame);
            setCurrentMoveIndex(newIndex);
            setPuzzleStatus(newIndex === puzzleSolution.moves.length ? 'solved' : 'playing');
            setIsPlayerTurn(tempGame.turn() === userColor);
            setFeedbackMessage(
                newIndex === puzzleSolution.moves.length
                    ? 'Puzzle solved!'
                    : newIndex === maxReachedMoveIndex
                        ? `Your turn as ${userColor === 'w' ? 'White' : 'Black'}`
                        : 'Reviewing puzzle moves.'
            );
        },
        [maxReachedMoveIndex, puzzleSolution, userColor]
    );

    const handleGoBack = () => navigateMoves(currentMoveIndex - 1);
    const handleGoForward = () => navigateMoves(currentMoveIndex + 1);

    return (
        <div className="w-full">
            <div
                className="w-full flex flex-col [@media(min-width:900px)]:flex-row items-stretch justify-center gap-4 p-4"
                style={{ minHeight: 'calc(100vh - 64px)' }}
            >
                {/* Main Content: Board + Right */}
                <div className="flex flex-col md:flex-row items-center justify-center gap-4 order-1 [@media(min-width:900px)]:order-2 [@media(min-width:900px)]:flex-1 min-w-0">
                    {/* Invisible left div so that the board is centered */}
                    <div className="hidden xl:inline [@media(min-width:900px)]:order-1 w-full md:w-[25%] flex items-stretch min-w-0"
                        style={{
                            maxWidth: boardWidth,
                        }}
                    />
                    {/* Chessboard */}
                    <div
                        ref={boardContainerRef}
                        className="flex order-2 items-center justify-center w-full [@media(min-width:900px)]:flex-[1_1_0%]"
                        style={{ aspectRatio: '1 / 1', maxWidth: 'calc(100vh - 80px)' }}
                    >
                        <ChessBoard
                            ref={chessboardRef}
                            showLabels={showLabels}
                            game={game}
                            onMoveAttempt={handleMoveAttempt}
                            incorrectSquare={incorrectSquare}
                            isPlayerTurn={isPlayerTurn}
                            showLastMoveHighlight={showHighlights}
                            userColor={userColor}
                            orientation={userColor || 'w'}
                            hintSquare={hintSquare}
                            soundEnabled={true}
                        />
                    </div>

                    {/* Right Sidebar */}
                    <div className="order-2 [@media(min-width:900px)]:order-3 w-full md:w-[25%] flex items-stretch min-w-0"
                        style={{
                            maxWidth: boardWidth,
                        }}
                    >
                        <div className="w-full flex flex-col items-center justify-center border border-gray-300 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-slate-900 p-4">
                            <div className="w-full h-full flex flex-col items-center justify-center">
                                <h2
                                    className="font-bold text-center text-slate-800 dark:text-white w-full leading-tight"
                                    style={{
                                        fontSize: `min(${scale * 1.5}rem, 6vw)`,
                                        whiteSpace: 'nowrap',
                                        marginTop: '0.2em'
                                    }}
                                >

                                    {puzzleSolution.name || 'Chess Puzzle'}
                                </h2>

                                <button
                                    onClick={resetPuzzle}
                                    className="cursor-pointer bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors w-full"
                                    style={{
                                        fontSize: `${scale * 1}rem`,
                                        padding: `${scale * 0.625}rem ${scale * 1.25}rem`,
                                        lineHeight: '1',
                                        marginTop: '1em',
                                        maxWidth: `${scale * 20}rem`
                                    }}
                                >
                                    Reset Puzzle
                                </button>
                                <button
                                    onClick={nextPuzzle}
                                    className="cursor-pointer bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors w-full"
                                    style={{
                                        fontSize: `${scale * 1}rem`,
                                        padding: `${scale * 0.625}rem ${scale * 1.25}rem`,
                                        lineHeight: '1',
                                        marginTop: '1em',
                                        maxWidth: `${scale * 20}rem`
                                    }}
                                >
                                    Next Puzzle
                                </button>
                                <button
                                    onClick={handleGetHint}
                                    disabled={!isPlayerTurn || puzzleStatus !== "playing"}
                                    className="cursor-pointer px-6 py-3 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-500 bg-indigo-400 focus:outline-none transition-colors disabled:opacity-50 disabled:cursor-default"
                                    style={{
                                        fontSize: `${scale * 0.7}rem`,
                                        padding: `${scale * 0.4}rem ${scale * 1.25}rem`,
                                        lineHeight: '1',
                                        marginTop: '2em'
                                    }}
                                >
                                    <span className="flex items-center justify-center">
                                        <Lightbulb
                                            className=""
                                            style={{
                                                marginRight: `${scale * 0.25}rem`,
                                                fontSize: `${scale * 0.5}rem`,
                                                width: `${scale * 1}rem`,
                                                height: `${scale * 1}rem`
                                            }} />
                                        Get a Hint
                                    </span>
                                </button>
                                <p
                                    className={`text-center font-semibold w-full leading-tight ${puzzleStatus === 'correct'
                                        ? 'text-green-600 dark:text-green-400'
                                        : puzzleStatus === 'incorrect'
                                            ? 'text-red-600 dark:text-red-400'
                                            : puzzleStatus === 'solved'
                                                ? 'text-purple-600 dark:text-purple-400'
                                                : 'text-gray-700 dark:text-slate-200'
                                        }`}
                                    style={{
                                        fontSize: `${scale * 0.7}rem`,
                                        whiteSpace: 'nowrap',
                                        marginTop: '1em'
                                    }}
                                >

                                    {feedbackMessage}
                                </p>

                                <div className="flex space-x-4 items-center justify-center mt-4 mb-1">
                                    <button
                                        onClick={handleGoBack}
                                        disabled={currentMoveIndex === 0}
                                        className="rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-40"
                                        style={{ padding: `${scale * 0.5}rem`, }}
                                    >
                                        <ChevronLeft style={{ width: `${scale * 1.5}rem`, height: `${scale * 1.5}rem` }} />
                                    </button>
                                    <button
                                        onClick={handleGoForward}
                                        disabled={currentMoveIndex >= maxReachedMoveIndex}
                                        className="rounded-full bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 disabled:opacity-40"
                                        style={{ padding: `${scale * 0.5}rem` }}
                                    >
                                        <ChevronRight style={{ width: `${scale * 1.5}rem`, height: `${scale * 1.5}rem` }} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </div>
        </div>
    );
};

export default PuzzleBoard;