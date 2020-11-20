import { SquareComponent } from 'src/app/square/square.component';
import { PieceType } from "../GameData";


export interface Move {
    mustCapture?: boolean;
    enPassant?: SquareComponent;
    promoteTo?: PieceType;
    from: SquareComponent;
    to: SquareComponent;
}