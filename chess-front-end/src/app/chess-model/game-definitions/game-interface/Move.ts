import { PieceType } from "../GameData";
import { Square } from "./Square";

export interface Move {
    mustCapture?: boolean;
    enPassant?: Square;
    promoteTo?: PieceType;
    from: Square;
    to: Square;
}