import React, { useRef, useEffect, useState, useCallback } from "react";
import { Chess, Square, Piece } from 'chess.js';

interface ChessBoardProps {
  showLabels: boolean;
  game: Chess;
  onMoveAttempt: (from: Square, to: Square, promotion?: 'q' | 'r' | 'b' | 'n') => void;
  incorrectSquare?: string | null;
  isPlayerTurn?: boolean | undefined;
  showLastMoveHighlight?: boolean;
  userColor: 'w' | 'b' | null;
  hintSquare?: Square | null;
  canMoveAnyPiece?: boolean;
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
  const animatedPieceRef = useRef<HTMLDivElement>(null);
  const squareRefs = useRef(new Map<Square, HTMLDivElement>());

  const [boardWidth, setBoardWidth] = useState(0);
  const [draggedPiece, setDraggedPiece] = useState<DraggedPieceState | null>(null);
  const [draggedPosition, setDraggedPosition] = useState<{ x: number; y: number } | null>(null);
  const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
  const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);
  const [hoveredTargetSquare, setHoveredTargetSquare] = useState<Square | null>(null);
  const [lastMove, setLastMove] = useState<LastMove | null>(null);
  const [preMoves, setPreMoves] = useState<PreMove[]>([]);
  const [animatingPiece, setAnimatingPiece] = useState<{ piece: Piece, from: Square, to: Square, startX: number, startY: number, endX: number, endY: number } | null>(null);

  const gameRef = useRef<Chess | null>(null);
  const animationCompletedRef = useRef(false);

  const currentSquareSize = boardWidth > 0 ? boardWidth / 8 : 0;
  const currentPieceVisualSize = currentSquareSize * 0.75;

  useEffect(() => {
    gameRef.current = game;
  }, [game]);

  useEffect(() => {
    if (animatingPiece && animatedPieceRef.current) {
      animationCompletedRef.current = false;
      const element = animatedPieceRef.current;
      const duration = 200;

      element.style.transition = 'none';
      element.style.transform = `translate(${animatingPiece.startX}px, ${animatingPiece.startY}px)`;
      element.offsetHeight; // Force reflow to apply start position before transition
      element.style.transition = `transform ${duration}ms ease-out`;
      element.style.transform = `translate(${animatingPiece.endX}px, ${animatingPiece.endY}px)`;

      const handleTransitionEnd = () => {
        animationCompletedRef.current = true;
        element.removeEventListener('transitionend', handleTransitionEnd);
        setAnimatingPiece(null);

        const pieceToMove = animatingPiece.piece;
        let promotionPiece: 'q' | 'r' | 'b' | 'n' | undefined = undefined;
        if (pieceToMove?.type === 'p' &&
          ((pieceToMove.color === 'w' && animatingPiece.to.endsWith('8')) ||
            (pieceToMove.color === 'b' && animatingPiece.to.endsWith('1')))) {
          promotionPiece = 'q'; // Default to queen promotion
        }
        onMoveAttempt(animatingPiece.from, animatingPiece.to, promotionPiece);
      };
      element.addEventListener('transitionend', handleTransitionEnd);
      return () => {
        if (element) {
          element.removeEventListener('transitionend', handleTransitionEnd);
        }
      };
    }
  }, [animatingPiece, onMoveAttempt]);


  const getAlgebraicSquare = useCallback((index: number): Square => {
    const file = String.fromCharCode(97 + (index % 8));
    const rank = numbers[Math.floor(index / 8)];
    return (file + rank) as Square;
  }, [numbers]);


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


  const getPieceImage = (piece: Piece | undefined): string | null => {
    if (piece) return `https://images.chesscomfiles.com/chess-themes/pieces/neo/150/${piece.color}${piece.type}.png`;
    return null;
  };

  // *** FIXED: This function now correctly calculates coordinates by accounting for the board's border ***
  const getCoordsFromRefs = useCallback((from: Square, to: Square) => {
    const boardEl = boardRef.current;
    const startSquareEl = squareRefs.current.get(from);
    const endSquareEl = squareRefs.current.get(to);

    if (!boardEl || !startSquareEl || !endSquareEl) {
      return null;
    }

    const boardRect = boardEl.getBoundingClientRect();
    const startSquareRect = startSquareEl.getBoundingClientRect();
    const endSquareRect = endSquareEl.getBoundingClientRect();

    // The absolutely positioned animating piece is relative to the board's padding box.
    // getBoundingClientRect() is relative to the viewport and includes the border.
    // We must account for the board's border to align the animation correctly.
    const boardStyle = window.getComputedStyle(boardEl);
    const boardBorderLeft = parseFloat(boardStyle.borderLeftWidth);
    const boardBorderTop = parseFloat(boardStyle.borderTopWidth);

    // The offset needed to center the piece within its square.
    const pieceOffsetX = (startSquareRect.width - currentPieceVisualSize) / 2;
    const pieceOffsetY = (startSquareRect.height - currentPieceVisualSize) / 2;

    // Calculate start position: square's position relative to board's viewport position, 
    // minus the board's border, plus the centering offset.
    const startX = (startSquareRect.left - boardRect.left - boardBorderLeft) + pieceOffsetX;
    const startY = (startSquareRect.top - boardRect.top - boardBorderTop) + pieceOffsetY;

    // Calculate end position similarly.
    const endX = (endSquareRect.left - boardRect.left - boardBorderLeft) + pieceOffsetX;
    const endY = (endSquareRect.top - boardRect.top - boardBorderTop) + pieceOffsetY;

    return { startX, startY, endX, endY };
  }, [currentPieceVisualSize]);

  const handleSquareClick = useCallback((clickedSquare: Square) => {
    if (interactionState.current?.isDragging) return;
    if (!canMoveAnyPiece && !isPlayerTurn && game.history().length === 0) return;

    if (selectedSquare) {
      if (selectedSquare === clickedSquare) {
        setSelectedSquare(null);
        setPossibleMoves([]);
        return;
      }
      const isMovePossible = possibleMoves.includes(clickedSquare);
      if (isMovePossible) {
        const pieceToMove = game.get(selectedSquare);
        if (pieceToMove && (isPlayerTurn || canMoveAnyPiece)) {
          const coords = getCoordsFromRefs(selectedSquare, clickedSquare);
          if (coords) {
            setAnimatingPiece({
              piece: pieceToMove,
              from: selectedSquare,
              to: clickedSquare,
              ...coords,
            });
          } else {
            onMoveAttempt(selectedSquare, clickedSquare);
          }
        } else {
          let promotionPiece: 'q' | 'r' | 'b' | 'n' | undefined = undefined;
          if (pieceToMove?.type === 'p' && ((pieceToMove.color === 'w' && clickedSquare.endsWith('8')) || (pieceToMove.color === 'b' && clickedSquare.endsWith('1')))) {
            promotionPiece = 'q';
          }
          setPreMoves(prev => [...prev, { from: selectedSquare, to: clickedSquare, promotion: promotionPiece }]);
        }
        setSelectedSquare(null);
        setPossibleMoves([]);
      } else {
        const pieceOnClickedSquare = game.get(clickedSquare);
        if (pieceOnClickedSquare && (canMoveAnyPiece || pieceOnClickedSquare.color === userColor)) {
          setSelectedSquare(clickedSquare);
          if (isPlayerTurn || canMoveAnyPiece) {
            setPossibleMoves(game.moves({ square: clickedSquare, verbose: true }).map(move => move.to));
          }
        } else {
          setSelectedSquare(null);
          setPossibleMoves([]);
        }
      }
    } else {
      const pieceOnClickedSquare = game.get(clickedSquare);
      if (pieceOnClickedSquare && (canMoveAnyPiece || pieceOnClickedSquare.color === userColor)) {
        setSelectedSquare(clickedSquare);
        if (isPlayerTurn || canMoveAnyPiece) {
          setPossibleMoves(game.moves({ square: clickedSquare, verbose: true }).map(move => move.to));
        }
      }
    }
  }, [game, selectedSquare, isPlayerTurn, userColor, canMoveAnyPiece, possibleMoves, getCoordsFromRefs, onMoveAttempt]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const currentInteraction = interactionState.current;
    if (!currentInteraction || !currentInteraction.piece) return;

    if (currentInteraction.isDragging) {
      if (boardRef.current) {
        const boardRect = boardRef.current.getBoundingClientRect();
        const currentMouseX = e.clientX - boardRect.left;
        const currentMouseY = e.clientY - boardRect.top;

        setDraggedPosition({ x: currentMouseX - currentSquareSize / 2, y: currentMouseY - currentSquareSize / 2 });
        const col = Math.floor(currentMouseX / currentSquareSize);
        const row = Math.floor(currentMouseY / currentSquareSize);
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
      setDraggedPiece({ piece: currentInteraction.piece, fromSquare: currentInteraction.square });
      if (isPlayerTurn || canMoveAnyPiece) {
        setPossibleMoves(gameRef.current?.moves({ square: currentInteraction.square, verbose: true }).map(move => move.to) as Square[] || []);
      }
      setSelectedSquare(null);
      document.body.style.cursor = 'grabbing';
    }
  }, [currentSquareSize, getAlgebraicSquare, isPlayerTurn, canMoveAnyPiece]);

  const handleMouseUp = useCallback((e: MouseEvent) => {
    const currentInteraction = interactionState.current;
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    if (currentInteraction?.isDragging) {
      setHoveredTargetSquare(null);
      setPossibleMoves([]);
      if (boardRef.current) {
        const boardRect = boardRef.current.getBoundingClientRect();
        const mouseX = e.clientX - boardRect.left;
        const mouseY = e.clientY - boardRect.top;
        const col = Math.floor(mouseX / currentSquareSize);
        const row = Math.floor(mouseY / currentSquareSize);
        if (col >= 0 && col < 8 && row >= 0 && row < 8) {
          const toSquare = getAlgebraicSquare(row * 8 + col);
          if (currentInteraction.square !== toSquare) {
            const pieceToMove = gameRef.current?.get(currentInteraction.square);
            if (isPlayerTurn || canMoveAnyPiece) {
              const coords = getCoordsFromRefs(currentInteraction.square, toSquare);
              if (coords) {
                setAnimatingPiece({
                  piece: currentInteraction.piece,
                  from: currentInteraction.square,
                  to: toSquare,
                  ...coords,
                });
              } else {
                onMoveAttempt(currentInteraction.square, toSquare);
              }
            } else {
              if (!canMoveAnyPiece && game.history().length === 0) {
                console.log("Preventing premove: It's the first move and computer's turn.");
              } else {
                let promotionPiece: 'q' | 'r' | 'b' | 'n' | undefined = undefined;
                if (pieceToMove?.type === 'p' && ((pieceToMove.color === 'w' && toSquare.endsWith('8')) || (pieceToMove.color === 'b' && toSquare.endsWith('1')))) {
                  promotionPiece = 'q';
                }
                setPreMoves(prev => [...prev, { from: currentInteraction.square, to: toSquare, promotion: promotionPiece }]);
              }
            }
          }
        }
      }
      setDraggedPiece(null);
      setDraggedPosition(null);
      document.body.style.cursor = 'default';
      setSelectedSquare(null);
    }
    interactionState.current = null;
  }, [currentSquareSize, getAlgebraicSquare, isPlayerTurn, handleMouseMove, game, canMoveAnyPiece, getCoordsFromRefs, onMoveAttempt]);

  const handleMouseDown = useCallback((e: React.MouseEvent, piece: Piece | undefined, square: Square) => {
    e.preventDefault();
    if (!canMoveAnyPiece && !isPlayerTurn && game.history().length === 0) return;
    if (e.button !== 0 || !piece || (!canMoveAnyPiece && piece.color !== userColor)) return;

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
              else if (isHintSquare) bgColorClass = "bg-amber-100";
              if (isHoveredTarget) bgColorClass = "bg-indigo-100";
              const isHiddenDuringAnimation = animatingPiece && (animatingPiece.from === algebraicSquare || animatingPiece.to === algebraicSquare);
              return (
                <div
                  key={i}
                  ref={el => {
                    if (el) squareRefs.current.set(algebraicSquare, el);
                    else squareRefs.current.delete(algebraicSquare);
                  }}
                  className={`relative flex items-center justify-center ${bgColorClass}`}
                  style={{ width: currentSquareSize, height: currentSquareSize }}
                  onMouseDown={(e) => handleMouseDown(e, piece || undefined, algebraicSquare)}
                  onClick={() => handleSquareClick(algebraicSquare)}
                >
                  {isPossibleMoveTarget && (<div className={`absolute rounded-full ${piece ? 'border-4 border-slate-400' : 'bg-slate-400 opacity-50'}`} style={{ width: piece ? '100%' : '30%', height: piece ? '100%' : '30%', zIndex: 1, transform: piece ? 'scale(0.9)' : 'none' }}></div>)}
                  {piece && !isDragged && (<img src={getPieceImage(piece)} draggable={false} alt={`${piece?.color} ${piece?.type}`} style={{ width: '75%', height: '75%', objectFit: 'contain', cursor: (canMoveAnyPiece || (piece?.color === userColor && isPlayerTurn)) ? 'grab' : 'default', userSelect: 'none', zIndex: 3, visibility: isHiddenDuringAnimation ? 'hidden' : 'visible' }} />)}
                </div>
              );
            })}
            {draggedPiece && draggedPosition && (<img src={getPieceImage(draggedPiece.piece) || ''} draggable={false} alt="" style={{ position: 'absolute', left: `${draggedPosition.x}px`, top: `${draggedPosition.y}px`, width: `${currentSquareSize}px`, height: `${currentSquareSize}px`, objectFit: 'contain', pointerEvents: 'none', zIndex: 1000, transform: 'scale(0.9)', filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))' }} />)}
            {animatingPiece && (<div ref={animatedPieceRef} style={{ position: 'absolute', top: 0, left: 0, width: `${currentPieceVisualSize}px`, height: `${currentPieceVisualSize}px`, pointerEvents: 'none', zIndex: 999 }}> <img src={getPieceImage(animatingPiece.piece) || ''} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /> </div>)}
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