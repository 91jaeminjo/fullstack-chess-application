import { PieceType, PieceColor, Coord } from "../game-definitions/GameData";
import { Move } from "../game-definitions/game-interface/Move";
import { Piece } from "../game-definitions/game-interface/Piece";
import { Square } from "../game-definitions/game-interface/Square";
import { BoardSquare } from "../game-definitions/game-object/BoardSquare";
import { whitePawnPotentialMoves } from "./piece-functions/PotentialMoves";
import { SquareComponent } from 'src/app/square/square.component';


export class WhitePawn implements Piece {

    typeOfPiece: PieceType;
    colorOfPiece: PieceColor;

    constructor() {
        this.typeOfPiece = PieceType.Pawn;
        this.colorOfPiece = PieceColor.White;
    }

    potentialMoves(pos: SquareComponent): Move[] {

        //4 possible cases

        //capture is possible diagonally
        //we can move forward 1
        //if we're on the 2nd row we can move forward 2
        //      we need to record the enPassant capture square
        //      that is 1 row behind the new position
        //if we move to the 8th row we can promote

        const toReturn: Move[] = whitePawnPotentialMoves(pos);

        return toReturn;

    }
}