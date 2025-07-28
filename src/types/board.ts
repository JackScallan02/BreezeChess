export interface Board {
    board_id: number;
    board_name: string;
    description: string;
    rarity: string;
    acquired_at?: string;
    whiteSquare: string;
    blackSquare: string;
}