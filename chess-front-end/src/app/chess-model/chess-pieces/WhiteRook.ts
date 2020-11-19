import { PieceType, PieceColor } from "../game-definitions/GameData";
import { Move } from "../game-definitions/game-interface/Move";
import { Piece } from "../game-definitions/game-interface/Piece";
import { Square } from "../game-definitions/game-interface/Square";
import { rookPotentialMoves } from "./piece-functions/PotentialMoves";

export class WhiteRook implements Piece {
   
    typeOfPiece: PieceType;
    colorOfPiece: PieceColor;

    constructor() {
        this.typeOfPiece = PieceType.Rook;
        this.colorOfPiece = PieceColor.White;
    }

    potentialMoves(pos: Square): Move[] {
        const toReturn: Move[] = rookPotentialMoves(pos);

        return toReturn;
    }

}
