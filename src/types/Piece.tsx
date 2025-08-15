export type PieceCode = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
export type Color = 'w' | 'b';

export type PieceSet = Record<PieceCode, Object>;
export type DisplayedPieces = Record<Color, PieceSet>;

export interface Piece {
    signed_url: string;
    type: string;
    color: string;
}