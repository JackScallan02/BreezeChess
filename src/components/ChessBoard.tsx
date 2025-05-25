import React, { useRef, useEffect, useState, useCallback } from "react";
import { Chess, Square, Piece } from 'chess.js';

interface props {
    showLabels: boolean;
}

interface DraggedPieceState {
    piece: Piece;
    fromSquare: Square;
}

const ChessBoard: React.FC<props> = ({ showLabels }) => {
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
    const [game] = useState(new Chess());
    const [fen, setFen] = useState(game.fen());

    const [draggedPiece, setDraggedPiece] = useState<DraggedPieceState | null>(null);
    const [draggedPosition, setDraggedPosition] = useState<{ x: number, y: number } | null>(null);

    const [isGameOver, setIsGameOver] = useState(false);
    const [gameResult, setGameResult] = useState<string | null>(null);

    const squareSize = boardWidth / 8;
    // We use squareSize directly for the dragged piece visual size for simplicity,
    // or you can keep 0.75 if you prefer a smaller dragged piece.
    // Using squareSize might make centering feel more direct. Let's try squareSize.
    const draggedPieceVisualWidth = squareSize;
    const draggedPieceVisualHeight = squareSize;

    useEffect(() => {
        const updateBoardWidth = () => {
            if (boardRef.current) {
                setBoardWidth(boardRef.current.offsetWidth);
            }
        };

        updateBoardWidth();
        window.addEventListener("resize", updateBoardWidth);
        return () => window.removeEventListener("resize", updateBoardWidth);
    }, []);

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

    // Updated handleMouseDown to center the piece under the cursor.
    const handleMouseDown = useCallback((e: React.MouseEvent, piece: Piece, fromSquare: Square) => {
        if (isGameOver || !boardRef.current) return;

        e.preventDefault();

        const boardRect = boardRef.current.getBoundingClientRect();

        setDraggedPiece({ piece, fromSquare });

        // Calculate initial position: Center of the piece under the mouse cursor.
        setDraggedPosition({
            x: e.clientX - boardRect.left - (draggedPieceVisualWidth / 2),
            y: e.clientY - boardRect.top - (draggedPieceVisualHeight / 2),
        });

        document.body.style.cursor = 'grabbing';
    }, [isGameOver, draggedPieceVisualWidth, draggedPieceVisualHeight]);

    // Updated handleMouseMove to keep the piece centered.
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

            // Use the *center* of the dragged piece for dropping calculation
            const mouseX = (draggedPosition?.x ?? (e.clientX - boardRect.left)) + (draggedPieceVisualWidth / 2);
            const mouseY = (draggedPosition?.y ?? (e.clientY - boardRect.top)) + (draggedPieceVisualHeight / 2);


            const col = Math.floor(mouseX / squareSize);
            const row = Math.floor(mouseY / squareSize);

            if (col >= 0 && col < 8 && row >= 0 && row < 8) {
                const targetIndex = row * 8 + col;
                const toSquare = getAlgebraicSquare(targetIndex);

                try {
                    // Check for promotion move (pawn reaching the last rank)
                    const piece = game.get(draggedPiece.fromSquare);
                    const isPawn = piece && piece.type === 'p';
                    const isPromotion = (isPawn && ((piece.color === 'w' && toSquare[1] === '8') || (piece.color === 'b' && toSquare[1] === '1')));

                    const moveResult = game.move({
                        from: draggedPiece.fromSquare,
                        to: toSquare,
                        // Always promote to a Queen for simplicity in this example.
                        // You might want to implement a UI for promotion choice.
                        promotion: isPromotion ? 'q' : undefined,
                     });

                    if (moveResult) {
                        setFen(game.fen());

                        // Check game over states
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
                        } // Add other draw conditions if needed

                    }
                } catch (error) {
                    // Invalid move, snap back (by resetting draggedPiece)
                    console.log("Invalid move:", error);
                }
            }
        }

        setDraggedPiece(null);
        setDraggedPosition(null);
        document.body.style.cursor = 'default';
    }, [draggedPiece, game, getAlgebraicSquare, squareSize, draggedPosition, draggedPieceVisualWidth, draggedPieceVisualHeight]); // Added dependencies


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

    // Use game.board() to render pieces for better synchronization with chess.js state
    const currentBoard = game.board();

    return (
        <div className="flex justify-center items-center w-full h-full text-black dark:text-white overflow-hidden" style={{ padding: "2rem", boxSizing: "border-box" }}>
            <div className="flex flex-col items-center" style={{ minHeight: "300px", minWidth: "300px" }}>
                <div className="flex">
                    {showLabels && (
                        <div className="flex flex-col justify-between" style={{ height: boardWidth, marginRight: `min(${sideLabelWidth}px, 12px)` }}>
                            {numbers.map((num, i) => (
                                <div key={i} className="flex-1 flex items-center justify-center text-sm">{num}</div>
                            ))}
                        </div>
                    )}
                    <div
                        ref={boardRef}
                        className="grid grid-cols-8 grid-rows-8 max-w-full max-h-full min-w-[300px] min-h-[300px] border border-black" // Added border for clarity
                        style={{
                            width: "min(85vmin, calc(100vh - 4rem - 48px), calc(100vw - 4rem - 48px))",
                            height: "min(85vmin, calc(100vh - 4rem - 48px), calc(100vw - 4rem - 48px))",
                            position: 'relative', // <-- Key Fix: Added position relative
                        }}
                    >
                        {currentBoard.flat().map((piece, i) => { // Use game.board()
                            const row = Math.floor(i / 8);
                            const col = i % 8;
                            const isDark = (row + col) % 2 !== 0; // Fixed dark square logic
                            const algebraicSquare = getAlgebraicSquare(i);
                            const pieceImage = getPieceImage(piece || undefined); // Handle null
                            const isDragged = draggedPiece?.fromSquare === algebraicSquare;

                            return (
                                <div
                                    key={i}
                                    className={`${isDark ? "bg-sky-700" : "bg-slate-100"} relative flex items-center justify-center`} // Changed dark color for contrast
                                    style={{ width: squareSize, height: squareSize }}
                                >
                                    {/* Render piece only if it's NOT the one being dragged */}
                                    {!isDragged && pieceImage && (
                                        <img
                                            src={pieceImage}
                                            alt={`${piece?.color} ${piece?.type}`}
                                            style={{
                                                width: '75%', // Keep 75% for stationary pieces
                                                height: '75%',
                                                objectFit: 'contain',
                                                cursor: game.turn() === piece?.color ? 'grab' : 'default', // Only allow dragging current turn's pieces
                                            }}
                                            onMouseDown={(e) => {
                                                if (piece && game.turn() === piece.color) { // Check turn before dragging
                                                   handleMouseDown(e, piece, algebraicSquare);
                                                }
                                            }}
                                        />
                                    )}
                                </div>
                            );
                        })}
                        {/* Render the dragged piece */}
                        {draggedPiece && draggedPosition && (
                            <img
                                src={getPieceImage(draggedPiece.piece) || ''}
                                alt=""
                                style={{
                                    position: 'absolute',
                                    left: `${draggedPosition.x}px`, // Use template literals
                                    top: `${draggedPosition.y}px`,  // Use template literals
                                    width: `${draggedPieceVisualWidth}px`, // Use template literals
                                    height: `${draggedPieceVisualHeight}px`, // Use template literals
                                    objectFit: 'contain',
                                    pointerEvents: 'none',
                                    zIndex: 1000,
                                    // Make the dragged piece slightly larger and centered
                                    transform: 'scale(0.9)',
                                }}
                            />
                        )}
                    </div>
                </div>
                {showLabels && (
                    <div className="grid grid-cols-8" style={{ width: boardWidth, marginLeft: `min(${sideLabelWidth}px, 12px)`, marginTop: `min(${bottomLabelMarginTop}px, 6px)` }}>
                        {letters.map((letter, i) => (
                            <div key={i} className="text-center text-sm">{letter}</div>
                        ))}
                    </div>
                )}
                {isGameOver && gameResult && (
                    <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white dark:bg-gray-800 p-3 rounded-lg shadow-lg text-lg font-bold">
                        {gameResult}
                    </div>
                )}
            </div>
        </div>
    );
};

export default ChessBoard;