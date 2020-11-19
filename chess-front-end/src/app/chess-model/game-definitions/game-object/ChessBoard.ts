// import { BlackBishop } from "../../chess-pieces/BlackBishop";
// import { BlackKing } from "../../chess-pieces/BlackKing";
// import { BlackKnight } from "../../chess-pieces/BlackKnight";
// import { BlackPawn } from "../../chess-pieces/BlackPawn";
// import { BlackQueen } from "../../chess-pieces/BlackQueen";
// import { BlackRook } from "../../chess-pieces/BlackRook";
// import { WhiteBishop } from "../../chess-pieces/WhiteBishop";
// import { WhiteKing } from "../../chess-pieces/WhiteKing";
// import { WhiteKnight } from "../../chess-pieces/WhiteKnight";
// import { WhitePawn } from "../../chess-pieces/WhitePawn";
// import { WhiteQueen } from "../../chess-pieces/WhiteQueen";
// import { WhiteRook } from "../../chess-pieces/WhiteRook";
// import { Coord, Outcome } from "../GameData";
// import { Board } from "../GameInterface/Board";
// import { Move } from "../GameInterface/Move";
// import { Piece } from "../GameInterface/Piece";
// import { Square } from "../GameInterface/Square";


// export class ChessBoard implements Board{
//     squares: Square[][];
//     isWhiteTurn: boolean;
//     wkCastle: boolean;
//     wqCastle: boolean;
//     bkCastle: boolean;
//     bqCastle: boolean;
//     enPassant: Square;
//     fiftyMoveDrawCount: number;
//     turn: number;
//     isInCheck: boolean;
//     condition: Outcome;
//     makeMove(toMake: Move): Board {
//         throw new Error("Method not implemented.");
//     }
//     isValidMove(toCheck: Move): boolean {
//         throw new Error("Method not implemented.");
//     }
    
//     constructor(boardState:string){
//         this.squares = [];

//         let input:string[] = boardState.split(" ");
//         let state:string[] = input[0].split("/").reverse();

//         for(let i = 0;i< 8 ; i++){
//             let squareLine: Square[] = [];
//             let charLine: string[] = state[i].split("");
//             for(let j = 0; j < 8; j++){
//                 console.log(charLine[j]);
//                 if(!isNaN(Number(charLine[j]))){
//                     console.log(Number(charLine[j]) );
//                     let count = Number(charLine[j]);
//                     while(count>0){
//                         let newSquare: Square = {
//                             row: i+1 as Coord,
//                             col: j+1 as Coord
//                         }
//                         squareLine.push(newSquare);
//                         j++;
//                         count--;
                        
//                     }
//                 }
//                 else{
//                     let squarePiece: Piece;
//                     console.log("charLine[j] has piece");
//                     console.log(charLine[j]);
//                     switch(charLine[j]){
//                         case 'K':{
//                             console.log("White King");
//                             squarePiece = new WhiteKing();
//                             break;
//                         }
//                         case 'Q': {
//                             squarePiece = new WhiteQueen();
//                             break;
//                         }
//                         case 'R': {
//                             squarePiece = new WhiteRook();
//                             break;
//                         }
//                         case 'N': {
//                             squarePiece = new WhiteKnight();
//                             break;
//                         }
//                         case 'B': {
//                             squarePiece = new WhiteBishop();
//                             break;
//                         }
//                         case 'P': {
//                             squarePiece = new WhitePawn();
//                             break;
//                         }
//                         case 'k': {
//                             squarePiece = new BlackKing();
//                             break;
//                         }
//                         case 'q': {
//                             squarePiece = new BlackQueen();
//                             break;
//                         }
//                         case 'r': {
//                             squarePiece = new BlackBishop();
//                             break;
//                         }
//                         case 'n': {
//                             squarePiece = new BlackKnight();
//                             break;
//                         }
//                         case 'b': {
//                             squarePiece = new BlackRook();
//                             break;
//                         }
//                         case 'p':{
//                             squarePiece = new BlackPawn();
//                             break;
//                         }
//                     }
//                     let newSquare: Square = {
//                         row: i+1 as Coord,
//                         col: j+1 as Coord,
//                         occupyingPiece: squarePiece
//                     }
//                     squareLine.push(newSquare);
//                 }
                
//             }
//             this.squares.push(squareLine);
//         }
//     }

// } 