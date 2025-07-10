import React from 'react';

interface PromotionDialogProps {
    color: 'w' | 'b';
    onSelect: (piece: 'q' | 'r' | 'b' | 'n') => void;
    style: React.CSSProperties;
    pieceSize: number;
    squareSize: number;
}

const PromotionDialog: React.FC<PromotionDialogProps> = ({ color, onSelect, style, pieceSize, squareSize }) => {
    const promotionPieces = ['q', 'r', 'b', 'n'] as const; // Queen, Rook, Bishop, Knight
    return (
        <div
            className="absolute bg-white/50 backdrop-blur-md rounded-md flex flex-col z-50 items-center p-2"
            style={style}
        >
            {promotionPieces.map((type) => (
                <div
                    key={type}
                    style={{width: squareSize*0.75, height: squareSize*0.75}}
                    className="cursor-pointer hover:bg-gray-200 rounded-md transition-colors flex items-center justify-center"
                    onClick={() => onSelect(type)}
                >
                    <img
                        src={`https://images.chesscomfiles.com/chess-themes/pieces/neo/150/${color}${type}.png`}
                        alt={`Promote to ${type}`}
                        width={pieceSize}
                        height={pieceSize}
                    />
                </div>
            ))}
        </div>
    );
};

export default PromotionDialog;