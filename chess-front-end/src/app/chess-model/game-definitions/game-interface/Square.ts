import { Coord } from "../GameData";
import { Piece } from "./Piece";

export interface Square {
    occupyingPiece?: Piece;
    row: Coord;
    col: Coord;
}