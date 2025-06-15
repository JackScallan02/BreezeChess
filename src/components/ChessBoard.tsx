import React, { useRef, useEffect, useState, useCallback } from "react";
import { Chess, Square, Piece } from 'chess.js';

// ChessBoard Component
interface ChessBoardProps {
    showLabels: boolean;
    game: Chess;
    onMoveAttempt: (from: Square, to: Square, promotion?: 'q' | 'r' | 'b' | 'n') => void;
    incorrectSquare?: string | null;
    isPlayerTurn?: boolean | undefined;
    showLastMoveHighlight?: boolean;
    userColor: 'w' | 'b' | null;
    hintSquare?: Square | null;
    canMoveAnyPiece?: boolean; // NEW PROP: Indicates if any piece can be moved (for builder mode)
}

interface DraggedPieceState {
    piece: Piece;
    fromSquare: Square;
}

interface InteractionState {
    piece: Piece;
    square: Square;
    isDragging: boolean;
    startX: number;
    startY: number;
}

interface LastMove {
    from: Square;
    to: Square;
}

interface PreMove {
    from: Square;
    to: Square;
    promotion?: 'q' | 'r' | 'b' | 'n';
}

const ChessBoard: React.FC<ChessBoardProps> = ({ showLabels, game, onMoveAttempt, isPlayerTurn, incorrectSquare, showLastMoveHighlight = true, userColor, hintSquare, canMoveAnyPiece }) => {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const numbers = [8, 7, 6, 5, 4, 3, 2, 1];
    const boardRef = useRef<HTMLDivElement>(null);
    const interactionState = useRef<InteractionState | null>(null);

    const [boardWidth, setBoardWidth] = useState(0);
    const [draggedPiece, setDraggedPiece] = useState<DraggedPieceState | null>(null);
    const [draggedPosition, setDraggedPosition] = useState<{ x: number; y: number } | null>(null);
    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
    const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);
    const [hoveredTargetSquare, setHoveredTargetSquare] = useState<Square | null>(null);
    const [lastMove, setLastMove] = useState<LastMove | null>(null);
    const [preMoves, setPreMoves] = useState<PreMove[]>([]);

    const gameRef = useRef<Chess | null>(null);

    useEffect(() => {
        gameRef.current = game;
    }, [game]);

    useEffect(() => {
        if (isPlayerTurn && preMoves.length > 0) {
            return;
        }
        const history = game.history({ verbose: true });
        if (showLastMoveHighlight && history.length > 0) {
            const last = history[history.length - 1];
            setLastMove({ from: last.from, to: last.to });
        } else {
            setLastMove(null);
        }
    }, [game, showLastMoveHighlight, isPlayerTurn, preMoves]);

    useEffect(() => {
        if (isPlayerTurn && preMoves.length > 0) {
            const nextPreMove = preMoves[0];
            const legalMoves = game.moves({ verbose: true });
            const isPreMoveLegal = legalMoves.some(
                move => move.from === nextPreMove.from && move.to === nextPreMove.to
            );

            if (isPreMoveLegal) {
                onMoveAttempt(nextPreMove.from, nextPreMove.to, nextPreMove.promotion);
                setPreMoves(prev => prev.slice(1));
            } else {
                setLastMove(null);
                setPreMoves([]);
            }
        }
    }, [preMoves, isPlayerTurn, game, onMoveAttempt]);

    const squareSize = boardWidth > 0 ? boardWidth / 8 : 0;
    const draggedPieceVisualWidth = squareSize;
    const draggedPieceVisualHeight = squareSize;

    useEffect(() => {
        const updateBoardWidth = () => {
            if (boardRef.current) {
                const viewportMin = Math.min(window.innerWidth, window.innerHeight);
                let newBoardWidth = viewportMin * 0.7;
                newBoardWidth = Math.max(newBoardWidth, 300);
                if (newBoardWidth !== boardWidth) setBoardWidth(newBoardWidth);
            }
        };
        updateBoardWidth();
        window.addEventListener("resize", updateBoardWidth);
        return () => window.removeEventListener("resize", updateBoardWidth);
    }, [boardWidth]);

    const getAlgebraicSquare = useCallback((index: number): Square => {
        const file = String.fromCharCode(97 + (index % 8));
        const rank = numbers[Math.floor(index / 8)];
        return (file + rank) as Square;
    }, [numbers]);

    const getPieceImage = (piece: Piece | undefined): string | null => {
        if (piece) return `https://images.chesscomfiles.com/chess-themes/pieces/neo/150/${piece.color}${piece.type}.png`;
        return null;
    };

    // FIXED: This function's logic is now robust for click-to-move and captures.
    const handleSquareClick = useCallback((clickedSquare: Square) => {
        if (interactionState.current?.isDragging) {
            return;
        }
    
        if (!canMoveAnyPiece && !isPlayerTurn && game.history().length === 0) {
            return;
        }
    
        // If a piece is already selected
        if (selectedSquare) {
            // Deselect if the same square is clicked again
            if (selectedSquare === clickedSquare) {
                setSelectedSquare(null);
                setPossibleMoves([]);
                return;
            }
    
            // Check if the clicked square is a valid move (for moving or capturing)
            const isMovePossible = possibleMoves.includes(clickedSquare);
    
            if (isMovePossible) {
                const pieceToMove = game.get(selectedSquare);
                let promotionPiece: 'q' | 'r' | 'b' | 'n' | undefined = undefined;
                if (pieceToMove?.type === 'p' &&
                    ((pieceToMove.color === 'w' && clickedSquare.endsWith('8')) ||
                     (pieceToMove.color === 'b' && clickedSquare.endsWith('1')))) {
                    promotionPiece = 'q';
                }
    
                if (isPlayerTurn || canMoveAnyPiece) {
                    onMoveAttempt(selectedSquare, clickedSquare, promotionPiece);
                } else {
                    setPreMoves(prev => [...prev, { from: selectedSquare, to: clickedSquare, promotion: promotionPiece }]);
                }
    
                // Reset selection after the move attempt
                setSelectedSquare(null);
                setPossibleMoves([]);
            } else {
                // If not a valid move, check if the user is clicking another of their own pieces to change selection
                const pieceOnClickedSquare = game.get(clickedSquare);
                if (pieceOnClickedSquare && (canMoveAnyPiece || pieceOnClickedSquare.color === userColor)) {
                    setSelectedSquare(clickedSquare);
                    setPossibleMoves(game.moves({ square: clickedSquare, verbose: true }).map(move => move.to));
                } else {
                    // Invalid move, deselect the piece
                    setSelectedSquare(null);
                    setPossibleMoves([]);
                }
            }
        } else {
            // If no piece is selected, select the clicked piece if it's the user's color
            const pieceOnClickedSquare = game.get(clickedSquare);
            if (pieceOnClickedSquare && (canMoveAnyPiece || pieceOnClickedSquare.color === userColor)) {
                setSelectedSquare(clickedSquare);
                if (isPlayerTurn || canMoveAnyPiece) {
                    setPossibleMoves(game.moves({ square: clickedSquare, verbose: true }).map(move => move.to));
                }
            }
        }
    }, [game, onMoveAttempt, selectedSquare, isPlayerTurn, userColor, canMoveAnyPiece, possibleMoves]);


    const handleMouseMove = useCallback((e: MouseEvent) => {
        const currentInteraction = interactionState.current;
        if (!currentInteraction || !currentInteraction.piece) return;

        if (currentInteraction.isDragging) {
            if (boardRef.current) {
                const boardRect = boardRef.current.getBoundingClientRect();
                const currentMouseX = e.clientX - boardRect.left;
                const currentMouseY = e.clientY - boardRect.top;

                setDraggedPosition({
                    x: currentMouseX - draggedPieceVisualWidth / 2,
                    y: currentMouseY - draggedPieceVisualHeight / 2,
                });

                const col = Math.floor(currentMouseX / squareSize);
                const row = Math.floor(currentMouseY / squareSize);

                let currentLegalMoves: Square[] = [];
                if (gameRef.current) {
                    currentLegalMoves = gameRef.current.moves({ square: currentInteraction.square, verbose: true }).map(move => move.to) as Square[];
                }

                if (isPlayerTurn || canMoveAnyPiece) {
                    setPossibleMoves(currentLegalMoves);
                }

                let newHoveredTargetSquare: Square | null = null;
                if (col >= 0 && col < 8 && row >= 0 && row < 8) {
                    const currentSquareUnderMouse = getAlgebraicSquare(row * 8 + col);
                    if (currentLegalMoves.includes(currentSquareUnderMouse)) {
                        newHoveredTargetSquare = currentSquareUnderMouse;
                    }
                }
                setHoveredTargetSquare(newHoveredTargetSquare);
            }
            return;
        }

        const dx = Math.abs(e.clientX - currentInteraction.startX);
        const dy = Math.abs(e.clientY - currentInteraction.startY);
        const dragThreshold = 5;

        if (dx > dragThreshold || dy > dragThreshold) {
            interactionState.current.isDragging = true;
            e.preventDefault();
            setDraggedPiece({
                piece: currentInteraction.piece,
                fromSquare: currentInteraction.square,
            });
            if (isPlayerTurn || canMoveAnyPiece) {
                setPossibleMoves(gameRef.current?.moves({ square: currentInteraction.square, verbose: true }).map(move => move.to) as Square[] || []);
            }
            setSelectedSquare(null);
            document.body.style.cursor = 'grabbing';
        }
    }, [draggedPieceVisualHeight, draggedPieceVisualWidth, squareSize, getAlgebraicSquare, isPlayerTurn, canMoveAnyPiece]);

    // FIXED: This function now only handles the end of a DRAG action, not a click.
    const handleMouseUp = useCallback((e: MouseEvent) => {
        const currentInteraction = interactionState.current;
    
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
    
        // Only process a move and clean up state if a drag actually happened.
        if (currentInteraction?.isDragging) {
            setHoveredTargetSquare(null);
            setPossibleMoves([]);
    
            if (boardRef.current) {
                const boardRect = boardRef.current.getBoundingClientRect();
                const mouseX = e.clientX - boardRect.left;
                const mouseY = e.clientY - boardRect.top;
                const col = Math.floor(mouseX / squareSize);
                const row = Math.floor(mouseY / squareSize);
    
                if (col >= 0 && col < 8 && row >= 0 && row < 8) {
                    const toSquare = getAlgebraicSquare(row * 8 + col);
                    if (currentInteraction.square !== toSquare) {
                        const pieceToMove = gameRef.current?.get(currentInteraction.square);
                        let promotionPiece: 'q' | 'r' | 'b' | 'n' | undefined = undefined;
                        if (pieceToMove?.type === 'p' && ((pieceToMove.color === 'w' && toSquare.endsWith('8')) || (pieceToMove.color === 'b' && toSquare.endsWith('1')))) {
                            promotionPiece = 'q';
                        }
                        if (isPlayerTurn || canMoveAnyPiece) {
                            onMoveAttempt(currentInteraction.square, toSquare, promotionPiece);
                        } else {
                            if (!canMoveAnyPiece && game.history().length === 0) {
                                console.log("Preventing premove: It's the first move and computer's turn.");
                            } else {
                                setPreMoves(prev => [...prev, { from: currentInteraction.square, to: toSquare, promotion: promotionPiece }]);
                            }
                        }
                    }
                }
            }
    
            // Clean up all drag-related state
            setDraggedPiece(null);
            setDraggedPosition(null);
            document.body.style.cursor = 'default';
            setSelectedSquare(null);
        }
    
        // Always clear the interaction ref, for both clicks and drags.
        interactionState.current = null;
    }, [onMoveAttempt, squareSize, getAlgebraicSquare, isPlayerTurn, handleMouseMove, game, canMoveAnyPiece]);
    

    const handleMouseDown = useCallback((e: React.MouseEvent, piece: Piece | undefined, square: Square) => {
        e.preventDefault();
        if (!canMoveAnyPiece && !isPlayerTurn && game.history().length === 0) {
            return;
        }

        if (e.button !== 0 || !piece || (!canMoveAnyPiece && piece.color !== userColor)) {
            return;
        }
        interactionState.current = {
            piece,
            square,
            isDragging: false,
            startX: e.clientX,
            startY: e.clientY,
        };
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove, handleMouseUp, userColor, isPlayerTurn, game, canMoveAnyPiece]);

    if (!game) {
        return <div className="flex justify-center items-center w-full h-full text-black dark:text-white">Loading Chess Board...</div>;
    }

    const currentBoard = game.board();

    return (
        <div className="flex justify-center items-center w-full h-full text-black dark:text-white overflow-hidden" style={{ padding: "2rem", boxSizing: "border-box" }}>
            <div className="flex flex-col items-center" style={{ minHeight: "300px", minWidth: "300px" }}>
                <div className="flex">
                    {showLabels && (
                        <div className="flex flex-col justify-between" style={{ height: boardWidth > 0 ? boardWidth : 'auto', marginRight: `min(${boardWidth * 0.04}px, 12px)`, visibility: boardWidth === 0 ? 'hidden' : 'visible' }}>
                            {numbers.map((num, i) => <div key={i} className="flex-1 flex items-center justify-center text-sm font-semibold">{num}</div>)}
                        </div>
                    )}
                    <div
                        ref={boardRef}
                        className="grid grid-cols-8 grid-rows-8 max-w-full max-h-full border-4 border-gray-700 rounded-md overflow-hidden"
                        style={{ width: boardWidth, height: boardWidth, position: 'relative', visibility: boardWidth === 0 ? 'hidden' : 'visible' }}
                    >
                        {currentBoard.flat().map((piece, i) => {
                            const algebraicSquare = getAlgebraicSquare(i);
                            const isDark = (Math.floor(i / 8) + (i % 8)) % 2 !== 0;
                            const isDragged = draggedPiece?.fromSquare === algebraicSquare;

                            const isSelected = selectedSquare === algebraicSquare;
                            const isLastMoveFrom = lastMove?.from === algebraicSquare;
                            const isLastMoveTo = lastMove?.to === algebraicSquare;
                            const isHoveredTarget = hoveredTargetSquare === algebraicSquare;
                            const isPossibleMoveTarget = possibleMoves.includes(algebraicSquare);
                            const isPreMove = preMoves.some(move => move.from === algebraicSquare || move.to === algebraicSquare);
                            const isHintSquare = hintSquare === algebraicSquare;

                            let bgColorClass = isDark ? "bg-sky-700" : "bg-slate-100";

                            if (algebraicSquare === incorrectSquare) bgColorClass = "bg-red-200";
                            else if (isPreMove) bgColorClass = "bg-red-100";
                            else if (isLastMoveFrom) bgColorClass = "bg-blue-300";
                            else if (isLastMoveTo) bgColorClass = "bg-blue-200";
                            else if (isSelected) bgColorClass = "bg-indigo-200";
                            else if (isHintSquare) bgColorClass = "bg-yellow-300";
                            if (isHoveredTarget) bgColorClass = "bg-indigo-100";


                            return (
                                <div
                                    key={i}
                                    className={`relative flex items-center justify-center ${bgColorClass}`}
                                    style={{ width: squareSize, height: squareSize }}
                                    onMouseDown={(e) => handleMouseDown(e, piece || undefined, algebraicSquare)}
                                    onClick={() => handleSquareClick(algebraicSquare)}
                                >
                                    {isPossibleMoveTarget && (
                                        <div
                                            className={`absolute rounded-full ${piece ? 'border-4 border-slate-400' : 'bg-slate-400 opacity-50'}`}
                                            style={{ width: piece ? '100%' : '30%', height: piece ? '100%' : '30%', zIndex: 1, transform: piece ? 'scale(0.9)' : 'none' }}
                                        ></div>
                                    )}
                                    {!isDragged && piece && (
                                        <img
                                            src={getPieceImage(piece)}
                                            draggable={false}
                                            alt={`${piece?.color} ${piece?.type}`}
                                            style={{
                                                width: '75%',
                                                height: '75%',
                                                objectFit: 'contain',
                                                cursor: (canMoveAnyPiece || (piece?.color === userColor && isPlayerTurn)) ? 'grab' : 'default',
                                                userSelect: 'none',
                                                zIndex: 3
                                            }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                        {draggedPiece && draggedPosition && (
                            <img
                                src={getPieceImage(draggedPiece.piece) || ''}
                                draggable={false}
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
                    <div className="grid grid-cols-8" style={{ width: boardWidth > 0 ? boardWidth : 'auto', marginLeft: `min(${boardWidth * 0.04}px, 12px)`, marginTop: `min(${boardWidth * 0.02}px, 6px)`, visibility: boardWidth === 0 ? 'hidden' : 'visible' }}>
                        {letters.map((letter, i) => <div key={i} className="text-center text-sm font-semibold">{letter}</div>)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChessBoard;