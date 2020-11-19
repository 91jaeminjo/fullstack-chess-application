import { PieceType, PieceColor, Coord } from "../game-definitions/GameData";
import { Move } from "../game-definitions/game-interface/Move";
import { Piece } from "../game-definitions/game-interface/Piece";
import { Square } from "../game-definitions/game-interface/Square";
import { BoardSquare } from "../game-definitions/game-object/BoardSquare";
import { bishopPotentialMoves } from "./piece-functions/PotentialMoves";

export class WhiteBishop implements Piece {

    typeOfPiece: PieceType;
    colorOfPiece: PieceColor;

    constructor() {
        this.typeOfPiece = PieceType.Bishop;
        this.colorOfPiece = PieceColor.White;
    }

    potentialMoves(pos: Square): Move[]{

        const toReturn: Move[] = bishopPotentialMoves(pos);

        return toReturn;
    }

}

