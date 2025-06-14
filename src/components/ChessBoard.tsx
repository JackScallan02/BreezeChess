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
        // If it's not the player's turn, do nothing.
        if (isPlayerTurn !== undefined && !isPlayerTurn) return;

        // If a piece is already selected
        if (selectedSquare) {
            // Case 1: Clicking the same square -> deselect the current piece
            if (selectedSquare === clickedSquare) {
                setSelectedSquare(null);
                setPossibleMoves([]);
                return;
            }

            const pieceToMove = game.get(selectedSquare);
            const pieceOnClickedSquare = game.get(clickedSquare);

            // Case 2: Clicking a different square that contains a friendly piece -> select the new friendly piece
            if (pieceOnClickedSquare && pieceOnClickedSquare.color === game.turn()) {
                setSelectedSquare(clickedSquare);
                // Calculate and display possible moves for the newly selected piece
                const moves = game.moves({ square: clickedSquare, verbose: true }).map(move => move.to);
                setPossibleMoves(moves as Square[]);
                return;
            }

            // Case 3: Clicking an empty square or an opponent's piece -> attempt a move
            if (pieceToMove && pieceToMove.color === game.turn()) { // Ensure the currently selected piece belongs to the player
                // Determine if it's a pawn promotion move (default to queen for simplicity)
                let promotionPiece: 'q' | 'r' | 'b' | 'n' | undefined = undefined;
                if (pieceToMove.type === 'p' && (
                    (pieceToMove.color === 'w' && clickedSquare.endsWith('8')) ||
                    (pieceToMove.color === 'b' && clickedSquare.endsWith('1'))
                )) {
                    promotionPiece = 'q';
                }

                // Attempt to make the move. The external onMoveAttempt function will handle game logic.
                onMoveAttempt(selectedSquare, clickedSquare, promotionPiece);
                // Clear selection and possible moves after attempting a move.
                // The board will re-render based on game state updates from onMoveAttempt.
                setSelectedSquare(null);
                setPossibleMoves([]);
                return;
            } else {
                // If a piece was selected but the clicked square is not a valid move target or a friendly piece,
                // and the pieceToMove is not ours, deselect everything. This acts as a fallback.
                setSelectedSquare(null);
                setPossibleMoves([]);
            }

        } else { // No piece is currently selected
            const pieceOnClickedSquare = game.get(clickedSquare);
            // If the clicked square has a piece belonging to the current player, select it.
            if (pieceOnClickedSquare && pieceOnClickedSquare.color === game.turn()) {
                setSelectedSquare(clickedSquare);
                // Calculate and display possible moves for the newly selected piece.
                const moves = game.moves({ square: clickedSquare, verbose: true }).map(move => move.to);
                setPossibleMoves(moves as Square[]);
            }
            // If the clicked square is empty or has an opponent's piece and nothing is selected, do nothing.
        }
    }, [game, onMoveAttempt, selectedSquare, isPlayerTurn]); // Added isPlayerTurn to dependencies


    // Handles the mouse up event (end of a click or drag)
    const handleMouseUp = useCallback((e: MouseEvent) => {
        // Always remove event listeners when the mouse button is released
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);

        // If it's not the player's turn, reset state and exit.
        if (isPlayerTurn !== undefined && !isPlayerTurn) {
            interactionState.current = null;
            setDraggedPiece(null);
            setDraggedPosition(null);
            document.body.style.cursor = 'default';
            return;
        }

        // Only process drag-end logic if a drag was actually initiated
        if (interactionState.current && interactionState.current.isDragging) {
            if (boardRef.current) {
                const boardRect = boardRef.current.getBoundingClientRect();
                const mouseX = e.clientX - boardRect.left;
                const mouseY = e.clientY - boardRect.top;

                // Calculate the target square based on the mouse position at release
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
        }

        // Reset all drag-related state variables, regardless of whether it was a drag or a simple click
        interactionState.current = null;
        setDraggedPiece(null); // Clear the dragged piece visual
        setDraggedPosition(null);
        document.body.style.cursor = 'default';

        // Important: Simple clicks (non-drag) are now solely handled by the `onClick` handler on the square div.
    }, [onMoveAttempt, squareSize, getAlgebraicSquare, game, isPlayerTurn]);


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
            e.preventDefault(); // Prevent default browser drag behavior (e.g., image ghosting)

            // Set the dragged piece state to trigger the visual feedback
            setDraggedPiece({
                piece: interactionState.current.piece,
                fromSquare: interactionState.current.square,
            });
            // Clear any click-based selection when a drag starts, as drag-and-drop will handle the move.
            setSelectedSquare(null);
            setPossibleMoves([]);
            document.body.style.cursor = 'grabbing';
        }
    }, [draggedPieceVisualHeight, draggedPieceVisualWidth]);


    // Handles the mouse down event (start of a click or drag)
    const handleMouseDown = useCallback((e: React.MouseEvent, piece: Piece | undefined, square: Square) => {
        // Only proceed if it's the player's turn, it's a left mouse click (button 0),
        // there's a piece, and that piece belongs to the current player.
        if ((isPlayerTurn !== undefined && !isPlayerTurn) || e.button !== 0 || !piece || game.turn() !== piece.color) {
            return;
        }

        // Initialize interactionState ref
        interactionState.current = {
            piece,
            square,
            isDragging: false, // Initially, we assume it's a click, not a drag
            startX: e.clientX,
            startY: e.clientY,
        };

        // Removed the immediate setting of draggedPiece and draggedPosition here.
        // These will now only be set in handleMouseMove once a drag threshold is met.

        // Add event listeners to the window for tracking mouse movement (for potential drag) and release
        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
    }, [game, handleMouseMove, handleMouseUp, draggedPieceVisualWidth, draggedPieceVisualHeight, isPlayerTurn]);


    // Guard against `game` being undefined before accessing its properties.
    // If `game` is not provided, render nothing or a loading indicator.
    if (!game) {
        // You might want to render a loading spinner or a message here instead.
        return (
            <div className="flex justify-center items-center w-full h-full text-black dark:text-white">
                Loading Chess Board...
            </div>
        );
    }

    const currentBoard = game.board(); // Get the current state of the board from the game object

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
                                    // The onClick handler is now the sole entry point for non-drag clicks
                                    onClick={() => handleSquareClick(algebraicSquare)}
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
                                            draggable={false} // Prevent native browser drag
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
                                    pointerEvents: 'none', // Ensures mouse events pass through to the board below
                                    zIndex: 1000, // Ensure the dragged piece is on top
                                    transform: 'scale(0.9)', // Slightly scale down for visual effect
                                    filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))', // Add a shadow
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
