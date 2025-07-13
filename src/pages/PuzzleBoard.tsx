import React, { useEffect, useState, useCallback, useRef, useLayoutEffect } from 'react';
import { Chess, Square } from 'chess.js';
import { ChevronLeft, ChevronRight, Lightbulb, Sparkles } from 'lucide-react';
import ChessBoard, { ChessBoardHandle } from '../components/ChessBoard';
import useMovePieceSound from '../util/MovePieceSound';
import PuzzleTimer from '../components/PuzzleTimer';
import { useUserData } from '../contexts/UserDataContext';
import { updateUserInfo } from '../api/users';
import { useAuth } from '../contexts/AuthContext';

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
    const { showPuzzleTimer, points, setPoints } = useUserData();
    const { user } = useAuth();
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
    const [moveTimes, setMoveTimes] = useState<Array<number>>([]);
    const moveStartTimeRef = useRef<number>(Date.now());
    const [pointsAwarded, setPointsAwarded] = useState(false);
    const [incorrectMovePlayed, setIncorrectMovePlayed] = useState(false);
    const [showPointsAnimation, setShowPointsAnimation] = useState(false);
    const [lastMoveTo, setLastMoveTo] = useState<Square | null>(null);
    const [awardedPoints, setAwardedPoints] = useState(0);

    // State for bonus points and their animations
    const [speedBonus, setSpeedBonus] = useState(0);
    const [accuracyBonus, setAccuracyBonus] = useState(0);
    const [showBonuses, setShowBonuses] = useState(false);
    const [absorbBonuses, setAbsorbBonuses] = useState(false);

    const [animationStart, setAnimationStart] = useState<{ x: number, y: number } | null>(null);
    const [animationEnd, setAnimationEnd] = useState<{ x: number, y: number } | null>(null);

    // --- Start of New Changes ---

    // State to hold the points value displayed on the screen for animation
    const [displayPoints, setDisplayPoints] = useState(points);
    // State to trigger the style change (color, size) on the points text
    const [isUpdatingPoints, setIsUpdatingPoints] = useState(false);
    const animationFrameId = useRef<number | null>(null);

    // Effect to keep displayPoints in sync with the context points, especially on reset.
    useEffect(() => {
        setDisplayPoints(points);
    }, [points, resetKey]);


    // Effect for the count-up animation
    useEffect(() => {
        const startValue = displayPoints;
        const endValue = points;
        const duration = 1200; // Animation duration in ms

        // Only animate if there's a change
        if (startValue === endValue) {
            return;
        }

        let startTime: number | null = null;

        // Ease-in-out cubic function for smooth acceleration and deceleration
        const easeInOutCubic = (t: number) => t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;

        const animate = (timestamp: number) => {
            if (!startTime) {
                startTime = timestamp;
            }

            const elapsed = timestamp - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easedProgress = easeInOutCubic(progress);

            const currentValue = Math.round(startValue + (endValue - startValue) * easedProgress);
            setDisplayPoints(currentValue);

            if (progress < 1) {
                animationFrameId.current = requestAnimationFrame(animate);
            } else {
                // Ensure the final value is exactly the target
                setDisplayPoints(endValue);
            }
        };

        animationFrameId.current = requestAnimationFrame(animate);

        return () => {
            if (animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [points]); // Rerun this effect when the target 'points' value changes


    // --- End of New Changes ---


    const timeoutIds = useRef<NodeJS.Timeout[]>([]);
    const chessboardRef = useRef<ChessBoardHandle>(null);
    const boardContainerRef = useRef<HTMLDivElement>(null);
    const pointsDisplayRef = useRef<HTMLDivElement>(null);

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
                    setScale(newBoardWidth / 600);
                }
            }
        });

        resizeObserver.observe(boardElement);
        const initialBoardWidth = boardElement.getBoundingClientRect().width;
        setBoardWidth(initialBoardWidth);
        setScale(initialBoardWidth / 600);

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
        setMoveTimes([]);
        moveStartTimeRef.current = Date.now();
        setPuzzleStatus('playing');
        setFeedbackMessage('');
        setShowHighlights(true);
        setHintSquare(null);
        setLastMoveTo(null);
        setAwardedPoints(0);

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
        setIncorrectMovePlayed(false);
        setHintSquare(null);
        setResetKey(prev => prev + 1);
        setPointsAwarded(false);
        setMoveTimes([]);
        moveStartTimeRef.current = Date.now();
    }, [fetchPuzzle]);

    const resetPuzzle = useCallback(() => {
        timeoutIds.current.forEach(clearTimeout);
        timeoutIds.current = [];
        chessboardRef.current?.resetState();
        setResetKey(prevKey => prevKey + 1);
        setIncorrectSquare(null);
        setIncorrectMovePlayed(false);
        setHintSquare(null);
        setResetKey(prev => prev + 1);
        setMoveTimes([]);
        moveStartTimeRef.current = Date.now();
    }, []);

    const handleGetHint = useCallback(() => {
        if (isPlayerTurn && puzzleStatus === "playing" && currentMoveIndex < puzzleSolution.moves.length) {
            const nextExpectedMove = puzzleSolution.moves[currentMoveIndex];
            const fromSquareForHint = nextExpectedMove.substring(0, 2) as Square;
            setHintSquare(fromSquareForHint);
            setIncorrectMovePlayed(true);
        }
    }, [isPlayerTurn, puzzleStatus, currentMoveIndex, puzzleSolution.moves]);

    function computePuzzleScore(times: Array<number>, lambda = 0.4, bonusCap = 5): any {
        const m = times.length;
        if (m === 0) return { points: 0, speedBonus: 0, noneIncorrectBonus: 0 };

        const denominator = (m * (m + 1)) / 2;
        const weights = times.map((_, i) => (m - i) / denominator);
        const bonuses = times.map(t => Math.exp(-lambda * t));
        const weightedBonus = bonuses.reduce((sum, b, i) => sum + b * weights[i], 0);
        const totalBonus = Math.min(bonusCap, bonusCap * weightedBonus);
        const noneIncorrectBonus = !incorrectMovePlayed ? 0.5 * m : 0;

        return {
            points: Math.round(m * 100),
            speedBonus: Math.round(totalBonus * 100),
            noneIncorrectBonus: Math.round(noneIncorrectBonus * 100)
        };
    };

    const updatePoints = async (finalMoveTimes: Array<number>, lastMove: Square) => {
        if (user && !pointsAwarded) {
            let puzzlePoints = computePuzzleScore(finalMoveTimes);
            setPointsAwarded(true);

            // Set the state for the bonus points to be displayed
            setSpeedBonus(puzzlePoints.speedBonus);
            setAccuracyBonus(puzzlePoints.noneIncorrectBonus);

            const totalPoints = puzzlePoints.points + puzzlePoints.speedBonus + puzzlePoints.noneIncorrectBonus;
            setAwardedPoints(totalPoints);
            setLastMoveTo(lastMove);
            setShowPointsAnimation(true);

            const start = getSquarePosition(lastMove);
            const endRect = pointsDisplayRef.current?.getBoundingClientRect();
            const containerRect = boardContainerRef.current?.getBoundingClientRect();

            if (endRect && containerRect) {
                const endX = endRect.left + endRect.width / 2 - containerRect.left;
                const endY = endRect.top + endRect.height / 2 - containerRect.top;

                setAnimationStart({
                    x: parseFloat(start.left),
                    y: parseFloat(start.top),
                });

                setAnimationEnd({
                    x: endX,
                    y: endY,
                });
            }

            // Trigger the bonus labels to slide up from the bottom
            if (puzzlePoints.speedBonus > 0 || puzzlePoints.noneIncorrectBonus > 0) {
                setShowBonuses(true);
            }

            // Chain the animations
            const timeout1 = setTimeout(async () => {
                setShowPointsAnimation(false);
                setAnimationStart(null);
                setAnimationEnd(null);

                // Trigger the "absorption" animation for the bonus labels
                setAbsorbBonuses(true);
                
                // Trigger the text style animation and update points
                setIsUpdatingPoints(true);
                await updateUserInfo(user.id, { points: points + totalPoints });
                setPoints(points + totalPoints);

                // Reset all animation states after they've finished
                const timeout2 = setTimeout(() => {
                    setIsUpdatingPoints(false);
                    setShowBonuses(false);
                    setAbsorbBonuses(false);
                }, 1500); // This duration should be slightly longer than the count-up
                timeoutIds.current.push(timeout2);

            }, 1000); // This is the duration of the flying points animation
            timeoutIds.current.push(timeout1);
        }
    };

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
                const now = Date.now();
                const timeTakenSec = (now - moveStartTimeRef.current) / 1000;
                const newMoveTimes = [...moveTimes, timeTakenSec];
                setMoveTimes(newMoveTimes);
                moveStartTimeRef.current = now;

                setGame(tempGame);
                const nextIndex = currentMoveIndex + 1;
                setMaxReachedMoveIndex(prev => Math.max(prev, nextIndex));
                setCurrentMoveIndex(nextIndex);

                if (nextIndex >= puzzleSolution.moves.length) {
                    setPuzzleStatus('solved');
                    setFeedbackMessage('Puzzle solved!');
                    updatePoints(newMoveTimes, to);
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
                    }, 500);
                    timeoutIds.current.push(timeout);
                }
            } else {
                const originalFen = game.fen();
                setGame(tempGame);
                setIncorrectSquare(to);
                if (!incorrectMovePlayed) setIncorrectMovePlayed(true);
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
        [game, currentMoveIndex, puzzleSolution, userColor, puzzleStatus, moveTimes, incorrectMovePlayed, handlePlaySound, updatePoints]
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

    const getSquarePosition = (square: Square) => {
        if (!boardContainerRef.current) return { top: '0px', left: '0px' };

        const container = boardContainerRef.current;
        const rect = container.getBoundingClientRect();

        const col = square.charCodeAt(0) - 'a'.charCodeAt(0);
        const row = 8 - parseInt(square.charAt(1), 10);
        const isFlipped = userColor === 'b';

        const finalRow = isFlipped ? 7 - row : row;
        const finalCol = isFlipped ? 7 - col : col;

        const squareSize = rect.width / 8;

        const x = finalCol * squareSize + squareSize / 2;
        const y = finalRow * squareSize;

        return {
            left: `${x}px`,
            top: `${y}px`,
        };
    };


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
                        className="flex order-2 items-center justify-center w-full [@media(min-width:900px)]:flex-[1_1_0%] relative"
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
                        {/* The points animation */}
                        {showPointsAnimation && animationStart && animationEnd && (
                            <div
                                className="absolute text-green-500 font-bold md:text-3xl text-xl pointer-events-none drop-shadow-[0_1.4px_1.4px_rgba(0,0,0,0.9)]"
                                style={{
                                    left: animationStart.x,
                                    top: animationStart.y,
                                    position: 'absolute',
                                    zIndex: 100,
                                    animation: 'arcMove 1s cubic-bezier(0.2, 0.0, 0.8, 1.0) forwards',
                                    willChange: 'transform, opacity',
                                    '--dx': `${animationEnd.x - animationStart.x}px`,
                                    '--dy': `${animationEnd.y - animationStart.y}px`,
                                } as React.CSSProperties}
                            >
                                +{awardedPoints - speedBonus - accuracyBonus}
                            </div>
                        )}

                    </div>

                    {/* Right Side */}
                    <div className="order-2 [@media(min-width:900px)]:order-3 w-full md:w-[25%] flex items-stretch min-w-0"
                        style={{
                            maxWidth: boardWidth,
                        }}
                    >
                        <div className="flex flex-row md:flex-col items-center justify-center w-full">
                            {showPuzzleTimer && (
                                <div className="p-4 order-2 md:order-1">
                                    <PuzzleTimer fontSize={scale * 2} key={resetKey} running={puzzleStatus !== 'solved'}></PuzzleTimer>
                                </div>
                            )}
                            <div className="order-1 md:order-2 w-full flex flex-col items-center justify-center border border-gray-300 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-slate-900 p-4">
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
                            <div
                                ref={pointsDisplayRef}
                                className={`order-4 w-full flex items-center justify-center`} style={{ marginTop: `${scale * 1.5}rem` }}>
                                {/* Relative wrapper for positioning bonus labels */}
                                <div className="relative">
                                    {/* Main points display */}
                                    <div
                                        className={`flex flex-row items-center transition-all duration-500 ease-in-out ${isUpdatingPoints ? 'text-green-500' : ''}`}
                                        style={{
                                            gap: `${scale * 0.25}rem`,
                                            transform: isUpdatingPoints ? 'scale(1.25)' : 'scale(1)',
                                            transformOrigin: 'center'
                                        }}
                                    >
                                        <Sparkles style={{ width: `${scale * 1}rem`, height: `${scale * 1}rem` }} />
                                        <div className="flex flex-row" style={{ gap: `${scale * 0.25}rem` }}>
                                            <p style={{ fontSize: `${scale * 1}rem` }}>{displayPoints}</p>
                                            <p style={{ fontSize: `${scale * 1}rem` }}>points</p>
                                        </div>
                                    </div>

                                    {/* Absolutely positioned container for bonus labels */}
                                    <div className="absolute top-full left-0 right-0 mt-1 flex flex-col text-center gap-1 pointer-events-none">
                                        {/* Speed Bonus Label */}
                                        {speedBonus > 0 && (
                                            <div className={`text-sm font-semibold text-green-500 transition-all duration-700 
                                                ${absorbBonuses
                                                    ? '-translate-y-4 opacity-0 scale-75' // State 2: Absorb
                                                    : showBonuses
                                                        ? 'translate-y-0 opacity-100'   // State 1: Visible
                                                        : 'translate-y-16 opacity-0'    // State 0: Hidden
                                                }`}
                                            >
                                                +{speedBonus} Speed
                                            </div>
                                        )}
                                        {/* Accuracy Bonus Label */}
                                        {accuracyBonus > 0 && (
                                            <div className={`text-sm font-semibold text-green-500 transition-all duration-700 delay-100 
                                                ${absorbBonuses
                                                    ? '-translate-y-4 opacity-0 scale-75' // State 2: Absorb
                                                    : showBonuses
                                                        ? 'translate-y-0 opacity-100'   // State 1: Visible
                                                        : 'translate-y-16 opacity-0'    // State 0: Hidden
                                                }`}
                                            >
                                                +{accuracyBonus} None Incorrect
                                            </div>
                                        )}
                                    </div>
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