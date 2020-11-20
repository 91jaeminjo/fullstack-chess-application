import { SquareComponent } from 'src/app/square/square.component';
import { PieceType, PieceColor } from "../GameData";
import { Move } from "./Move";
import { Square } from "./Square";

export interface Piece {

    typeOfPiece: PieceType;
    colorOfPiece: PieceColor;
    potentialMoves(pos: SquareComponent): Move[];
}