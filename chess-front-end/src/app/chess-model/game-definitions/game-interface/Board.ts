import { Outcome } from "../GameData";
import { Move } from "./Move";
import { Square } from "./Square";

export interface Board {
    squares: Square[][];
    isWhiteTurn: boolean;
    wkCastle: boolean;
    wqCastle: boolean;
    bkCastle: boolean;
    bqCastle: boolean;
    enPassant: Square;

    fiftyMoveDrawCount: number;
    turn: number;

    isInCheck: boolean;
    condition: Outcome;

    makeMove(toMake: Move): Board;
    isValidMove(toCheck: Move): boolean;
}