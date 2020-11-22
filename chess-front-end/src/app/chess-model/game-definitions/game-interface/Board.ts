import { SquareComponent } from 'src/app/square/square.component';
import { Outcome } from "../GameData";
import { Move } from "./Move";

export interface Board {
    squares: SquareComponent[][];
    isWhiteTurn: boolean;
    wkCastle: boolean;
    wqCastle: boolean;
    bkCastle: boolean;
    bqCastle: boolean;
    enPassant: SquareComponent | undefined;

    fiftyMoveDrawCount: number;
    turn: number;

    isInCheck: boolean;
    condition: Outcome;

    makeMove(toMake: any): void;
    isValidMove(toCheck: Move): boolean;
}