import { PieceType, PieceColor } from "../game-definitions/GameData";
import { Move } from "../game-definitions/game-interface/Move";
import { Piece } from "../game-definitions/game-interface/Piece";
import { Square } from "../game-definitions/game-interface/Square";
import { rookPotentialMoves, bishopPotentialMoves } from "./piece-functions/PotentialMoves";
import { SquareComponent } from 'src/app/square/square.component';

export class WhiteQueen implements Piece {
    
    typeOfPiece: PieceType;
    colorOfPiece: PieceColor;
    
    constructor() {
        this.typeOfPiece = PieceType.Queen;
        this.colorOfPiece = PieceColor.White;
    }
    
    potentialMoves(pos: SquareComponent): Move[] {
        const orthoMoves: Move[] = rookPotentialMoves(pos);
        const diagMoves: Move[] = bishopPotentialMoves(pos);

        const toReturn: Move[] = orthoMoves.concat(diagMoves);

        return toReturn;
    }

}