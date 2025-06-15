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

const ChessBoard: React.FC<ChessBoardProps> = ({ showLabels, game, onMoveAttempt, isPlayerTurn, incorrectSquare, showLastMoveHighlight = true, userColor }) => {
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

    // Update gameRef whenever the game prop changes
    useEffect(() => {
        gameRef.current = game;
    }, [game]);

// Effect 1: Update lastMove based on game history & showLastMoveHighlight (only if no premoves or not player's turn)
useEffect(() => {
    if (isPlayerTurn && preMoves.length > 0) {
        // Don't update lastMove here; let the premove effect handle it
        return;
    }
    const history = game.history({ verbose: true });
    if (showLastMoveHighlight && history.length > 0) {
        const last = history[history.length - 1];
        setLastMove({ from: last.from, to: last.to });
        console.log("Setting lastMove from history", last);
    } else {
        setLastMove(null);
        console.log("Clearing lastMove (no premove, no history or highlight off)");
    }
}, [game, showLastMoveHighlight, isPlayerTurn, preMoves]);

// Effect 2: Handle premove attempts, check legality, move or clear lastMove immediately
useEffect(() => {
    if (isPlayerTurn && preMoves.length > 0) {
        const nextPreMove = preMoves[0];
        const legalMoves = game.moves({ verbose: true });
        const isPreMoveLegal = legalMoves.some(
            move => move.from === nextPreMove.from && move.to === nextPreMove.to
        );

        if (isPreMoveLegal) {
            console.log("Premove is legal:", nextPreMove);
            onMoveAttempt(nextPreMove.from, nextPreMove.to, nextPreMove.promotion);
            setPreMoves(prev => prev.slice(1));
            // Let effect 1 update lastMove on next render/game update
        } else {
            console.log("Premove is NOT legal, clearing lastMove highlight immediately");
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

    const handleSquareClick = useCallback((clickedSquare: Square) => {
        // Prevent any click interaction if it's the very first turn and computer's turn
        if (!isPlayerTurn && game.history().length === 0) {
            console.log("Click prevented: It's the first move and computer's turn.");
            return;
        }

        setDraggedPiece(null);
        setDraggedPosition(null);
        document.body.style.cursor = 'default';

        if (selectedSquare) {
            if (selectedSquare === clickedSquare) {
                setSelectedSquare(null);
                setPossibleMoves([]);
                return;
            }

            const pieceToMove = game.get(selectedSquare);
            const pieceOnClickedSquare = game.get(clickedSquare);

            if (pieceOnClickedSquare && pieceOnClickedSquare.color === userColor) {
                setSelectedSquare(clickedSquare);
                setPossibleMoves(game.moves({ square: clickedSquare, verbose: true }).map(move => move.to) as Square[]);
                return;
            }

            let promotionPiece: 'q' | 'r' | 'b' | 'n' | undefined = undefined;
            if (pieceToMove?.type === 'p' && (
                (pieceToMove.color === 'w' && clickedSquare.endsWith('8')) ||
                (pieceToMove.color === 'b' && clickedSquare.endsWith('1'))
            )) {
                promotionPiece = 'q';
            }

            if (isPlayerTurn) {
                onMoveAttempt(selectedSquare, clickedSquare, promotionPiece);
            } else {
                // Prevent premove if it's the very first move and computer's turn
                if (game.history().length === 0) {
                    console.log("Preventing premove: It's the first move and computer's turn.");
                    return;
                }
                setPreMoves(prev => [...prev, { from: selectedSquare, to: clickedSquare, promotion: promotionPiece }]);
            }
            setSelectedSquare(null);
            setPossibleMoves([]);
        } else {
            const pieceOnClickedSquare = game.get(clickedSquare);
            if (pieceOnClickedSquare && pieceOnClickedSquare.color === userColor) {
                setSelectedSquare(clickedSquare);
                if (isPlayerTurn) {
                    setPossibleMoves(game.moves({ square: clickedSquare, verbose: true }).map(move => move.to) as Square[]);
                }
            }
        }
    }, [game, onMoveAttempt, selectedSquare, isPlayerTurn, userColor]);

    // *** HANDLERS REORDERED HERE ***

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

                if (isPlayerTurn) {
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

            if (isPlayerTurn) {
                setPossibleMoves(gameRef.current?.moves({ square: currentInteraction.square, verbose: true }).map(move => move.to) as Square[] || []);
            }
            setSelectedSquare(null);
            document.body.style.cursor = 'grabbing';
        }
    }, [draggedPieceVisualHeight, draggedPieceVisualWidth, squareSize, getAlgebraicSquare, isPlayerTurn]);

    const handleMouseUp = useCallback((e: MouseEvent) => {
        const currentInteraction = interactionState.current;

        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);

        setHoveredTargetSquare(null);
        setPossibleMoves([]);

        if (currentInteraction?.isDragging) {
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
                        if (isPlayerTurn) {
                            onMoveAttempt(currentInteraction.square, toSquare, promotionPiece);
                        } else {
                            // Prevent premove if it's the very first move and computer's turn
                            if (game.history().length === 0) {
                                console.log("Preventing premove: It's the first move and computer's turn.");
                                return;
                            }
                            setPreMoves(prev => [...prev, { from: currentInteraction.square, to: toSquare, promotion: promotionPiece }]);
                        }
                    }
                }
            }
        }

        interactionState.current = null;
        setDraggedPiece(null);
        setDraggedPosition(null);
        document.body.style.cursor = 'default';
        setSelectedSquare(null);
    }, [onMoveAttempt, squareSize, getAlgebraicSquare, isPlayerTurn, handleMouseMove, game]);

    const handleMouseDown = useCallback((e: React.MouseEvent, piece: Piece | undefined, square: Square) => {
        e.preventDefault();
        // Prevent any interaction if it's the very first turn and computer's turn
        if (!isPlayerTurn && game.history().length === 0) {
            console.log("Mouse down prevented: It's the first move and computer's turn.");
            return;
        }

        if (e.button !== 0 || !piece || piece.color !== userColor) {
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
    }, [handleMouseMove, handleMouseUp, userColor, isPlayerTurn, game]); // Added game to dependencies

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

                            let bgColorClass = isDark ? "bg-sky-700" : "bg-slate-100";

                            if (algebraicSquare === incorrectSquare) bgColorClass = "bg-red-200";
                            else if (isPreMove) bgColorClass = "bg-red-100";
                            else if (isLastMoveFrom) bgColorClass = "bg-blue-300";
                            else if (isLastMoveTo) bgColorClass = "bg-blue-200";
                            else if (isSelected) bgColorClass = "bg-indigo-200";
                            // This check should be last to override others
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
                                                // Change cursor to 'not-allowed' if interaction is blocked
                                                cursor: (!isPlayerTurn && game.history().length === 0) ? 'default' : (piece?.color === userColor ? 'grab' : 'default'),
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