export type PieceCode = 'p' | 'r' | 'n' | 'b' | 'q' | 'k';
export type Color = 'white' | 'black';

export type PieceSet = Record<PieceCode, string>;
export type DisplayedPieces = Record<Color, PieceSet>;

export interface Piece {
    src: string;
    type: string;
    color: string;
}