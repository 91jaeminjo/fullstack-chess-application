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
import { Coord, Outcome, PieceColor, PieceType } from "../chess-model/game-definitions/GameData";
import { Move } from "../chess-model/game-definitions/game-interface/Move";
import { Piece } from "../chess-model/game-definitions/game-interface/Piece";
import { SquareComponent } from '../square/square.component';
import { GameServiceService } from '../game-service.service';
import { MoveRequest } from '../chess-model/game-definitions/game-interface/MoveRequest';
import { ActivatedRoute } from '@angular/router';
import { blackPawnPotentialMoves, whitePawnPotentialMoves } from '../chess-model/chess-pieces/piece-functions/PotentialMoves';


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit {
  @Input() gameId!: number;
  @Input() FEN!: string; // starting state "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR b KQkq e3 0 1";
  @Input() gameOver!: boolean;
  message!: string;
  viewMode: boolean = true; // true = white, false = black;
  squares!: SquareComponent[][];
  promotion : boolean = false;
  promotePiece: string ="";
  protedPiece!: string;
  isWhiteTurn!: boolean;
  wkCastle!: boolean;
  wqCastle!: boolean;
  bkCastle!: boolean;
  bqCastle!: boolean;
  enPassant!: SquareComponent | undefined;
  currentTurn!: PieceColor;
  fiftyMoveDrawCount!: number;
  turn!: number;
  isInCheck!: boolean;
  condition!: Outcome;
  state!: string[];
  selectedSquare!: SquareComponent;
  selectedPiece!: Piece;
  pieceSelected: boolean = false;
  selectedPieceColor!: PieceColor;

  showPotentialMoves!: boolean;

  constructor(private route: ActivatedRoute, private gameService: GameServiceService) {
  }

  ngOnInit(): void {
    this.retrieveGameById();
  }

  flipView(): void{
    this.viewMode = !this.viewMode;
    this.initialize();
    this.reloadBoard();
  }
  checkPromotion():void{

    if(this.isWhiteTurn){
      let row = (this.viewMode)? 1:6;
      for(let i = 0; i<=7;i++){
        if(this.squares[row][i].occupyingPiece?.typeOfPiece==PieceType.Pawn
          &&this.squares[row][i].occupyingPiece?.colorOfPiece==PieceColor.White){
          this.promotion=true;
          console.log("white row: "+row);
          console.log(this.squares[row][i]);
          break;
        }
        this.promotion=false;
      }
    } else{
      let row = (this.viewMode)? 6:1;
      for(let i = 0; i<=7;i++){
        if(this.squares[row][i].occupyingPiece?.typeOfPiece==PieceType.Pawn
          &&this.squares[row][i].occupyingPiece?.colorOfPiece==PieceColor.Black){
          this.promotion=true;
          console.log("black row: "+row);
          console.log(this.squares[row][i]);
          break;
        }
        this.promotion=false;
      }
    }
    console.log("this.promotion: "+this.promotion);
  }
  promoteTo(type:string):void{
    console.log("promotion: "+this.promotion);
    console.log(type);
    this.promotePiece=type;
  }


  initialize(): void {
    console.log("from board component");
    console.log("FEN: " + this.FEN);
    let input: string[] = this.FEN.split(" ");
    if(this.viewMode){
      this.state = input[0].split("/").reverse();
    }
    else{
      this.state = input[0].split("/")
    }
    

    this.squares = [];
    this.isWhiteTurn = input[1] == 'w';
    this.currentTurn = this.isWhiteTurn ? PieceColor.White : PieceColor.Black;
    this.message = "";
    if(this.gameOver){
      this.message = "Game Over! ";
      if(this.isWhiteTurn){
        this.message += "Black Wins!";
      }
      else{
        this.message += "White Wins!";
      }
    }
    else if(this.isWhiteTurn){
      this.message = "White's Turn.";
    }
    else{
      this.message = "Black's Turn.";
    }
    console.log("message: "+this.message);
    this.wkCastle = input[2].includes('K');
    this.wqCastle = input[2].includes('Q');
    this.bkCastle = input[2].includes('k');
    this.bqCastle = input[2].includes('q');
    if (input[3] != '-') {

      let colLetter: string = input[3].slice(0, 1);
      let colNum: Coord = 0;
      let rowNum: Coord = +(input[3].slice(1)) - 1 as Coord;
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
      enPassantSquare.col = colNum as Coord;

      this.enPassant = enPassantSquare;
      console.log("this.enPassant: ");
      console.log(this.enPassant);
    }
    else {
      this.enPassant = undefined;
    }

    this.fiftyMoveDrawCount = +input[4];
    this.turn = +input[5];
    this.isInCheck = false;
    this.condition = Outcome.InProgress;
  }

  setupBoard(): void {
    this.squares = [];
    for (let i = 0; i < 8; i++) {
      let squareLine: SquareComponent[] = [];
      let charLine: string[] = this.state[i].split("");
      let index = 0;
      for (let j = 0; j < charLine.length; j++) {
        
        if (!isNaN(Number(charLine[j]))) {
          let count = Number(charLine[j]);
          while (count > 0) {
            let newSquare = new SquareComponent();
            newSquare.row = i as Coord;
            newSquare.col = index as Coord;
            squareLine.push(newSquare);
            index++;
            count--;

          }
        }
        else {
          let squarePiece: Piece | undefined;

          switch (charLine[j]) {
            case 'K': {
              
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
    this.checkPromotion();
    console.log(this.squares);
  }

  onSelect(square: SquareComponent): void {
    console.log("selected square component");
    console.log(square);
    // If game over
    if(this.gameOver){
      return;
    }


    if (square.potentialMoveMark) {
      
      if(!this.viewMode){
        this.selectedSquare.row = 7-this.selectedSquare.row;
        square.row = 7-square.row;
      }
      
      let moveString = this.selectedSquare.toChessCoord() + square.toChessCoord();
      if(this.promotion&&(this.selectedPiece.typeOfPiece==PieceType.Pawn)){
        moveString +=this.promotePiece;
        this.promotion = false;
      }
      let newMove: MoveRequest = {
        gameId: this.gameId,
        newMove: moveString,
        currentState: this.FEN
      }
      console.log("moveString: "+moveString);
      this.makeMove(newMove);
    }

    console.log("currentColor: " + this.currentTurn);
    // should not be able to click opponent's pieces.
    if (square.occupyingPiece?.colorOfPiece != this.currentTurn) {
      return;
    }
    if (this.pieceSelected && this.selectedSquare == square) {
      this.pieceSelected = false;
      this.showPotentialMoves = false;
      this.removeHighlight();
    }

    else if (square.occupyingPiece) {
      this.removeHighlight();
      this.pieceSelected = true;
      this.selectedSquare = square;
      this.selectedPiece = square.occupyingPiece;
      this.selectedPieceColor = square.occupyingPiece.colorOfPiece;
      console.log(this.selectedPiece);
      console.log(this.selectedPiece.colorOfPiece);

      switch (square.occupyingPiece.typeOfPiece) {
        case (PieceType.Pawn): {
          this.pawnMoves(square);
          break;
        }
        case (PieceType.Bishop): {
          this.bishopMoves(square);
          break;
        }
        case (PieceType.Knight): {
          this.knightMoves(square);
          break;
        }
        case (PieceType.Rook): {
          this.rookMoves(square);
          break;
        }
        case (PieceType.Queen): {
          this.bishopMoves(square);
          this.rookMoves(square);
          break;
        }
        case (PieceType.King): {
          this.kingMoves(square);
          break;
        }
      }

    }
    else {
      this.pieceSelected = false;
    }

  }

  kingInCheck(square: SquareComponent): boolean {
    if (this.diagonalAttack(square)) {
      console.log("diagonally being attacked");
    }
    if (this.orthogonalAttack(square)) {
      console.log("orthogonally being attacked");
    }
    if (this.knightAttack(square)) {
      console.log("being attacked by knight");
    }
    if (this.pawnAttack(square)) {
      console.log("being attacked by pawn");
    }
    return true;
  }

  diagonalAttack(pos: SquareComponent): boolean {
    //top left 
    //rows (+) col (-)
    for (let offSet: number = 1; pos.col - offSet >= 0 && pos.row + offSet <= 7; offSet++) {
      if (this.squares[7 - (pos.row + offSet)][pos.col - offSet].occupyingPiece) {
        if (this.squares[7 - (pos.row + offSet)][pos.col - offSet].occupyingPiece?.colorOfPiece != this.currentTurn) {
          if (this.squares[7 - (pos.row + offSet)][pos.col - offSet].occupyingPiece?.typeOfPiece == PieceType.Bishop
            || this.squares[7 - (pos.row + offSet)][pos.col - offSet].occupyingPiece?.typeOfPiece == PieceType.Queen) {
            return true;
          }
        }
        else {
          break;
        }
      }
    }
    //top right
    //rows (+) col (+)
    for (let offSet: number = 1; pos.col + offSet <= 7 && pos.row + offSet <= 7; offSet++) {
      if (this.squares[7 - (pos.row + offSet)][pos.col + offSet].occupyingPiece) {
        if (this.squares[7 - (pos.row + offSet)][pos.col + offSet].occupyingPiece?.colorOfPiece != this.currentTurn) {
          if (this.squares[7 - (pos.row + offSet)][pos.col + offSet].occupyingPiece?.typeOfPiece == PieceType.Bishop
            || this.squares[7 - (pos.row + offSet)][pos.col + offSet].occupyingPiece?.typeOfPiece == PieceType.Queen) {
            return true;
          }
        }
        else {
          break;
        }
      }
    }

    //bottom left
    //rows (-) col (-)
    for (let offSet: number = 1; pos.col - offSet >= 0 && pos.row - offSet >= 0; offSet++) {
      if (this.squares[7 - (pos.row - offSet)][pos.col - offSet].occupyingPiece){
        if(this.squares[7 - (pos.row - offSet)][pos.col - offSet].occupyingPiece?.colorOfPiece != this.currentTurn) {
          if (this.squares[7 - (pos.row - offSet)][pos.col - offSet].occupyingPiece?.typeOfPiece == PieceType.Bishop
              || this.squares[7 - (pos.row - offSet)][pos.col - offSet].occupyingPiece?.typeOfPiece == PieceType.Queen) {
            return true;
          }
          
        }
        else {
          break;
        }
      }
    }

    //bottom right
    //row(-) col (+)
    for (let offSet: number = 1; pos.col + offSet <= 7 && pos.row - offSet >= 0; offSet++) {
      if (this.squares[7 - (pos.row - offSet)][pos.col + offSet].occupyingPiece){
        if(this.squares[7 - (pos.row - offSet)][pos.col + offSet].occupyingPiece?.colorOfPiece != this.currentTurn) {
          if (this.squares[7 - (pos.row - offSet)][pos.col + offSet].occupyingPiece?.typeOfPiece == PieceType.Bishop
              || this.squares[7 - (pos.row - offSet)][pos.col + offSet].occupyingPiece?.typeOfPiece == PieceType.Queen) {
            return true;
          }
        }
        else {
          break;
        }
      }
    }
    return false;
  }
  orthogonalAttack(pos: SquareComponent): boolean {
    //up 
    //rows (+)
    for (let offSet: number = 1; pos.row + offSet <= 7; offSet++) {
      if (this.squares[7 - (pos.row + offSet)][pos.col].occupyingPiece){
        if(this.squares[7 - (pos.row + offSet)][pos.col].occupyingPiece?.colorOfPiece != this.currentTurn) {
          if (this.squares[7 - (pos.row + offSet)][pos.col].occupyingPiece?.typeOfPiece == PieceType.Rook
              || this.squares[7 - (pos.row + offSet)][pos.col].occupyingPiece?.typeOfPiece == PieceType.Queen) {
            return true;
          }
        }
        else {
          break;
        }
      }
    }

    //down
    //rows (-)
    for (let offSet: number = 1; pos.row - offSet >= 0; offSet++) {
      if (this.squares[7 - (pos.row - offSet)][pos.col].occupyingPiece){
        if(this.squares[7 - (pos.row - offSet)][pos.col].occupyingPiece?.colorOfPiece != this.currentTurn){
          if (this.squares[7 - (pos.row - offSet)][pos.col].occupyingPiece?.typeOfPiece == PieceType.Rook
              || this.squares[7 - (pos.row - offSet)][pos.col].occupyingPiece?.typeOfPiece == PieceType.Queen) {
            return true;
          }
        }
        else {
          break;
        }
      }
    }

    //left
    //col (-)
    for (let offSet: number = 1; pos.col - offSet >= 0 && pos.row <= 7; offSet++) {
      if (this.squares[7 - pos.row][pos.col - offSet].occupyingPiece){
        if(this.squares[7 - pos.row][pos.col - offSet].occupyingPiece?.colorOfPiece != this.currentTurn) {
          if (this.squares[7 - pos.row][pos.col - offSet].occupyingPiece?.typeOfPiece == PieceType.Rook
            || this.squares[7 - pos.row][pos.col - offSet].occupyingPiece?.typeOfPiece == PieceType.Queen) {
            return true;
          }
        }
        else {
          break;
        }
      }
    }

    //right
    //col(+)
    for (let offSet: number = 1; pos.col + offSet <= 7 && pos.row <= 7; offSet++) {
      if (this.squares[7 - pos.row][pos.col + offSet].occupyingPiece){
        if(this.squares[7 - pos.row][pos.col + offSet].occupyingPiece?.colorOfPiece != this.currentTurn) {
          if (this.squares[7 - pos.row][pos.col + offSet].occupyingPiece?.typeOfPiece == PieceType.Rook
            || this.squares[7 - pos.row][pos.col + offSet].occupyingPiece?.typeOfPiece == PieceType.Queen) {
            return true;
          }
        }
        else {
          break;
        }
      }
    }
    // console.log("right added");
    // console.log(toReturn);
    return false;
  }
  knightAttack(pos: SquareComponent): boolean {
    let move = new SquareComponent();

    move.row = pos.row + 2 as Coord;
    move.col = pos.col - 1 as Coord;
    //move1 : row + 2, col - 1
    if (move.row <= 7 && move.row >= 0 && move.col <= 7 && move.col >= 0) {
      if (this.squares[7 - (move.row)][move.col].occupyingPiece?.colorOfPiece != this.currentTurn) {
        if (this.squares[7 - (move.row)][move.col].occupyingPiece?.typeOfPiece == PieceType.Knight) {
          return true;
        }
      }
    }

    move.row = pos.row + 2 as Coord;
    move.col = pos.col + 1 as Coord;
    //move2 : row + 2, col + 1
    if (move.row <= 7 && move.row >= 0 && move.col <= 7 && move.col >= 0) {
      if (this.squares[7 - (move.row)][move.col].occupyingPiece?.colorOfPiece != this.currentTurn) {
        if (this.squares[7 - (move.row)][move.col].occupyingPiece?.typeOfPiece == PieceType.Knight) {
          return true;
        }
      }
    }

    move.row = pos.row - 2 as Coord;
    move.col = pos.col - 1 as Coord;
    //move3 : row - 2, col - 1
    if (move.row <= 7 && move.row >= 0 && move.col <= 7 && move.col >= 0) {
      if (this.squares[7 - (move.row)][move.col].occupyingPiece
        && this.squares[7 - (move.row)][move.col].occupyingPiece?.colorOfPiece != this.currentTurn) {
        if (this.squares[7 - (move.row)][move.col].occupyingPiece?.typeOfPiece == PieceType.Knight) {
          return true;
        }
      }
    }

    move.row = pos.row - 2 as Coord;
    move.col = pos.col + 1 as Coord;
    //move4 : row - 2, col + 1
    if (move.row <= 7 && move.row >= 0 && move.col <= 7 && move.col >= 0) {
      if (this.squares[7 - (move.row)][move.col].occupyingPiece?.colorOfPiece != this.currentTurn) {
        if (this.squares[7 - (move.row)][move.col].occupyingPiece?.typeOfPiece == PieceType.Knight) {
          return true;
        }
      }
    }

    move.row = pos.row - 1 as Coord;
    move.col = pos.col - 2 as Coord;
    //move5 : row - 1, col - 2
    if (move.row <= 7 && move.row >= 0 && move.col <= 7 && move.col >= 0) {
      if (this.squares[7 - (move.row)][move.col].occupyingPiece?.colorOfPiece != this.currentTurn) {
        if (this.squares[7 - (move.row)][move.col].occupyingPiece?.typeOfPiece == PieceType.Knight) {
          return true;
        }
      }
    }

    move.row = pos.row + 1 as Coord;
    move.col = pos.col - 2 as Coord;
    //move6 : row + 1, col - 2
    if (move.row <= 7 && move.row >= 0 && move.col <= 7 && move.col >= 0) {
      if (this.squares[7 - (move.row)][move.col].occupyingPiece?.colorOfPiece != this.currentTurn) {
        if (this.squares[7 - (move.row)][move.col].occupyingPiece?.typeOfPiece == PieceType.Knight) {
          return true;
        }
      }
    }

    move.row = pos.row - 1 as Coord;
    move.col = pos.col + 2 as Coord;
    //move7 : row - 1, col + 2
    if (move.row <= 7 && move.row >= 0 && move.col <= 7 && move.col >= 0) {
      if (this.squares[7 - (move.row)][move.col].occupyingPiece?.colorOfPiece != this.currentTurn) {
        if (this.squares[7 - (move.row)][move.col].occupyingPiece?.typeOfPiece == PieceType.Knight) {
          return true;
        }
      }
    }

    move.row = pos.row + 1 as Coord;
    move.col = pos.col + 2 as Coord;
    //move8 : row + 1, col + 2
    if (move.row <= 7 && move.row >= 0 && move.col <= 7 && move.col >= 0) {
      if (this.squares[7 - (move.row)][move.col].occupyingPiece?.colorOfPiece != this.currentTurn) {
        if (this.squares[7 - (move.row)][move.col].occupyingPiece?.typeOfPiece == PieceType.Knight) {
          return true;
        }
      }
    }
    return false;
  }
  pawnAttack(pos: SquareComponent): boolean {
    if (this.currentTurn == PieceColor.White) {
      let row:number = (this.viewMode)? (7 - (pos.row + 1)):(pos.row - 1);


      if (pos.col<=6
        &&this.squares[row][pos.col + 1].occupyingPiece
        && this.squares[row][pos.col + 1].occupyingPiece?.colorOfPiece == PieceColor.Black) {
        if (this.squares[row][pos.col].occupyingPiece?.typeOfPiece == PieceType.Pawn) {
          return true;
        }
      }
      if (pos.col>=1
        &&this.squares[row][pos.col - 1].occupyingPiece
        && this.squares[row][pos.col - 1].occupyingPiece?.colorOfPiece == PieceColor.Black) {
        if (this.squares[row][pos.col - 1].occupyingPiece?.typeOfPiece == PieceType.Pawn) {
          return true;
        }
      }
    }
    else {
      let row:number = (this.viewMode)? (7 - (pos.row - 1)):(pos.row + 1);
      if (pos.col<=6
        &&this.squares[row][pos.col + 1].occupyingPiece
        && this.squares[row][pos.col + 1].occupyingPiece?.colorOfPiece == PieceColor.White) {
        if (this.squares[row][pos.col].occupyingPiece?.typeOfPiece == PieceType.Pawn) {
          return true;
        }
      }
      if (pos.col>=1
        &&this.squares[row][pos.col - 1].occupyingPiece
        && this.squares[row][pos.col - 1].occupyingPiece?.colorOfPiece == PieceColor.White) {
        if (this.squares[row][pos.col - 1].occupyingPiece?.typeOfPiece == PieceType.Pawn) {
          return true;
        }
      }
    }
    return false;
  }

  kingMoves(square: SquareComponent): void {
    let row: number = 7 - square.row;
    let col: number = square.col;
    let potentialMoves: Move[] = this.selectedPiece.potentialMoves(square);
    let upperLimit: number = 8;
    let lowerLimit: number = -1;
    let leftLimit: number = -1;
    let rightLimit: number = 8;
    for (let move of potentialMoves) {

      let toRow: Coord | number = 7 - move.to.row;
      let toCol: Coord | number = move.to.col;
      this.showPotentialMoves = true;
      if (this.squares[toRow][toCol].occupyingPiece
        && this.squares[toRow][toCol].occupyingPiece?.colorOfPiece == this.selectedPieceColor
        || ((toRow > upperLimit) || (toRow < lowerLimit) || (toCol < leftLimit) || (toCol > rightLimit))) {

      }
      else {
        this.squares[toRow][toCol].potentialMoveMark = true;
      }
    }
    // Castling check.
    if (this.kingInCheck(square)) {
      return;
    }
    if (this.currentTurn == PieceColor.White) {
      if (this.wkCastle) {
        // check if these squares are un-occupied and not being attacked.
        if (!this.squares[row][col + 1].occupyingPiece
          && !this.squares[row][col + 2].occupyingPiece) {
          if (!this.kingInCheck(this.squares[row][col + 1])
            && !this.kingInCheck(this.squares[row][col + 2])) {
            this.squares[row][col + 2].potentialMoveMark = true;
          }
        }
      }
      if (this.wqCastle) {
        // check if these squares are un-occupied and not being attacked.
        if (!this.squares[row][col - 1].occupyingPiece
          && !this.squares[row][col - 2].occupyingPiece
          && !this.squares[row][col - 3].occupyingPiece) {
          if (!this.kingInCheck(this.squares[row][col - 1])
            && !this.kingInCheck(this.squares[row][col - 2])
            && !this.kingInCheck(this.squares[row][col - 3])) {
            this.squares[row][col - 2].potentialMoveMark = true;
          }
        }
      }
    }
    else {
      if (this.bkCastle) {
        if (!this.squares[row][col + 1].occupyingPiece
          && !this.squares[row][col + 2].occupyingPiece) {
          if (!this.kingInCheck(this.squares[row][col + 1])
            && !this.kingInCheck(this.squares[row][col + 2])) {
            this.squares[row][col + 2].potentialMoveMark = true;
          }
        }
      }
      if (this.bqCastle) {
        if (!this.squares[row][col - 1].occupyingPiece
          && !this.squares[row][col - 2].occupyingPiece
          && !this.squares[row][col - 3].occupyingPiece) {
          if (!this.kingInCheck(this.squares[row][col - 1])
            && !this.kingInCheck(this.squares[row][col - 2])
            && !this.kingInCheck(this.squares[row][col - 3])) {
            this.squares[row][col - 2].potentialMoveMark = true;
          }
        }
      }
    }
  }
  pawnMoves(square: SquareComponent): void {
    
    let potentialMoves: Move[] =this.selectedPiece.potentialMoves(square);
    let upperLimit: number = 8;
    let lowerLimit: number = -1;
    let leftLimit: number = -1;
    let rightLimit: number = 8;
    
    if(this.currentTurn==PieceColor.White){
      if(this.viewMode){
        potentialMoves=whitePawnPotentialMoves(square);
      }
      else{
        
        potentialMoves = blackPawnPotentialMoves(square);
      }
    }
    else{
      if(this.viewMode){
        potentialMoves=blackPawnPotentialMoves(square);
      }
      else{
        
        potentialMoves = whitePawnPotentialMoves(square);
      }
    }
    
    for (let move of potentialMoves) {
      console.log("potential move:");
      console.log("move");
      console.log(move);
      let toRow: Coord | number = (7 - move.to.row);
      let toCol: Coord | number = move.to.col;
      this.showPotentialMoves = true;
      let row: number = (7 - square.row);

      if (move.mustCapture) {
        this.enPassantCheck(move, toRow as Coord, toCol as Coord);
        console.log("move must capture");
        console.log(move);
        if (this.squares[toRow][toCol].occupyingPiece && this.squares[toRow][toCol].occupyingPiece?.colorOfPiece != this.currentTurn) {
          this.squares[toRow][toCol].potentialMoveMark = true;
          console.log("affected square:");
          console.log(this.squares[toRow][toCol]);
        }
      }
      else if (this.squares[toRow][toCol].occupyingPiece
        || ((toRow > upperLimit) || (toRow < lowerLimit) || (toCol < leftLimit) || (toCol > rightLimit))) {
        if (row > toRow && toRow > lowerLimit) {
          lowerLimit = toRow;
        } else if (row < toRow && toRow < upperLimit) {
          upperLimit = toRow;
        }
        if (square.col > toCol && toCol > leftLimit) {
          leftLimit = toCol;
        } else if (square.col < toCol && toCol < upperLimit) {
          rightLimit = toCol;
        }

      }
      else {
        this.squares[toRow][toCol].potentialMoveMark = true;
        console.log("affected square:");
        console.log(this.squares[toRow][toCol]);
      }
    }
  }
  bishopMoves(pos: SquareComponent): void {
    //top left 
    //rows (+) col (-)
    for (let offSet: number = 1; pos.col - offSet >= 0 && pos.row + offSet <= 7; offSet++) {
      if (this.squares[7 - (pos.row + offSet)][pos.col - offSet].occupyingPiece) {
        if (this.squares[7 - (pos.row + offSet)][pos.col - offSet].occupyingPiece?.colorOfPiece != this.selectedPieceColor) {
          this.squares[7 - (pos.row + offSet)][pos.col - offSet].potentialMoveMark = true;
          break;
        }
        else {
          break;
        }
      }
      else {
        this.squares[7 - (pos.row + offSet)][pos.col - offSet].potentialMoveMark = true;
      }
    }
    //top right
    //rows (+) col (+)
    for (let offSet: number = 1; pos.col + offSet <= 7 && pos.row + offSet <= 7; offSet++) {
      if (this.squares[7 - (pos.row + offSet)][pos.col + offSet].occupyingPiece) {
        if (this.squares[7 - (pos.row + offSet)][pos.col + offSet].occupyingPiece?.colorOfPiece != this.selectedPieceColor) {
          this.squares[7 - (pos.row + offSet)][pos.col + offSet].potentialMoveMark = true;
          break;
        }
        else {
          break;
        }
      }
      else {
        this.squares[7 - (pos.row + offSet)][pos.col + offSet].potentialMoveMark = true;
      }
    }

    //bottom left
    //rows (-) col (-)
    for (let offSet: number = 1; pos.col - offSet >= 0 && pos.row - offSet >= 0; offSet++) {
      if (this.squares[7 - (pos.row - offSet)][pos.col - offSet].occupyingPiece) {
        if (this.squares[7 - (pos.row - offSet)][pos.col - offSet].occupyingPiece?.colorOfPiece != this.selectedPieceColor) {
          this.squares[7 - (pos.row - offSet)][pos.col - offSet].potentialMoveMark = true;
          break;
        }
        else {
          break;
        }
      }
      else {
        this.squares[7 - (pos.row - offSet)][pos.col - offSet].potentialMoveMark = true;
      }
    }

    //bottom right
    //row(-) col (+)
    for (let offSet: number = 1; pos.col + offSet <= 7 && pos.row - offSet >= 0; offSet++) {
      if (this.squares[7 - (pos.row - offSet)][pos.col + offSet].occupyingPiece) {
        if (this.squares[7 - (pos.row - offSet)][pos.col + offSet].occupyingPiece?.colorOfPiece != this.selectedPieceColor) {
          this.squares[7 - (pos.row - offSet)][pos.col + offSet].potentialMoveMark = true;
          break;
        }
        else {
          break;
        }
      }
      else {
        this.squares[7 - (pos.row - offSet)][pos.col + offSet].potentialMoveMark = true;
      }
    }
  }
  knightMoves(square: SquareComponent): void {
    let potentialMoves: Move[] = this.selectedPiece.potentialMoves(square);
    let upperLimit: number = 8;
    let lowerLimit: number = -1;
    let leftLimit: number = -1;
    let rightLimit: number = 8;

    for (let move of potentialMoves) {
      let toRow: Coord | number = 7 - move.to.row;
      let toCol: Coord | number = move.to.col;
      this.showPotentialMoves = true;
      if (this.squares[toRow][toCol].occupyingPiece
        && this.squares[toRow][toCol].occupyingPiece?.colorOfPiece == this.selectedPieceColor
        || ((toRow > upperLimit) || (toRow < lowerLimit) || (toCol < leftLimit) || (toCol > rightLimit))) {
      }
      else {
        this.squares[toRow][toCol].potentialMoveMark = true;
      }
    }
  }
  rookMoves(square: SquareComponent): void {
    //up
    //rows (+)
    for (let offSet: number = 1; square.row + offSet <= 7; offSet++) {
      if (this.squares[7 - (square.row + offSet)][square.col].occupyingPiece) {
        if (this.squares[7 - (square.row + offSet)][square.col].occupyingPiece?.colorOfPiece != this.selectedPieceColor) {
          this.squares[7 - (square.row + offSet)][square.col].potentialMoveMark = true;
          break;
        }
        else {
          break;
        }
      }
      else {
        this.squares[7 - (square.row + offSet)][square.col].potentialMoveMark = true;
      }
    }
    //down
    //rows (-)
    for (let offSet: number = 1; square.row - offSet >= 0; offSet++) {
      if (this.squares[7 - (square.row - offSet)][square.col].occupyingPiece) {
        if (this.squares[7 - (square.row - offSet)][square.col].occupyingPiece?.colorOfPiece != this.selectedPieceColor) {
          this.squares[7 - (square.row - offSet)][square.col].potentialMoveMark = true;
          break;
        }
        else {
          break;
        }
      }
      else {
        this.squares[7 - (square.row - offSet)][square.col].potentialMoveMark = true;
      }
    }

    //left
    //col (-)
    for (let offSet: number = 1; square.col - offSet >= 0; offSet++) {
      if (this.squares[7 - square.row][square.col-offSet].occupyingPiece) {
        if (this.squares[7 - square.row][square.col-offSet].occupyingPiece?.colorOfPiece != this.selectedPieceColor) {
          this.squares[7 - square.row][square.col-offSet].potentialMoveMark = true;
          break;
        }
        else {
          break;
        }
      }
      else {
        this.squares[7 - square.row][square.col-offSet].potentialMoveMark = true;
      }
    }

    //right
    //col (+)
    for (let offSet: number = 1; square.col + offSet <= 7; offSet++) {
      if (this.squares[7 - square.row][square.col + offSet].occupyingPiece) {
        if (this.squares[7 - square.row][square.col + offSet].occupyingPiece?.colorOfPiece != this.selectedPieceColor) {
          this.squares[7 - square.row][square.col + offSet].potentialMoveMark = true;
          break;
        }
        else {
          break;
        }
      }
      else {
        this.squares[7 - square.row][square.col + offSet].potentialMoveMark = true;
      }
    }
  }



  enPassantCheck(move: Move, toRow: Coord, toCol: Coord): void {
    if (this.enPassant && (this.selectedPiece.typeOfPiece == PieceType.Pawn)) {
      console.log("move: ");
      console.log(move);
      console.log("this.enPassant?.row==toRow && this.enPassant?.col == toCol");
      console.log(this.enPassant?.row == toRow && this.enPassant?.col == toCol);
      console.log("this.enpassant.row: " + this.enPassant.row);
      console.log("this.enpassant.col: " + this.enPassant.col);
      console.log("toRow: " + toRow);
      console.log("toCol: " + toCol);

      let row = (this.viewMode)? (7 - toRow):toRow;
      if (this.enPassant?.row == row && this.enPassant?.col == toCol) {
        this.squares[toRow][toCol].potentialMoveMark = true;
      }

      console.log("affected square:");
      console.log(this.squares[toRow][toCol]);
    }
  }
  removeHighlight(): void {
    this.showPotentialMoves = false;
    for (let i = 0; i < 8; i++) {
      for (let j = 0; j < 8; j++) {
        this.squares[i][j].potentialMoveMark = false;
      }
    }
  }

  reloadBoard(): void {
    this.initialize();
    this.setupBoard();
  }

  retrieveGameById(): void {
    this.gameId = +this.route.snapshot.paramMap.get('id')!;
    this.viewMode = this.route.snapshot.paramMap.get('color') == 'white';
    console.log("submit");
    console.log(this.gameId);
    this.gameService.getGameById(this.gameId)
      .subscribe(game => {
        console.log(game);
        this.gameId = game.gameId;
        this.FEN = game.state;
        this.gameOver = game.gameOver;
        this.initialize();
        this.setupBoard();
      });
  }



  makeMove(toMake: MoveRequest): void {
    console.log(toMake)
    this.gameService.makeMove(toMake)
      .subscribe(game => {
        console.log(game);
        this.gameId = game.gameId;
        this.FEN = game.state.trim();
        this.gameOver = game.gameOver;
        this.reloadBoard();
      })
  }

  undoMove(): void {
    console.log("undoing move");
    console.log(this.FEN);
    let toUndo: any = {
      gameId: this.gameId,
      currentState: this.FEN
    }
    this.gameService.undoMove(toUndo)
      .subscribe(game => {
        console.log(game);
        this.gameId = game.gameId;
        this.FEN = game.state?.trim();
        this.gameOver = game.gameOver;
        this.reloadBoard();
      })
  }

}
