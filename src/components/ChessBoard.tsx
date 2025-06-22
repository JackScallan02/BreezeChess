import React, { useRef, useEffect, useState, useCallback, forwardRef, useImperativeHandle, useLayoutEffect } from "react";
import { Chess, Square, Piece, Move } from 'chess.js';

// --- TYPE DEFINITIONS (No changes) ---

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
    animationsEnabled?: boolean;
    orientation?: 'w' | 'b';
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

interface AnimatingPieceInfo {
    piece: Piece;
    from: Square;
    to: Square;
    startX: number;
    startY: number;
    endX: number;
    endY: number;
}

export interface ChessBoardHandle {
    resetState: () => void;
}

// --- COMPONENT IMPLEMENTATION ---

const ChessBoard = forwardRef<ChessBoardHandle, ChessBoardProps>(({
    showLabels,
    game,
    onMoveAttempt,
    isPlayerTurn,
    incorrectSquare,
    showLastMoveHighlight = true,
    userColor,
    hintSquare,
    canMoveAnyPiece,
    animationsEnabled = true,
    orientation = 'w'
}, ref) => {
    const letters = orientation === 'w' ? ["a", "b", "c", "d", "e", "f", "g", "h"] : ["h", "g", "f", "e", "d", "c", "b", "a"];
    const numbers = orientation === 'w' ? [8, 7, 6, 5, 4, 3, 2, 1] : [1, 2, 3, 4, 5, 6, 7, 8];

    const mainBoardOuterRef = useRef<HTMLDivElement>(null);
    const boardGridRef = useRef<HTMLDivElement>(null);

    const interactionState = useRef<InteractionState | null>(null);
    const animatedPieceElementsRef = useRef<Map<string, HTMLDivElement | null>>(new Map());
    const squareRefs = useRef(new Map<Square, HTMLDivElement>());

    const [boardWidthForScaling, setBoardWidthForScaling] = useState(0);
    const [draggedPiece, setDraggedPiece] = useState<DraggedPieceState | null>(null);
    const [draggedPosition, setDraggedPosition] = useState<{ x: number; y: number } | null>(null);
    const [selectedSquare, setSelectedSquare] = useState<Square | null>(null);
    const [possibleMoves, setPossibleMoves] = useState<Square[]>([]);
    const [hoveredTargetSquare, setHoveredTargetSquare] = useState<Square | null>(null);
    const [lastMove, setLastMove] = useState<LastMove | null>(null);
    const [preMoves, setPreMoves] = useState<PreMove[]>([]);
    const [animatingPieces, setAnimatingPieces] = useState<AnimatingPieceInfo[]>([]);

    const gameRef = useRef<Chess | null>(null);
    const moveBeingAnimated = useRef<Move | null>(null);

    useImperativeHandle(ref, () => ({
        resetState() {
            setDraggedPiece(null);
            setDraggedPosition(null);
            setSelectedSquare(null);
            setPossibleMoves([]);
            setHoveredTargetSquare(null);
            setLastMove(null);
            setPreMoves([]);
            setAnimatingPieces([]);
            interactionState.current = null;
            moveBeingAnimated.current = null;
            document.body.style.cursor = 'default';
        }
    }));

    const currentSquareSize = boardWidthForScaling > 0 ? boardWidthForScaling / 8 : 0;
    const currentPieceVisualSize = currentSquareSize * 0.75;
    const labelFontSize = Math.max(10, boardWidthForScaling / 35);

    useLayoutEffect(() => {
        const observerTarget = mainBoardOuterRef.current;
        if (!observerTarget) return;

        const resizeObserver = new ResizeObserver(entries => {
            const entry = entries[0];
            if (entry) {
                setBoardWidthForScaling(entry.contentRect.width);
            }
        });

        resizeObserver.observe(observerTarget);
        return () => resizeObserver.disconnect();
    }, []);

    const getCoordsFromRefs = useCallback((from: Square, to: Square) => {
        const boardEl = boardGridRef.current;
        const startSquareEl = squareRefs.current.get(from);
        const endSquareEl = squareRefs.current.get(to);

        if (!boardEl || !startSquareEl || !endSquareEl) return null;

        const boardRect = boardEl.getBoundingClientRect();
        const startSquareRect = startSquareEl.getBoundingClientRect();
        const endSquareRect = endSquareEl.getBoundingClientRect();

        const pieceOffsetX = (startSquareRect.width - currentPieceVisualSize) / 2;
        const pieceOffsetY = (startSquareRect.height - currentPieceVisualSize) / 2;

        const startX = (startSquareRect.left - boardRect.left) + pieceOffsetX;
        const startY = (startSquareRect.top - boardRect.top) + pieceOffsetY;

        const endX = (endSquareRect.left - boardRect.left) + pieceOffsetX;
        const endY = (endSquareRect.top - boardRect.top) + pieceOffsetY;

        return { startX, startY, endX, endY };
    }, [currentPieceVisualSize]);

    const executeMove = useCallback((from: Square, to: Square, wasDragged = false, isPremove = false) => {
        let pieceToMove: Piece | null | undefined;

        if (!isPlayerTurn && !canMoveAnyPiece) {
            const virtualBoard = new Map<Square, Piece | null>();
            if (preMoves.length > 0) {
                for (const rank of numbers) {
                    for (const file of letters) {
                        const square = `${file}${rank}` as Square;
                        virtualBoard.set(square, game.get(square));
                    }
                }
                for (const move of preMoves) {
                    const piece = virtualBoard.get(move.from);
                    if (piece) {
                        virtualBoard.set(move.from, null);
                        virtualBoard.set(move.to, piece);
                    }
                }
                pieceToMove = virtualBoard.get(from);
            } else {
                pieceToMove = game.get(from);
            }
        } else {
            pieceToMove = game.get(from);
        }

        if (!pieceToMove) return;

        if (!isPlayerTurn && !canMoveAnyPiece) {
            let promotionPiece: 'q' | 'r' | 'b' | 'n' | undefined = undefined;
            if (pieceToMove.type === 'p' && ((pieceToMove.color === 'w' && to.endsWith('8')) || (pieceToMove.color === 'b' && to.endsWith('1')))) {
                promotionPiece = 'q';
            }

            setPreMoves(prev => {
                const newPreMove = { from, to, promotion: promotionPiece };
                const updatedPreMoves = prev.filter(pm => pm.to !== to);
                return [...updatedPreMoves, newPreMove];
            });

            setSelectedSquare(to);
            setPossibleMoves([]);
            return;
        }

        const move = game.moves({ verbose: true }).find(m => m.from === from && m.to === to);
        if (!move) return;

        if (!animationsEnabled || wasDragged || isPremove) {
            onMoveAttempt(from, to, move.promotion as any);
            setSelectedSquare(null);
            setPossibleMoves([]);
            return;
        }

        moveBeingAnimated.current = move;
        const piecesToAnimate: AnimatingPieceInfo[] = [];
        const mainCoords = getCoordsFromRefs(move.from, move.to);
        if (mainCoords) {
            piecesToAnimate.push({ piece: pieceToMove, from: move.from, to: move.to, ...mainCoords });
        }

        if (move.flags.includes('k') || move.flags.includes('q')) {
            const isKingside = move.flags.includes('k');
            const rank = move.color === 'w' ? '1' : '8';
            const rookFromSq = (isKingside ? 'h' : 'a') + rank as Square;
            const rookToSq = (isKingside ? 'f' : 'd') + rank as Square;
            const rookPiece = game.get(rookFromSq);
            const rookCoords = getCoordsFromRefs(rookFromSq, rookToSq);
            if (rookPiece && rookCoords) {
                piecesToAnimate.push({ piece: rookPiece, from: rookFromSq, to: rookToSq, ...rookCoords });
            }
        }

        if (piecesToAnimate.length > 0) setAnimatingPieces(piecesToAnimate);
        else onMoveAttempt(from, to, move.promotion as any);

        setSelectedSquare(null);
        setPossibleMoves([]);
    }, [game, isPlayerTurn, canMoveAnyPiece, getCoordsFromRefs, onMoveAttempt, animationsEnabled, preMoves, letters, numbers]);

    useEffect(() => {
        gameRef.current = game;
    }, [game]);

    useEffect(() => {
        if (animatingPieces.length > 0) {
            const duration = 200;
            const primaryElement = animatedPieceElementsRef.current.get(animatingPieces[0].from);

            animatingPieces.forEach(p => {
                const el = animatedPieceElementsRef.current.get(p.from);
                if (el) {
                    el.style.transform = `translate(${p.startX}px, ${p.startY}px)`;
                    el.style.transition = 'none';
                }
            });

            requestAnimationFrame(() => {
                animatingPieces.forEach(p => {
                    const el = animatedPieceElementsRef.current.get(p.from);
                    if (el) {
                        el.style.transition = `transform ${duration}ms ease-out`;
                        el.style.transform = `translate(${p.endX}px, ${p.endY}px)`;
                    }
                });
            });

            if (primaryElement) {
                const handleTransitionEnd = () => {
                    primaryElement.removeEventListener('transitionend', handleTransitionEnd);
                    const move = moveBeingAnimated.current;
                    if (move) onMoveAttempt(move.from, move.to, move.promotion as any);
                    setAnimatingPieces([]);
                    animatedPieceElementsRef.current.clear();
                    moveBeingAnimated.current = null;
                };
                primaryElement.addEventListener('transitionend', handleTransitionEnd);
                return () => primaryElement.removeEventListener('transitionend', handleTransitionEnd);
            }
        }
    }, [animatingPieces, onMoveAttempt]);

    useEffect(() => {
        if (isPlayerTurn && preMoves.length > 0) return;
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
            const isPreMoveLegal = legalMoves.some(m => m.from === nextPreMove.from && m.to === nextPreMove.to);
            if (isPreMoveLegal) {
                executeMove(nextPreMove.from, nextPreMove.to, false, true);
                setPreMoves(prev => prev.slice(1));
            } else {
                setLastMove(null);
                setPreMoves([]);
            }
        }
    }, [preMoves, isPlayerTurn, game, executeMove]);

    const handleRightClick = useCallback((e: React.MouseEvent) => {
        e.preventDefault();
        if (preMoves.length > 0) {
            setPreMoves([]);
            setSelectedSquare(null);
            setPossibleMoves([]);
        }
    }, [preMoves.length]);

    const getPieceImage = (piece: Piece | undefined): string | null => {
        if (piece) return `https://images.chesscomfiles.com/chess-themes/pieces/neo/150/${piece.color}${piece.type}.png`;
        return null;
    };

    const getEnhancedPossibleMoves = useCallback((square: Square): Square[] => {
        const legalMoves = game.moves({ square, verbose: true });
        return legalMoves.map(move => move.to);
    }, [game]);

    const getInterpretedMove = useCallback((from: Square, to: Square): Square => {
        const piece = game.get(from);
        if (!piece || piece.type !== 'k') return to;

        const legalMoves = game.moves({ square: from, verbose: true });
        const targetPiece = game.get(to);
        if (targetPiece?.type === 'r' && targetPiece?.color === piece.color) {
            if (to.startsWith('h')) {
                const castleMove = legalMoves.find(m => m.san === 'O-O');
                if (castleMove) return castleMove.to;
            } else if (to.startsWith('a')) {
                const castleMove = legalMoves.find(m => m.san === 'O-O-O');
                if (castleMove) return castleMove.to;
            }
        }
        return to;
    }, [game]);

    const handleSquareClick = useCallback((clickedSquare: Square, e: React.MouseEvent) => {
        if (interactionState.current?.isDragging) return;

        if (selectedSquare && !isPlayerTurn && !canMoveAnyPiece) {
            if (selectedSquare === clickedSquare) {
                setSelectedSquare(null);
                setPossibleMoves([]);
                return;
            }

            const virtualBoard = new Map<Square, Piece | null>();
            for (const rank of numbers) {
                for (const file of letters) {
                    const square = `${file}${rank}` as Square;
                    virtualBoard.set(square, game.get(square));
                }
            }
            for (const move of preMoves) {
                const piece = virtualBoard.get(move.from);
                if (piece) {
                    virtualBoard.set(move.from, null);
                    virtualBoard.set(move.to, piece);
                }
            }
            const pieceOnClickedSquare = virtualBoard.get(clickedSquare);

            if (pieceOnClickedSquare && pieceOnClickedSquare.color === userColor && !e.shiftKey) {
                setSelectedSquare(clickedSquare);
                setPossibleMoves([]);
            } else {
                const interpretedTo = getInterpretedMove(selectedSquare, clickedSquare);
                executeMove(selectedSquare, interpretedTo, false);
            }
            return;
        }

        const virtualBoard = new Map<Square, Piece | null>();
        let pieceOnClickedSquare: Piece | null | undefined;
        if (preMoves.length > 0) {
            for (const rank of numbers) {
                for (const file of letters) {
                    const square = `${file}${rank}` as Square;
                    virtualBoard.set(square, game.get(square));
                }
            }
            for (const move of preMoves) {
                const piece = virtualBoard.get(move.from);
                if (piece) {
                    virtualBoard.set(move.from, null);
                    virtualBoard.set(move.to, piece);
                }
            }
            pieceOnClickedSquare = virtualBoard.get(clickedSquare);
        } else {
            pieceOnClickedSquare = game.get(clickedSquare);
        }

        if (selectedSquare) {
            if (selectedSquare === clickedSquare) {
                setSelectedSquare(null);
                setPossibleMoves([]);
                return;
            }

            const interpretedTo = getInterpretedMove(selectedSquare, clickedSquare);
            const isMoveLegal = game.moves({ verbose: true }).some(m => m.from === selectedSquare && m.to === interpretedTo);

            if (isMoveLegal) {
                executeMove(selectedSquare, interpretedTo, false);
            } else {
                if (pieceOnClickedSquare && (canMoveAnyPiece || pieceOnClickedSquare.color === userColor)) {
                    setSelectedSquare(clickedSquare);
                    setPossibleMoves(getEnhancedPossibleMoves(clickedSquare));
                } else {
                    setSelectedSquare(null);
                    setPossibleMoves([]);
                }
            }
        } else {
            if (pieceOnClickedSquare && (canMoveAnyPiece || pieceOnClickedSquare.color === userColor)) {
                setSelectedSquare(clickedSquare);
                setPossibleMoves((isPlayerTurn || canMoveAnyPiece) ? getEnhancedPossibleMoves(clickedSquare) : []);
            }
        }
    }, [game, selectedSquare, isPlayerTurn, userColor, canMoveAnyPiece, getInterpretedMove, executeMove, getEnhancedPossibleMoves, preMoves, letters, numbers]);

    const handleMouseMove = useCallback((e: MouseEvent) => {
        const currentInteraction = interactionState.current;
        if (!currentInteraction || !currentInteraction.piece) return;

        if (!currentInteraction.isDragging) {
            const dx = Math.abs(e.clientX - currentInteraction.startX);
            const dy = Math.abs(e.clientY - currentInteraction.startY);
            if (dx > 5 || dy > 5) {
                interactionState.current.isDragging = true;
                e.preventDefault();
                setDraggedPiece({ piece: currentInteraction.piece, fromSquare: currentInteraction.square });
                if (isPlayerTurn || canMoveAnyPiece) {
                    setPossibleMoves(getEnhancedPossibleMoves(currentInteraction.square));
                }
                setSelectedSquare(currentInteraction.square);
                document.body.style.cursor = 'grabbing';
            }
        }

        if (currentInteraction.isDragging && boardGridRef.current) {
            const boardRect = boardGridRef.current.getBoundingClientRect();
            const mouseX = e.clientX - boardRect.left;
            const mouseY = e.clientY - boardRect.top;

            setDraggedPosition({ x: mouseX - currentSquareSize / 2, y: mouseY - currentSquareSize / 2 });

            const col = Math.floor(mouseX / currentSquareSize);
            const row = Math.floor(mouseY / currentSquareSize);
            if (col < 0 || col >= 8 || row < 0 || row >= 8) {
                setHoveredTargetSquare(null);
                return;
            }

            const currentSquareUnderMouse = (letters[col] + numbers[row]) as Square;
            const enhancedLegalMoves = getEnhancedPossibleMoves(currentInteraction.square);
            if (enhancedLegalMoves.includes(currentSquareUnderMouse) || !isPlayerTurn) {
                setHoveredTargetSquare(currentSquareUnderMouse);
            } else {
                setHoveredTargetSquare(null);
            }
        }
    }, [currentSquareSize, getEnhancedPossibleMoves, isPlayerTurn, canMoveAnyPiece, letters, numbers]);

    const handleMouseUp = useCallback((e: MouseEvent) => {
        const currentInteraction = interactionState.current;
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);

        if (currentInteraction?.isDragging && boardGridRef.current) {
            setHoveredTargetSquare(null);
            const boardRect = boardGridRef.current.getBoundingClientRect();
            const mouseX = e.clientX - boardRect.left;
            const mouseY = e.clientY - boardRect.top;
            const col = Math.floor(mouseX / currentSquareSize);
            const row = Math.floor(mouseY / currentSquareSize);

            const fromSquare = currentInteraction.square;

            if (col >= 0 && col < 8 && row >= 0 && row < 8) {
                const toSquare = (letters[col] + numbers[row]) as Square;

                if (fromSquare !== toSquare) {
                    const interpretedTo = getInterpretedMove(fromSquare, toSquare);
                    const isMoveLegal = game.moves({ verbose: true }).some(m => m.from === fromSquare && m.to === interpretedTo);

                    if (isMoveLegal || (!isPlayerTurn && !canMoveAnyPiece)) {
                        executeMove(fromSquare, interpretedTo, true);
                        setSelectedSquare(interpretedTo);
                        setPossibleMoves([]);
                    }
                }
            }

            setDraggedPiece(null);
            setDraggedPosition(null);
            document.body.style.cursor = 'default';
        }
        interactionState.current = null;
    }, [currentSquareSize, handleMouseMove, isPlayerTurn, canMoveAnyPiece, getInterpretedMove, executeMove, letters, numbers, game]);

    const handleMouseDown = useCallback((e: React.MouseEvent, piece: Piece | undefined, square: Square) => {
        if (e.button === 2) {
            return;
        }
        e.preventDefault();
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
    }, [handleMouseMove, handleMouseUp, userColor, canMoveAnyPiece]);


    if (!game) {
        return <div className="flex justify-center items-center w-full h-full text-black dark:text-white">Loading...</div>;
    }
    const virtualBoard = new Map<Square, Piece | null>();
    const preMoveOrigins = new Set(preMoves.map(p => p.from));
    const preMoveDests = new Set(preMoves.map(p => p.to));

    if (preMoves.length > 0) {
        for (const rank of numbers) {
            for (const file of letters) {
                const square = `${file}${rank}` as Square;
                virtualBoard.set(square, game.get(square));
            }
        }
        for (const move of preMoves) {
            const pieceToMove = virtualBoard.get(move.from);
            if (pieceToMove) {
                virtualBoard.set(move.from, null);
                virtualBoard.set(move.to, pieceToMove);
            }
        }
    }

    return (
        <div
            ref={mainBoardOuterRef}
            className="w-full aspect-square relative"
        >
            <div
                className="absolute inset-0 grid"
                style={{
                    ...(showLabels
                        ? {
                            gridTemplateAreas: `"y-axis board" ". x-axis"`,
                            gridTemplateColumns: `${labelFontSize * 1.8}px 1fr`,
                            gridTemplateRows: `1fr ${labelFontSize * 1.8}px`,
                        }
                        : {
                            gridTemplateAreas: `"board"`,
                            gridTemplateColumns: '1fr',
                            gridTemplateRows: '1fr',
                        })
                }}
            >
                {showLabels && (
                    <div
                        className="flex flex-col items-center justify-around text-xs font-semibold text-gray-600 dark:text-gray-400"
                        style={{
                            gridArea: 'y-axis',
                            fontSize: `${labelFontSize}px`,
                        }}
                    >
                        {numbers.map((num) => <div key={num}>{num}</div>)}
                    </div>
                )}

                <div
                    ref={boardGridRef}
                    onContextMenu={handleRightClick}
                    className="grid grid-cols-8 grid-rows-8 border-2 border-gray-800 dark:border-gray-600 overflow-hidden relative"
                    style={{ gridArea: 'board' }}
                >
                    {numbers.map((rank) => letters.map((file) => {
                        const algebraicSquare = `${file}${rank}` as Square;
                        const pieceToDisplay = preMoves.length > 0 ? virtualBoard.get(algebraicSquare) : game.get(algebraicSquare);
                        const piece = pieceToDisplay;
                        const isPreMoveOrigin = preMoveOrigins.has(algebraicSquare);
                        const isPreMoveDestination = preMoveDests.has(algebraicSquare);
                        const isDark = (file.charCodeAt(0) - 97 + rank - 1) % 2 === 1;
                        const isDragged = draggedPiece?.fromSquare === algebraicSquare;
                        const isSelected = selectedSquare === algebraicSquare;
                        const isLastMoveFrom = lastMove?.from === algebraicSquare;
                        const isLastMoveTo = lastMove?.to === algebraicSquare;
                        const isHoveredTarget = hoveredTargetSquare === algebraicSquare;
                        const isPossibleMoveTarget = possibleMoves.includes(algebraicSquare);
                        const isHintSquare = hintSquare === algebraicSquare;

                        let bgColorClass = isDark ? "bg-sky-700" : "bg-slate-100";
                        if (algebraicSquare === incorrectSquare) bgColorClass = "bg-red-200";
                        else if (isPreMoveOrigin && isPreMoveDestination) bgColorClass = "bg-red-300";
                        else if (isPreMoveDestination) bgColorClass = "bg-red-200";
                        else if (isPreMoveOrigin) bgColorClass = "bg-red-100";
                        else if (isLastMoveFrom) bgColorClass = "bg-blue-300";
                        else if (isLastMoveTo) bgColorClass = "bg-blue-200";
                        else if (isSelected) bgColorClass = "bg-indigo-200";
                        else if (isHintSquare) bgColorClass = "bg-amber-100";
                        if (isHoveredTarget) bgColorClass = "bg-indigo-100";

                        const isHiddenDuringAnimation = animatingPieces.some(p => p.from === algebraicSquare || p.to === algebraicSquare);

                        return (
                            <div key={algebraicSquare} ref={el => el ? squareRefs.current.set(algebraicSquare, el) : squareRefs.current.delete(algebraicSquare)} className={`relative flex items-center justify-center ${bgColorClass} ${selectedSquare && 'cursor-pointer'}`} onMouseDown={(e) => handleMouseDown(e, piece || undefined, algebraicSquare)} onClick={(e) => handleSquareClick(algebraicSquare, e)}>
                                {isPossibleMoveTarget && <div className={`absolute rounded-full ${piece ? 'border-4 border-slate-400' : 'bg-slate-400 opacity-50'}`} style={{ width: piece ? '100%' : '30%', height: piece ? '100%' : '30%', zIndex: 1, transform: piece ? 'scale(0.9)' : 'none' }}></div>}
                                {piece && !isDragged && <img src={getPieceImage(piece)} draggable={false} alt={`${piece?.color} ${piece?.type}`} style={{ width: '75%', height: '75%', objectFit: 'contain', cursor: (canMoveAnyPiece || (piece?.color === userColor)) ? 'grab' : selectedSquare ? 'pointer' : 'default', userSelect: 'none', zIndex: 3, visibility: isHiddenDuringAnimation ? 'hidden' : 'visible' }} />}
                            </div>
                        );
                    }))}
                    {draggedPiece && draggedPosition && <img src={getPieceImage(draggedPiece.piece) || ''} draggable={false} alt="" style={{ position: 'absolute', left: `${draggedPosition.x}px`, top: `${draggedPosition.y}px`, width: `${currentSquareSize}px`, height: `${currentSquareSize}px`, objectFit: 'contain', pointerEvents: 'none', zIndex: 1000, transform: 'scale(0.9)', filter: 'drop-shadow(0 0 8px rgba(0,0,0,0.5))' }} />}
                    {animatingPieces.map(p => <div key={p.from} ref={el => el ? animatedPieceElementsRef.current.set(p.from, el) : animatedPieceElementsRef.current.delete(p.from)} style={{ position: 'absolute', top: 0, left: 0, width: `${currentPieceVisualSize}px`, height: `${currentPieceVisualSize}px`, pointerEvents: 'none', zIndex: 999 }}><img src={getPieceImage(p.piece) || ''} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain' }} /></div>)}
                </div>

                {showLabels && (
                    <div
                        className="flex items-center justify-around text-xs font-semibold text-gray-600 dark:text-gray-400"
                        style={{
                            gridArea: 'x-axis',
                            fontSize: `${labelFontSize}px`,
                        }}
                    >
                        {letters.map((letter) => <div key={letter}>{letter}</div>)}
                    </div>
                )}
            </div>
        </div>
    );
});

export default ChessBoard;