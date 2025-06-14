import React, { useRef, useEffect, useState, useCallback } from "react";
import { Chess, Square, Piece } from 'chess.js';

// ChessBoard Component
interface ChessBoardProps {
    showLabels: boolean;
    game: Chess;
    onBoardReady?: (isReady: boolean) => void;
    onMoveAttempt: (from: Square, to: Square, promotion?: 'q' | 'r' | 'b' | 'n') => void; // Added promotion
    incorrectSquare?: string | null;
    isPlayerTurn?: boolean | undefined;
}

interface DraggedPieceState {
    piece: Piece;
    fromSquare: Square;
}

interface InteractionState {
    piece: Piece; // The piece that started the interaction
    square: Square; // The square where the interaction started
    isDragging: boolean;
    startX: number;
    startY: number;
}

const ChessBoard: React.FC<ChessBoardProps> = ({ showLabels, game, onMoveAttempt, isPlayerTurn, incorrectSquare }) => {
    const letters = ["a", "b", "c", "d", "e", "f", "g", "h"];
    const numbers = [8, 7, 6, 5, 4, 3, 2, 1];

    const boardRef = useRef<HTMLDivElement>(null);
    const interactionState = useRef<InteractionState | null>(null);

    const [boardWidth, setBoardWidth] = useState(0);
    const [draggedPiece, setDraggedPiece] = useState<DraggedPieceState | null>(null);
    const [draggedPosition, setDraggedPosition] = useState<{ x: number; y: number } | null>(null);
    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
    const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);

    const squareSize = boardWidth > 0 ? boardWidth / 8 : 0;
    const draggedPieceVisualWidth = squareSize;
    const draggedPieceVisualHeight = squareSize;

    // Effect to update board width on resize
    useEffect(() => {
        const updateBoardWidth = () => {
            if (boardRef.current) {
                // Determine board size based on viewport, ensuring a minimum size
                const viewportMin = Math.min(window.innerWidth, window.innerHeight);
                let newBoardWidth = viewportMin * 0.7;
                newBoardWidth = Math.max(newBoardWidth, 300); // Minimum board size
                if (newBoardWidth !== boardWidth) setBoardWidth(newBoardWidth);
            }
        };
        updateBoardWidth(); // Set initial width
        window.addEventListener("resize", updateBoardWidth);
        return () => window.removeEventListener("resize", updateBoardWidth);
    }, [boardWidth]); // Re-run if boardWidth changes

    // Memoized function to get algebraic notation for a square index
    const getAlgebraicSquare = useCallback((index: number): Square => {
        const file = String.fromCharCode(97 + (index % 8)); // 'a' through 'h'
        const rank = numbers[Math.floor(index / 8)]; // 8 through 1
        return (file + rank) as Square;
    }, [numbers]);

    // Helper to get piece image URL
    const getPieceImage = (piece: Piece | undefined): string | null => {
        if (piece) return `https://images.chesscomfiles.com/chess-themes/pieces/neo/150/${piece.color}${piece.type}.png`;
        return null;
    };

    // Handles a click on a square (either to select or to make a move)
    const handleSquareClick = useCallback((clickedSquare: Square) => {
        if (isPlayerTurn !== undefined && !isPlayerTurn) return;
        // If a piece is already selected
        if (selectedSquare) {
            if (selectedSquare === clickedSquare) {
                setSelectedSquare(null);
                setPossibleMoves([]);
                return;
            }

            const pieceToMove = game.get(selectedSquare);

            const pieceOnClickedSquare = game.get(clickedSquare);
            if (pieceOnClickedSquare && pieceOnClickedSquare.color === game.turn()) {
                setSelectedSquare(clickedSquare);
                const moves = game.moves({ square: clickedSquare, verbose: true }).map(move => move.to);
                setPossibleMoves(moves as Square[]);
                return;
            }

            if (pieceToMove && pieceToMove.color === game.turn()) {
                // If it's a pawn promotion move, we'll default to queen promotion for simplicity in UI
                // In a full game, a promotion dialog would appear.
                let promotionPiece: 'q' | 'r' | 'b' | 'n' | undefined = undefined;
                if (pieceToMove.type === 'p' && (
                    (pieceToMove.color === 'w' && clickedSquare.endsWith('8')) ||
                    (pieceToMove.color === 'b' && clickedSquare.endsWith('1'))
                )) {
                    promotionPiece = 'q';
                }

                onMoveAttempt(selectedSquare, clickedSquare, promotionPiece);
                setSelectedSquare(null);
                setPossibleMoves([]);
                return;
            } else {
                setSelectedSquare(null);
                setPossibleMoves([]);
            }

        } else {
            const pieceOnClickedSquare = game.get(clickedSquare);
            if (pieceOnClickedSquare && pieceOnClickedSquare.color === game.turn()) {
                setSelectedSquare(clickedSquare);
                const moves = game.moves({ square: clickedSquare, verbose: true }).map(move => move.to);
                setPossibleMoves(moves as Square[]);
            }
        }
    }, [game, onMoveAttempt, selectedSquare]);

    const handleMouseUp = useCallback((e: MouseEvent) => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);

        if (isPlayerTurn !== undefined && !isPlayerTurn) {
            interactionState.current = null;
            setDraggedPiece(null);
            setDraggedPosition(null);
            document.body.style.cursor = 'default';
            return;
        }

        if (interactionState.current) {
            if (interactionState.current.isDragging) {
                // Drag End Logic
                if (boardRef.current) {
                    const boardRect = boardRef.current.getBoundingClientRect();
                    const mouseX = e.clientX - boardRect.left;
                    const mouseY = e.clientY - boardRect.top;

                    // Calculate the target square based on mouse position
                    const col = Math.floor(mouseX / squareSize);
                    const row = Math.floor(mouseY / squareSize);

                    if (col >= 0 && col < 8 && row >= 0 && row < 8) {
                        const toSquare = getAlgebraicSquare(row * 8 + col);
                        // If the piece was dragged to a different square, attempt the move
                        if (interactionState.current.square !== toSquare) {
                            const pieceToMove = game.get(interactionState.current.square);
                            let promotionPiece: 'q' | 'r' | 'b' | 'n' | undefined = undefined;
                            if (pieceToMove && pieceToMove.type === 'p' && (
                                (pieceToMove.color === 'w' && toSquare.endsWith('8')) ||
                                (pieceToMove.color === 'b' && toSquare.endsWith('1'))
                            )) {
                                promotionPiece = 'q';
                            }
                            onMoveAttempt(interactionState.current.square, toSquare, promotionPiece);
                        }
                    }
                }
            } else {
                if (selectedSquare && selectedSquare !== interactionState.current.square) {
                    const pieceToMove = game.get(selectedSquare);
                    let promotionPiece: 'q' | 'r' | 'b' | 'n' | undefined = undefined;
                    if (pieceToMove && pieceToMove.type === 'p' && (
                        (pieceToMove.color === 'w' && interactionState.current.square.endsWith('8')) ||
                        (pieceToMove.color === 'b' && interactionState.current.square.endsWith('1'))
                    )) {
                        promotionPiece = 'q';
                    }
                    onMoveAttempt(selectedSquare, interactionState.current.square, promotionPiece);
                    setSelectedSquare(null);
                    setPossibleMoves([]);
                } else {
                    handleSquareClick(interactionState.current.square);
                }

            }
        }

        // Reset all drag-related state variables
        interactionState.current = null;
        setDraggedPiece(null); // Clear the dragged piece visual
        setDraggedPosition(null);
        document.body.style.cursor = 'default';

    }, [handleSquareClick, onMoveAttempt, squareSize, getAlgebraicSquare, game]); // Added game to dependencies


    // Handles the mouse move event (during a potential drag)
    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (!interactionState.current) return;

        // If already dragging, just update the visual position of the dragged piece
        if (interactionState.current.isDragging) {
            if (boardRef.current) {
                const boardRect = boardRef.current.getBoundingClientRect();
                setDraggedPosition({
                    x: e.clientX - boardRect.left - draggedPieceVisualWidth / 2,
                    y: e.clientY - boardRect.top - draggedPieceVisualHeight / 2,
                });
            }
            return;
        }

        // Check if the mouse has moved enough to initiate a drag
        const dx = Math.abs(e.clientX - interactionState.current.startX);
        const dy = Math.abs(e.clientY - interactionState.current.startY);
        const dragThreshold = 5; // Pixels to move before considering it a drag

        if (dx > dragThreshold || dy > dragThreshold) {
            interactionState.current.isDragging = true;
            e.preventDefault(); // Prevent default browser drag behavior

            // Set the dragged piece state to trigger the visual feedback
            // This was already here, but combined with the handleMouseDown change, ensures instant visibility.
            setDraggedPiece({
                piece: interactionState.current.piece,
                fromSquare: interactionState.current.square,
            });
            // Clear any click-based selection when a drag starts
            setSelectedSquare(null);
            setPossibleMoves([]);
            document.body.style.cursor = 'grabbing';
        }
    }, [draggedPieceVisualHeight, draggedPieceVisualWidth]);


    // Handles the mouse down event (start of a click or drag)
    const handleMouseDown = useCallback((e: React.MouseEvent, piece: Piece | undefined, square: Square) => {
        if ((isPlayerTurn !== undefined && !isPlayerTurn) || e.button !== 0 || !piece || game.turn() !== piece.color) {
            return;
        }

        // Initialize interactionState ref
        interactionState.current = {
            piece,
            square,
            isDragging: false, // Initially not dragging
            startX: e.clientX,
            startY: e.clientY,
        };

        setDraggedPiece({
            piece: piece,
            fromSquare: square,
        });
        setDraggedPosition({
            x: e.clientX - (boardRef.current?.getBoundingClientRect().left || 0) - draggedPieceVisualWidth / 2,
            y: e.clientY - (boardRef.current?.getBoundingClientRect().top || 0) - draggedPieceVisualHeight / 2,
        });

        // Add event listeners to the window for tracking mouse movement and release
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }, [game, handleMouseMove, handleMouseUp, draggedPieceVisualWidth, draggedPieceVisualHeight]);


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
                            const pieceImage = getPieceImage(piece || undefined);
                            const isDragged = draggedPiece?.fromSquare === algebraicSquare;
                            const isSelected = selectedSquare === algebraicSquare;
                            const isPossibleMove = possibleMoves.includes(algebraicSquare);

                            return (
                                <div
                                    key={i}
                                    className={`relative flex items-center justify-center ${algebraicSquare === incorrectSquare ? "bg-red-200" : isDark ? "bg-sky-700" : "bg-slate-100"}`}
                                    style={{ width: squareSize, height: squareSize }}
                                    onMouseDown={(e) => handleMouseDown(e, piece || undefined, algebraicSquare)}
                                    onClick={() => handleSquareClick(algebraicSquare)} // ✅ This is the key fix
                                >
                                    {/* Visual feedback for selected square */}
                                    {isSelected && <div className="absolute inset-0 bg-amber-200 opacity-70" style={{ zIndex: 1 }}></div>}

                                    {/* Visual feedback for possible moves */}
                                    {isPossibleMove && (
                                        <div
                                            className={`absolute rounded-full ${piece ? 'border-4 border-slate-400' : 'bg-slate-400 opacity-50'}`}
                                            style={{ width: piece ? '100%' : '30%', height: piece ? '100%' : '30%', zIndex: 2, transform: piece ? 'scale(0.9)' : 'none' }}
                                        ></div>
                                    )}
                                    {/* Hide the piece on the board if it's being dragged */}
                                    {!isDragged && pieceImage && (
                                        <img
                                            src={pieceImage}
                                            draggable={false}
                                            alt={`${piece?.color} ${piece?.type}`}
                                            style={{ width: '75%', height: '75%', objectFit: 'contain', cursor: game.turn() === piece?.color ? 'grab' : 'default', userSelect: 'none', zIndex: 3 }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                        {/* This is the piece that follows the cursor during a drag */}
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
                                    pointerEvents: 'none', // Ensures mouse events pass through to the board
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