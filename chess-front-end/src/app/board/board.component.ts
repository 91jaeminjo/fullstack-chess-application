import { Component, Input, OnInit } from '@angular/core';

import { BlackBishop } from "../chess-model/chess-pieces/BlackBishop";
import { BlackKing } from "../chess-model/chess-pieces/BlackKing";
import { BlackKnight } from "../chess-model/chess-pieces/BlackKnight";
import { BlackPawn } from "../chess-model/chess-pieces/BlackPawn";
import { BlackQueen } from "../chess-model/chess-pieces/BlackQueen";
import { BlackRook } from "../chess-model/chess-pieces/BlackRook";
import { WhiteBishop } from "../chess-model/chess-pieces/WhiteBishop";
import { WhiteKing } from "../chess-model/chess-pieces/WhiteKing";
import { WhiteKnight } from "../chess-model/chess-pieces/WhiteKnight";
import { WhitePawn } from "../chess-model/chess-pieces/WhitePawn";
import { WhiteQueen } from "../chess-model/chess-pieces/WhiteQueen";
import { WhiteRook } from "../chess-model/chess-pieces/WhiteRook";
import { Coord, Outcome, PieceColor } from "../chess-model/game-definitions/GameData";
import { Board } from "../chess-model/game-definitions/game-interface/Board";
import { Move } from "../chess-model/game-definitions/game-interface/Move";
import { Piece } from "../chess-model/game-definitions/game-interface/Piece";
import { SquareComponent } from '../square/square.component';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, Board {
  squares: SquareComponent[][];
  isWhiteTurn: boolean;
  wkCastle: boolean;
  wqCastle: boolean;
  bkCastle: boolean;
  bqCastle: boolean;
  enPassant: SquareComponent | undefined;
  fiftyMoveDrawCount: number;
  turn: number;
  isInCheck: boolean;
  condition: Outcome;
  state: string[];
  selectedSquare: SquareComponent | undefined;
  selectedPiece: Piece | undefined;
  pieceSelected: boolean = false;
  selectedPieceColor:PieceColor | undefined;
  showPotentialMoves:boolean|undefined;
  @Input() boardState: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq e3 0 1";
  constructor() {
    
    let input: string[] = this.boardState.split(" ");
    this.state = input[0].split("/").reverse();

    this.squares = [];
    this.isWhiteTurn = input[1] == 'w';
    this.wkCastle = input[2].includes('K');
    this.wqCastle = input[2].includes('Q');
    this.bkCastle = input[2].includes('k');
    this.bqCastle = input[2].includes('q');
    if (input[3] != '-') {
      let colLetter: string = input[3].slice(0, 1);
      let colNum: Coord = 0;
      let rowNum: Coord = +input[3].slice(1, 1) as Coord;
      switch (colLetter) {
        case 'a': {
          colNum = 0;
          break;
        }
        case 'b': {
          colNum = 1;
          break;
        }
        case 'c': {
          colNum = 2;
          break;
        }
        case 'd': {
          colNum = 3;
          break;
        }
        case 'e': {
          colNum = 4;
          break;
        }
        case 'f': {
          colNum = 5;
          break;
        }
        case 'g': {
          colNum = 6;
          break;
        }
        case 'h': {
          colNum = 7;
          break;
        }
      }

      let enPassantSquare = new SquareComponent();
      enPassantSquare.row = rowNum as Coord;
      enPassantSquare.row = rowNum as Coord;
      
      this.enPassant = enPassantSquare;
    }
    else {
      this.enPassant = undefined;
    }

    this.fiftyMoveDrawCount = +input[4];
    this.turn = +input[5];
    this.isInCheck = false;
    this.condition = Outcome.InProgress;
    
  }

  ngOnInit(): void {
    this.setupBoard();
  }

  setupBoard():void{
    this.squares =[];
    for (let i = 0; i < 8; i++) {
      let squareLine: SquareComponent[] = [];
      let charLine: string[] = this.state[i].split("");
      let index = 0;
      for (let j = 0; j < charLine.length; j++) {

        

        console.log(charLine[j]);
        if (!isNaN(Number(charLine[j]))) {
          console.log(Number(charLine[j]));
          let count = Number(charLine[j]);
          while (count > 0) {
            let newSquare = new SquareComponent();
            newSquare.row = i as Coord;
            newSquare.col = index as Coord;
            // if(newSquare.row==4&&newSquare.col==4){
            //   newSquare.potentialMoveMark = true;
            // }
            squareLine.push(newSquare);
            index++;
            count--;

          }
        }
        else {
          let squarePiece: Piece = new WhitePawn();
          console.log("charLine[j] has piece");
          console.log(charLine[j]);
          switch (charLine[j]) {
            case 'K': {
              console.log("White King");
              squarePiece = new WhiteKing();
              break;
            }
            case 'Q': {
              squarePiece = new WhiteQueen();
              break;
            }
            case 'R': {
              squarePiece = new WhiteRook();
              break;
            }
            case 'N': {
              squarePiece = new WhiteKnight();
              break;
            }
            case 'B': {
              squarePiece = new WhiteBishop();
              break;
            }
            case 'P': {
              squarePiece = new WhitePawn();
              break;
            }
            case 'k': {
              squarePiece = new BlackKing();
              break;
            }
            case 'q': {
              squarePiece = new BlackQueen();
              break;
            }
            case 'r': {
              squarePiece = new BlackRook();
              break;
            }
            case 'n': {
              squarePiece = new BlackKnight();
              break;
            }
            case 'b': {
              squarePiece = new BlackBishop();
              break;
            }
            case 'p': {
              squarePiece = new BlackPawn();
              break;
            }
          }
          let newSquare = new SquareComponent();
          newSquare.row = i as Coord;
          newSquare.col = index as Coord;
          newSquare.occupyingPiece = squarePiece;
          
          index++;
          squareLine.push(newSquare);
        }
      }
      this.squares.unshift(squareLine);
    }
    
    console.log(this.squares);
  }

  onSelect(square: SquareComponent):void{
    console.log("selected square component");
    console.log(square);
    
    if(this.pieceSelected && this.selectedSquare==square){
      this.pieceSelected = false;
      this.showPotentialMoves = false;
      this.removeHighlight();
    }

    else if(square.occupyingPiece){
      this.removeHighlight();
      this.pieceSelected = true;
      this.selectedSquare = square;
      this.selectedPiece = square.occupyingPiece;
      this.selectedPieceColor = square.occupyingPiece.colorOfPiece;
      console.log(this.selectedPiece);
      console.log(this.selectedPiece.colorOfPiece);
      let potentialMoves:Move[] = this.selectedPiece.potentialMoves(square);
      let upperLimit: number = 8;
      let lowerLimit: number = -1;
      let leftLimit: number = -1;
      let rightLimit: number = 8;

      //console.log(potentialMoves);
      for(let move of potentialMoves){
        console.log(move);
        let toRow: Coord | number = 7-move.to.row;
        let toCol: Coord | number = move.to.col;
        this.showPotentialMoves = true;
        if(this.squares[toRow][toCol].occupyingPiece
          && this.squares[toRow][toCol].occupyingPiece?.colorOfPiece == this.selectedPieceColor
          || ( (toRow>upperLimit) || (toRow<lowerLimit) || (toCol<leftLimit) || (toCol>rightLimit) )){
            if((7 - square.row)>toRow&&toRow>lowerLimit){
              lowerLimit = toRow;
            }else if((7 - square.row)<toRow&&toRow<upperLimit){
              upperLimit = toRow;
            }
            if(square.col>toCol && toCol>leftLimit){
              leftLimit = toCol;
            }else if(square.col<toCol && toCol<upperLimit){
              rightLimit = toCol;
            }

        }
        else{
          this.squares[toRow][toCol].potentialMoveMark = true;
          console.log("affected square:");
          console.log(this.squares[toRow][toCol]);
        }
      }
    }
    else{
      this.pieceSelected =false; 
    }
    
  }

  removeHighlight():void{
    this.showPotentialMoves= false;
    for(let i = 0; i<8;i++){
      for(let j = 0; j<8;j++){
        this.squares[i][j].potentialMoveMark =false;
      }
    }
  }

  makeMove(toMake: Move): Board {
    throw new Error("Method not implemented.");
  }
  isValidMove(toCheck: Move): boolean {
    throw new Error("Method not implemented.");
  }

}
