export enum PieceType {
    Pawn,
    Bishop,
    Knight,    
    Rook,
    Queen,
    King
}

export enum PieceColor {
    White,
    Black
}

export enum Outcome {
    InProgress,
    Draw,
    WhiteWins,
    BlackWins
}

export type Coord = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7;