import { PieceType, PieceColor, Coord } from "../game-definitions/GameData";
import { Move } from "../game-definitions/game-interface/Move";
import { Piece } from "../game-definitions/game-interface/Piece";
import { Square } from "../game-definitions/game-interface/Square";
import { BoardSquare } from "../game-definitions/game-object/BoardSquare";
import { kingPotentialMoves } from "./piece-functions/PotentialMoves";
import { SquareComponent } from 'src/app/square/square.component';


export class BlackKing implements Piece {

    typeOfPiece: PieceType;
    colorOfPiece: PieceColor;

    constructor() {
        this.typeOfPiece = PieceType.King;
        this.colorOfPiece = PieceColor.Black;
    }

    potentialMoves(pos: SquareComponent): Move[]{

        const toReturn: Move[] = kingPotentialMoves(pos);

        return toReturn;
    }
}