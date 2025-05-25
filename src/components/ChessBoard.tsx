// components/ChessBoard.tsx

import React, { useRef, useEffect, useState, useCallback } from "react";
import { Chess, Square, Piece } from 'chess.js';

interface props {
    showLabels: boolean;
    game: Chess;
    setGame: React.Dispatch<React.SetStateAction<Chess>>;
    onBoardReady?: (isReady: boolean) => void; // New prop
}

interface DraggedPieceState {
    piece: Piece;
    fromSquare: Square;
}

const ChessBoard: React.FC<props> = ({ showLabels, game, setGame, onBoardReady }) => { // Destructure new prop
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const typeMapping: { [key: string]: string } = {
        p: "pawn", r: "rook", n: "knight", b: "bishop", q: "queen", k: "king",
    };
    const colorMapping: { [key: string]: string } = {
        w: "white", b: "black",
    };
    const numbers = [8, 7, 6, 5, 4, 3, 2, 1];

    const boardRef = useRef<HTMLDivElement>(null);
    const [boardWidth, setBoardWidth] = useState(0);

    const [draggedPiece, setDraggedPiece] = useState<DraggedPieceState | null>(null);
    const [draggedPosition, setDraggedPosition] = useState<{ x: number, y: number } | null>(null);

    const [isGameOver, setIsGameOver] = useState(false);
    const [gameResult, setGameResult] = useState<string | null>(null);

    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
    const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);


    const squareSize = boardWidth > 0 ? boardWidth / 8 : 0;
    const draggedPieceVisualWidth = squareSize;
    const draggedPieceVisualHeight = squareSize;

    useEffect(() => {
        const updateBoardWidth = () => {
            if (boardRef.current) {
                const viewportMin = Math.min(window.innerWidth, window.innerHeight);
                let newBoardWidth = viewportMin * 0.7;
                newBoardWidth = Math.max(newBoardWidth, 300);

                if (newBoardWidth !== boardWidth) { // Only update if changed
                    setBoardWidth(newBoardWidth);
                    // Call onBoardReady when the board width is set for the first time or changes
                    if (onBoardReady) {
                        onBoardReady(true);
                    }
                }
            } else {
                // If boardRef.current is null, the board is not ready
                if (onBoardReady && boardWidth !== 0) { // Only send false if it was previously true
                    onBoardReady(false);
                }
            }
        };

        updateBoardWidth();
        window.addEventListener("resize", updateBoardWidth);

        return () => window.removeEventListener("resize", updateBoardWidth);
    }, [boardWidth, onBoardReady]); // Add boardWidth and onBoardReady to dependency array

    const getAlgebraicSquare = useCallback((index: number): Square => {
        const file = String.fromCharCode(97 + (index % 8));
        const rank = numbers[Math.floor(index / 8)];
        return (file + rank) as Square;
    }, [numbers]);

    const getPieceImage = (piece: Piece | undefined): string | null => {
        if (piece) {
            return `/assets/chess_pieces/default/${colorMapping[piece.color]}/${typeMapping[piece.type]}.webp`;
        }
        return null;
    };

    const handleSquareInteraction = useCallback((e: React.MouseEvent, piece: Piece | undefined, square: Square) => {
        e.preventDefault();

        if (isGameOver || !boardRef.current) {
            return;
        }

        if (piece && game.turn() === piece.color) {
            if (selectedSquare === square) {
                setSelectedSquare(null);
                setPossibleMoves([]);
            } else {
                setSelectedSquare(square);
                const moves = game.moves({ square: square, verbose: true }).map(move => move.to);
                setPossibleMoves(moves as Square[]);
            }

            if (game.turn() === piece.color && e.type === 'mousedown') {
                const boardRect = boardRef.current.getBoundingClientRect();
                setDraggedPiece({ piece, fromSquare: square });
                setDraggedPosition({
                    x: e.clientX - boardRect.left - (draggedPieceVisualWidth / 2),
                    y: e.clientY - boardRect.top - (draggedPieceVisualHeight / 2),
                });
                document.body.style.cursor = 'grabbing';
            }

        } else if (selectedSquare) {
            try {
                const selectedPiece = game.get(selectedSquare);
                const isPawn = selectedPiece && selectedPiece.type === 'p';
                const isPromotion = (isPawn && ((selectedPiece.color === 'w' && square[1] === '8') || (selectedPiece.color === 'b' && square[1] === '1')));

                const moveResult = game.move({
                    from: selectedSquare,
                    to: square,
                    promotion: isPromotion ? 'q' : undefined,
                });

                if (moveResult) {
                    setGame(new Chess(game.fen()));
                    setSelectedSquare(null);
                    setPossibleMoves([]);
                    if (game.isCheckmate()) {
                        const winner = game.turn() === 'w' ? 'Black' : 'White';
                        setGameResult(`${winner} wins by checkmate!`);
                        setIsGameOver(true);
                    } else if (game.isStalemate()) {
                        setGameResult("Game over: Stalemate!");
                        setIsGameOver(true);
                    } else if (game.isDraw()) {
                        setGameResult("Game over: Draw!");
                        setIsGameOver(true);
                    } else if (game.isThreefoldRepetition()) {
                        setGameResult("Game over: Draw by threefold repetition!");
                        setIsGameOver(true);
                    } else if (game.isInsufficientMaterial()) {
                        setGameResult("Game over: Draw by insufficient material!");
                        setIsGameOver(true);
                    } else if (game.isDrawByFiftyMoves()) {
                        setGameResult("Game over: Draw by fifty moves rule!");
                        setIsGameOver(true);
                    }
                } else {
                    setSelectedSquare(null);
                    setPossibleMoves([]);
                }
            } catch (error) {
                setSelectedSquare(null);
                setPossibleMoves([]);
            }
        } else {
            setSelectedSquare(null);
            setPossibleMoves([]);
        }
    }, [isGameOver, game, selectedSquare, draggedPieceVisualWidth, draggedPieceVisualHeight, setGame]);


    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (draggedPiece && boardRef.current) {
            const boardRect = boardRef.current.getBoundingClientRect();
            setDraggedPosition({
                x: e.clientX - boardRect.left - (draggedPieceVisualWidth / 2),
                y: e.clientY - boardRect.top - (draggedPieceVisualHeight / 2),
            });
        }
    }, [draggedPiece, draggedPieceVisualWidth, draggedPieceVisualHeight]);

    const handleMouseUp = useCallback((e: MouseEvent) => {
        if (draggedPiece && boardRef.current) {
            const boardRect = boardRef.current.getBoundingClientRect();

            const mouseX = (draggedPosition?.x ?? (e.clientX - boardRect.left)) + (draggedPieceVisualWidth / 2);
            const mouseY = (draggedPosition?.y ?? (e.clientY - boardRect.top)) + (draggedPieceVisualHeight / 2);

            const col = Math.floor(mouseX / squareSize);
            const row = Math.floor(mouseY / squareSize);

            if (col >= 0 && col < 8 && row >= 0 && row < 8) {
                const targetIndex = row * 8 + col;
                const toSquare = getAlgebraicSquare(targetIndex);

                try {
                    const piece = game.get(draggedPiece.fromSquare);
                    const isPawn = piece && piece.type === 'p';
                    const isPromotion = (isPawn && ((piece.color === 'w' && toSquare[1] === '8') || (piece.color === 'b' && toSquare[1] === '1')));

                    const moveResult = game.move({
                        from: draggedPiece.fromSquare,
                        to: toSquare,
                        promotion: isPromotion ? 'q' : undefined,
                    });

                    if (moveResult) {
                        setGame(new Chess(game.fen()));
                        setSelectedSquare(null);
                        setPossibleMoves([]);

                        if (game.isCheckmate()) {
                            const winner = game.turn() === 'w' ? 'Black' : 'White';
                            setGameResult(`${winner} wins by checkmate!`);
                            setIsGameOver(true);
                        } else if (game.isStalemate()) {
                            setGameResult("Game over: Stalemate!");
                            setIsGameOver(true);
                        } else if (game.isDraw()) {
                            setGameResult("Game over: Draw!");
                            setIsGameOver(true);
                        } else if (game.isThreefoldRepetition()) {
                            setGameResult("Game over: Draw by threefold repetition!");
                            setIsGameOver(true);
                        } else if (game.isInsufficientMaterial()) {
                            setGameResult("Game over: Draw by insufficient material!");
                            setIsGameOver(true);
                        } else if (game.isDrawByFiftyMoves()) {
                            setGameResult("Game over: Draw by fifty moves rule!");
                            setIsGameOver(true);
                        }
                    }
                } catch (error) {
                    // Invalid move, snap back (by resetting draggedPiece)
                }
            }
        }

        setDraggedPiece(null);
        setDraggedPosition(null);
        document.body.style.cursor = 'default';
    }, [draggedPiece, game, getAlgebraicSquare, squareSize, draggedPosition, draggedPieceVisualWidth, draggedPieceVisualHeight, setGame]);


    useEffect(() => {
        if (draggedPiece) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [draggedPiece, handleMouseMove, handleMouseUp]);

    const sideLabelWidth = boardWidth * 0.04;
    const bottomLabelMarginTop = boardWidth * 0.02;

    const currentBoard = game.board();

    return (
        <div className="flex justify-center items-center w-full h-full text-black dark:text-white overflow-hidden" style={{ padding: "2rem", boxSizing: "border-box" }}>
            <div className="flex flex-col items-center" style={{ minHeight: "300px", minWidth: "300px" }}>
                <div className="flex">
                    {showLabels && (
                        <div
                            className="flex flex-col justify-between"
                            style={{
                                height: boardWidth > 0 ? boardWidth : 'auto',
                                marginRight: `min(${sideLabelWidth}px, 12px)`,
                                visibility: boardWidth === 0 ? 'hidden' : 'visible',
                                transition: 'visibility 0s ease 0.1s'
                            }}
                        >
                            {numbers.map((num, i) => (
                                <div key={i} className="flex-1 flex items-center justify-center text-sm font-semibold">{num}</div>
                            ))}
                        </div>
                    )}
                    <div
                        ref={boardRef}
                        className="grid grid-cols-8 grid-rows-8 max-w-full max-h-full border-4 border-gray-700 rounded-md overflow-hidden"
                        style={{
                            width: boardWidth,
                            height: boardWidth,
                            position: 'relative',
                            visibility: boardWidth === 0 ? 'hidden' : 'visible',
                            transition: 'visibility 0s ease 0.1s'
                        }}
                    >
                        {currentBoard.flat().map((piece, i) => {
                            const row = Math.floor(i / 8);
                            const col = i % 8;
                            const isDark = (row + col) % 2 !== 0;
                            const algebraicSquare = getAlgebraicSquare(i);
                            const pieceImage = getPieceImage(piece || undefined);
                            const isDragged = draggedPiece?.fromSquare === algebraicSquare;
                            const isSelected = selectedSquare === algebraicSquare;
                            const isPossibleMove = possibleMoves.includes(algebraicSquare);

                            return (
                                <div
                                    key={i}
                                    className={`${isDark ? "bg-sky-700" : "bg-slate-100"} relative flex items-center justify-center`}
                                    style={{ width: squareSize, height: squareSize }}
                                    onMouseDown={(e) => handleSquareInteraction(e, piece || undefined, algebraicSquare)}
                                    onClick={(e) => {
                                        if (!draggedPiece) {
                                            handleSquareInteraction(e, piece || undefined, algebraicSquare);
                                        }
                                    }}
                                >
                                    {isSelected && (
                                        <div
                                            className="absolute inset-0 bg-amber-200 opacity-70"
                                            style={{ zIndex: 1 }}
                                        ></div>
                                    )}

                                    {isPossibleMove && (
                                        <div
                                            className={`absolute rounded-full ${piece ? 'border-4 border-slate-400' : 'bg-slate-400 opacity-50'}`}
                                            style={{
                                                width: piece ? '100%' : '30%',
                                                height: piece ? '100%' : '30%',
                                                zIndex: 2,
                                                transform: piece ? 'scale(0.9)' : 'none',
                                            }}
                                        ></div>
                                    )}

                                    {!isDragged && pieceImage && (
                                        <img
                                            src={pieceImage}
                                            alt={`${piece?.color} ${piece?.type}`}
                                            style={{
                                                width: '75%',
                                                height: '75%',
                                                objectFit: 'contain',
                                                cursor: game.turn() === piece?.color ? 'grab' : 'default',
                                                userSelect: 'none',
                                                zIndex: 3,
                                            }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                        {draggedPiece && draggedPosition && (
                            <img
                                src={getPieceImage(draggedPiece.piece) || ''}
                                alt=""
                                style={{
                                    position: 'absolute',
                                    left: `${draggedPosition.x}px`,
                                    top: `${draggedPosition.y}px`,
                                    width: `${draggedPieceVisualWidth}px`,
                                    height: `${draggedPieceVisualHeight}px`,
                                    objectFit: 'contain',
                                    pointerEvents: 'none',
                                    zIndex: 1000,
                                    transform: 'scale(0.9)',
                                    filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))',
                                }}
                            />
                        )}
                    </div>
                </div>
                {showLabels && (
                    <div
                        className="grid grid-cols-8"
                        style={{
                            width: boardWidth > 0 ? boardWidth : 'auto',
                            marginLeft: `min(${sideLabelWidth}px, 12px)`,
                            marginTop: `min(${bottomLabelMarginTop}px, 6px)`,
                            visibility: boardWidth === 0 ? 'hidden' : 'visible',
                            transition: 'visibility 0s ease 0.1s'
                        }}
                    >
                        {letters.map((letter, i) => (
                            <div key={i} className="text-center text-sm font-semibold">{letter}</div>
                        ))}
                    </div>
                )}
                {isGameOver && gameResult && (
                    <div className="mt-4 p-3 rounded-lg shadow-lg text-lg font-bold text-center bg-white dark:bg-gray-700 text-red-600 dark:text-red-400">
                        {gameResult}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChessBoard;