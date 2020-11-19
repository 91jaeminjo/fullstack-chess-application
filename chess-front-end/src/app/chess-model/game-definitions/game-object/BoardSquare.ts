import { Coord } from "../GameData";
import { Piece } from "../game-interface/Piece";
import { Square } from "../game-interface/Square";

export class BoardSquare implements Square {

    row: Coord;
    col: Coord;
    piece?: Piece;

    constructor(row: Coord, col: Coord, piece?:Piece) {
        this.row = row;
        this.col = col;
        this.piece = piece;
    }

}
