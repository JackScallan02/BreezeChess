import React, { useState, useCallback, useEffect, useRef, useLayoutEffect } from 'react';
import useDarkMode from '../darkmode/useDarkMode';
import MainToolBar from '../components/MainToolBar';
import ChessBoard, { ChessBoardHandle } from '../components/ChessBoard';
import { Chess, Square } from 'chess.js';
import EvalBar from '../components/EvalBar';
import { useUserData } from '../contexts/UserDataContext';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const BoardBuilder = () => {
  const [game, setGame] = useState(new Chess());
  const [isBoardReady, setIsBoardReady] = useState(false);
  const [boardOrientation, setBoardOrientation] = useState<'w' | 'b'>('w');
  const [currentMoveIndex, setCurrentMoveIndex] = useState(0);
  const [maxReachedMoveIndex, setMaxReachedMoveIndex] = useState(0);
  const [fenMoves, setFenMoves] = useState<any[]>([new Chess().fen()]);

  const [boardWidth, setBoardWidth] = useState(0);
  const [evalBarWidth, setEvalBarWidth] = useState(0); // State for EvalBar width
  const [scale, setScale] = useState(1);
  const chessboardRef = useRef<ChessBoardHandle>(null);
  const boardContainerRef = useRef<HTMLDivElement>(null);
  const evalBarRef = useRef<HTMLDivElement>(null);

  const { showBoardBuilderEvalBar, showBoardBuilderEngineEval } = useUserData();

  useDarkMode();

  useLayoutEffect(() => {
    const boardElement = boardContainerRef.current;
    if (!boardElement) return;

    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        if (entry.target === boardElement) {
          const newBoardWidth = entry.contentRect.width;
          if (newBoardWidth > 0) {
            setBoardWidth(newBoardWidth);
            setScale(newBoardWidth / 700);
          }
        }
      }
    });

    resizeObserver.observe(boardElement);
    const initialBoardWidth = boardElement.getBoundingClientRect().width;
    if (initialBoardWidth > 0) {
      setBoardWidth(initialBoardWidth);
      setScale(initialBoardWidth / 700);
    }

    return () => resizeObserver.disconnect();
  }, []);

  // Effect to measure the EvalBar width
  useLayoutEffect(() => {
    if (showBoardBuilderEvalBar && evalBarRef.current) {
      const observer = new ResizeObserver(entries => {
        for (let entry of entries) {
          setEvalBarWidth(entry.contentRect.width);
        }
      });
      observer.observe(evalBarRef.current);
      return () => observer.disconnect();
    } else {
      setEvalBarWidth(0);
    }
  }, [showBoardBuilderEvalBar]);


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
    
    const newIndex = currentMoveIndex + 1;
    if (newIndex > maxReachedMoveIndex) {
      setMaxReachedMoveIndex(newIndex);
      setFenMoves(prev => [...prev, tempGame.fen()]);
    } else {
       // If we are in the middle of the game, truncate future moves
      setFenMoves(prev => [...prev.slice(0, newIndex), tempGame.fen()]);
      setMaxReachedMoveIndex(newIndex);
    }
    
    setCurrentMoveIndex(newIndex);
    setGame(tempGame);

  }, [game, currentMoveIndex, maxReachedMoveIndex]);

  useEffect(() => {
    setIsBoardReady(true);
  }, []);

  const handleFlipBoard = () => {
    setBoardOrientation(prev => (prev === 'w' ? 'b' : 'w'));
  };

  const resetBoard = () => {
    const newGame = new Chess();
    setGame(newGame);
    setFenMoves([newGame.fen()]);
    setCurrentMoveIndex(0);
    setMaxReachedMoveIndex(0);
    setBoardOrientation('w');
    if (chessboardRef.current) {
      chessboardRef.current?.resetState();
    }
  };

  const navigateMoves = (newIndex: number) => {
    if (newIndex >= 0 && newIndex <= maxReachedMoveIndex) {
        setGame(new Chess(fenMoves[newIndex]));
        setCurrentMoveIndex(newIndex);
    }
  };


  const handleGoBack = () => navigateMoves(currentMoveIndex - 1);
  const handleGoForward = () => navigateMoves(currentMoveIndex + 1);

  return (
    <div className="flex flex-col w-full">
      <MainToolBar />
      <div className="w-full">
        <div
          className="w-full flex flex-col [@media(min-width:900px)]:flex-row items-stretch"
          style={{
            minHeight: 'calc(100vh - 64px)', paddingLeft: `${scale * 2}rem`,
          }}
        >
          {/* Main Content: Board + Right */}
          <div className="flex flex-col md:flex-row items-center justify-center w-full gap-x-4 md:gap-x-8 order-1 [@media(min-width:900px)]:order-2 [@media(min-width:900px)]:flex-1 min-w-0">
            {/* Invisible left div so that the board is centered */}
            <div className="hidden xl:inline [@media(min-width:900px)]:order-1 w-full md:w-[25%] flex items-stretch min-w-0"
              style={{
                maxWidth: boardWidth - evalBarWidth, // Adjusted width
              }}
            />
            <div
              className="flex order-2 flex-row justify-center gap-2  w-full [@media(min-width:900px)]:flex-[1_1_0%]"
              style={{ aspectRatio: '1 / 1', maxWidth: 'calc(100vh - 64px)' }}
            >
              {/* Eval Bar */}
              {showBoardBuilderEvalBar && (
                <div
                  className="flex items-center justify-center"
                  ref={evalBarRef}
                >
                  <EvalBar fen={game.fen()} height={boardWidth * 0.875} scale={scale} />
                </div>
              )}
              {/* Chessboard */}
              <div
                ref={boardContainerRef}
                className="flex items-center justify-center w-full [@media(min-width:900px)]:flex-[1_1_0%]"
                style={{ aspectRatio: '1 / 1', maxWidth: 'calc(100vh - 64px)', paddingRight: `${scale * 2}rem` }}
              >
                <ChessBoard
                  ref={chessboardRef}
                  showLabels
                  game={game}
                  onMoveAttempt={handleMoveAttempt}
                  isPlayerTurn={true}
                  userColor={'w'}
                  canMoveAnyPiece={true}
                  orientation={boardOrientation}
                  soundEnabled
                />
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="order-2 [@media(min-width:900px)]:order-3 w-full md:w-[25%] flex items-stretch min-w-0"
              style={{
                maxWidth: boardWidth,
                paddingRight: `${scale * 2}rem`,
              }}
            >
              <div className="w-full flex flex-col items-center justify-center border border-gray-300 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-slate-900 p-4">
                <div className="w-[75%] h-full flex flex-col items-center justify-center">
                  <button
                    onClick={handleFlipBoard}
                    className="cursor-pointer bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors w-full"
                    style={{
                      fontSize: `${scale * 0.625}rem`,
                      padding: `${scale * 0.625}rem ${scale * 1.25}rem`,
                      lineHeight: '1',
                      marginTop: '1em',
                      maxWidth: `${scale * 20}rem`
                    }}                >
                    Flip Board
                  </button>
                  <button
                    onClick={resetBoard}
                    className="cursor-pointer bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors w-full"
                    style={{
                      fontSize: `${scale * 0.625}rem`,
                      padding: `${scale * 0.625}rem ${scale * 1.25}rem`,
                      lineHeight: '1',
                      marginTop: '1em',
                      maxWidth: `${scale * 20}rem`
                    }}
                  >
                    Reset Board
                  </button>

                  <div style={{ marginTop: `${scale * 0.7}rem` }}>
                    {isBoardReady && (
                      <div className="text-center text-gray-700 dark:text-gray-300">
                        {game.isCheckmate() ? (
                          <p style={{
                            fontSize: `${scale * 0.7}rem`,
                            whiteSpace: 'nowrap',
                            marginTop: '1em'
                          }}
                            className="font-bold">{game.turn() === 'w' ? 'Black wins by checkmate' : 'White wins by checkmate'}</p>
                        ) : (
                          <p style={{
                            fontSize: `${scale * 0.7}rem`,
                            whiteSpace: 'nowrap',
                            marginTop: '1em'
                          }}
                            className="font-bold">{game.turn() === 'w' ? 'White to move' : 'Black to move'}</p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex space-x-4 items-center justify-center" style={{ marginTop: `${scale * 0.7}rem` }}>
                    <button
                      onClick={handleGoBack}
                      disabled={currentMoveIndex === 0}
                      className={`rounded-full bg-slate-200 dark:bg-slate-700 ${currentMoveIndex !== 0 && 'hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer'} disabled:opacity-40`}
                      style={{ padding: `${scale * 0.5}rem`, }}
                    >
                      <ChevronLeft style={{ width: `${scale * 1.5}rem`, height: `${scale * 1.5}rem` }} />
                    </button>
                    <button
                      onClick={handleGoForward}
                      disabled={currentMoveIndex >= maxReachedMoveIndex}
                      className={`rounded-full bg-slate-200 dark:bg-slate-700 ${currentMoveIndex < maxReachedMoveIndex && 'hover:bg-slate-300 dark:hover:bg-slate-600 cursor-pointer'} disabled:opacity-40`}
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
    </div>
  );
};

export default BoardBuilder;