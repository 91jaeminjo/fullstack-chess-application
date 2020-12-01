import { Component, Input, NgZone, OnInit } from '@angular/core';

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



import { map, catchError, tap, takeUntil } from 'rxjs/operators';

import { Observable, Subject } from 'rxjs';
import * as SockJS from 'sockjs-client';
import { Stomp } from '@stomp/stompjs/esm6/compatibility/stomp';


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
  oneSideViewWithWS!: boolean;
  viewWhiteOnly: boolean = true; // true = white, false = black;
  squares!: SquareComponent[][];
  tempSquares!: SquareComponent[][]
  promotion: boolean = false;
  promotePiece: string = "";
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


  wsFEN!: any;
  destroyed$ = new Subject();
  webSocketEndPoint: string = 'http://localhost:8080/ws';
  topic: string = "/topic/chess-front-end";
  stompClient: any;
  socket = new SockJS(this.webSocketEndPoint);

  constructor(public route: ActivatedRoute, public gameService: GameServiceService) {

  }


  ngOnDestroy() {
    //this.webSocketAPI.disconnect();
    this.destroyed$.next();
  }

  connect() {
    console.log("Initialize WebSocket Connection");
    let ws = new SockJS(this.webSocketEndPoint);
    this.stompClient = Stomp.over(ws);
    const _this = this;
    _this.stompClient.connect({}, function (frame: any) {
      _this.stompClient.subscribe(_this.topic, function (sdkEvent: any) {
        _this.onMessageReceived(sdkEvent);
      });
      //_this.stompClient.reconnect_delay = 2000;
    }, this.errorCallBack);
  };

  disconnect() {
    if (this.stompClient !== null) {
      this.stompClient.disconnect();
    }
    console.log("Disconnected");
  }

  // on error, schedule a reconnection attempt
  errorCallBack(error: any) {
    console.log("errorCallBack -> " + error)
    setTimeout(() => {
      this.connect();
    }, 5000);
  }

  /**
  * Send message to sever via web socket
  * @param {*} message 
  */


  

  onMessageReceived(message: any) {
    console.log("Message Recieved from Server :: ");
    console.log(JSON.parse(message.body));
    console.log("message");
    console.log(message);

    let gameObject = JSON.parse(message.body);
    console.log("gameObject");
    console.log(gameObject);
    console.log(gameObject.gameId);
    console.log(gameObject.state);
    this.gameId = gameObject.gameId;
    this.FEN = gameObject.state.trim();
    this.gameOver = gameObject.gameOver;

    this.reloadBoard();
  }
  
  ngOnInit(): void {
    //this.webSocketAPI = new WebSocketAPI(new BoardComponent(this.webSocketService, this.route, this.gameService));
    //this.webSocketAPI.connect();

    this.connect();

    this.retrieveGameById();
    this.oneSideViewWithWS = this.route.snapshot.paramMap.get('color') == 'white'
      || this.route.snapshot.paramMap.get('color') == 'black';


  }

  flipView(): void {
    this.viewWhiteOnly = !this.viewWhiteOnly;
    this.initialize();
    this.reloadBoard();
  }
  checkPromotion(): void {

    if (this.isWhiteTurn) {
      let row = 1;
      for (let i = 0; i <= 7; i++) {
        if (this.tempSquares[row][i].occupyingPiece?.typeOfPiece == PieceType.Pawn
          && this.tempSquares[row][i].occupyingPiece?.colorOfPiece == PieceColor.White) {
          this.promotion = true;
          console.log("white row: " + row);
          console.log(this.tempSquares[row][i]);
          return;
        }

      }
    } else {
      let row = 6;
      for (let i = 0; i <= 7; i++) {
        if (this.tempSquares[row][i].occupyingPiece?.typeOfPiece == PieceType.Pawn
          && this.tempSquares[row][i].occupyingPiece?.colorOfPiece == PieceColor.Black) {
          this.promotion = true;
          console.log("black row: " + row);
          console.log(this.tempSquares[row][i]);
          return;
        }
      }
    }
    this.promotion = false;
    console.log("this.promotion: " + this.promotion);
  }
  promoteTo(type: string): void {
    console.log("promotion: " + this.promotion);
    console.log(type);
    this.promotePiece = type;
  }


  initialize(): void {
    console.log("from board component");
    console.log("FEN: " + this.FEN);
    let input: string[] = this.FEN.split(" ");
    this.state = input[0].split("/").reverse();

    this.squares = [];
    this.isWhiteTurn = input[1] == 'w';
    this.currentTurn = this.isWhiteTurn ? PieceColor.White : PieceColor.Black;
    this.message = "";
    if (this.gameOver) {
      this.message = "Game Over! ";
      if (this.isWhiteTurn) {
        this.message += "Black Wins!";
      }
      else {
        this.message += "White Wins!";
      }
    }
    else if (this.isWhiteTurn) {
      this.message = "White's Turn.";
    }
    else {
      this.message = "Black's Turn.";
    }
    console.log("message: " + this.message);
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
      if (this.viewWhiteOnly) {
        this.squares.unshift(squareLine);
      } else {

        this.squares.push(squareLine);
      }
    }
    if (this.viewWhiteOnly) {
      this.tempSquares = this.squares;
    }
    else {
      this.tempSquares = this.flipBoard(this.squares);
    }

    this.checkPromotion();
    console.log(this.squares);
    console.log(this.tempSquares);

  }

  flipBoard(squaresArg: SquareComponent[][]): SquareComponent[][] {
    let temp: SquareComponent[][] = [];
    for (let i = 0; i < 8; i++) {
      temp.unshift(squaresArg[i])
    }
    return temp;
  }

  onSelect(square: SquareComponent): void {
    console.log("selected square component");
    console.log(square);


    // If game over
    if (this.gameOver) {
      return;
    }
    if (!this.viewWhiteOnly) {

      this.tempSquares = this.flipBoard(this.squares);
    }

    if (square.potentialMoveMark) {

      let moveString = this.selectedSquare.toChessCoord() + square.toChessCoord();
      if (this.promotion && (this.selectedPiece.typeOfPiece == PieceType.Pawn)) {
        moveString += this.promotePiece;
        this.promotion = false;
      }
      let newMove: MoveRequest = {
        gameId: this.gameId,
        newMove: moveString,
        currentState: this.FEN
      }
      console.log("moveString: " + moveString);
      if (this.oneSideViewWithWS) {
        console.log("connecting to websocket");
        //this.webSocketService.sendMessage(newMove);

        this.makeMoveWS(newMove);
      }
      else {
        this.makeMove(newMove);
      }

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
      console.log("this.tempSquares: ");
      console.log(this.tempSquares);
    }
    else {
      this.pieceSelected = false;
    }
    if (!this.viewWhiteOnly) {
      this.squares = this.flipBoard(this.tempSquares);
    }
    console.log(this.squares);
    console.log(this.tempSquares);
  }

  kingInCheck(square: SquareComponent): boolean {
    if (this.diagonalAttack(square)) {
      console.log("diagonally being attacked");
      return true;
    }
    if (this.orthogonalAttack(square)) {
      console.log("orthogonally being attacked");
      return true;
    }
    if (this.knightAttack(square)) {
      console.log("being attacked by knight");
      return true;
    }
    if (this.pawnAttack(square)) {
      console.log("being attacked by pawn");
      return true;
    }
    return false;
  }

  diagonalAttack(pos: SquareComponent): boolean {
    //top left 
    //rows (+) col (-)
    for (let offSet: number = 1; pos.col - offSet >= 0 && pos.row + offSet <= 7; offSet++) {
      if (this.tempSquares[7 - (pos.row + offSet)][pos.col - offSet].occupyingPiece) {
        if (this.tempSquares[7 - (pos.row + offSet)][pos.col - offSet].occupyingPiece?.colorOfPiece != this.currentTurn
          && (this.tempSquares[7 - (pos.row + offSet)][pos.col - offSet].occupyingPiece?.typeOfPiece == PieceType.Bishop
            || this.tempSquares[7 - (pos.row + offSet)][pos.col - offSet].occupyingPiece?.typeOfPiece == PieceType.Queen)) {
          console.log("top left");
          return true;

        }
        else {
          break;
        }
      }
    }
    //top right
    //rows (+) col (+)
    for (let offSet: number = 1; pos.col + offSet <= 7 && pos.row + offSet <= 7; offSet++) {
      if (this.tempSquares[7 - (pos.row + offSet)][pos.col + offSet].occupyingPiece) {
        if (this.tempSquares[7 - (pos.row + offSet)][pos.col + offSet].occupyingPiece?.colorOfPiece != this.currentTurn
          && (this.tempSquares[7 - (pos.row + offSet)][pos.col + offSet].occupyingPiece?.typeOfPiece == PieceType.Bishop
            || this.tempSquares[7 - (pos.row + offSet)][pos.col + offSet].occupyingPiece?.typeOfPiece == PieceType.Queen)) {
          console.log("top right");
          return true;

        }
        else {
          break;
        }
      }
    }

    //bottom left
    //rows (-) col (-)
    for (let offSet: number = 1; pos.col - offSet >= 0 && pos.row - offSet >= 0; offSet++) {
      if (this.tempSquares[7 - (pos.row - offSet)][pos.col - offSet].occupyingPiece) {
        if (this.tempSquares[7 - (pos.row - offSet)][pos.col - offSet].occupyingPiece?.colorOfPiece != this.currentTurn
          && (this.tempSquares[7 - (pos.row - offSet)][pos.col - offSet].occupyingPiece?.typeOfPiece == PieceType.Bishop
            || this.tempSquares[7 - (pos.row - offSet)][pos.col - offSet].occupyingPiece?.typeOfPiece == PieceType.Queen)) {
          console.log("bottom left");
          return true;
        }
        else {
          break;
        }
      }
    }

    //bottom right
    //row(-) col (+)
    for (let offSet: number = 1; pos.col + offSet <= 7 && pos.row - offSet >= 0; offSet++) {
      if (this.tempSquares[7 - (pos.row - offSet)][pos.col + offSet].occupyingPiece) {
        if (this.tempSquares[7 - (pos.row - offSet)][pos.col + offSet].occupyingPiece?.colorOfPiece != this.currentTurn
          && (this.tempSquares[7 - (pos.row - offSet)][pos.col + offSet].occupyingPiece?.typeOfPiece == PieceType.Bishop
            || this.tempSquares[7 - (pos.row - offSet)][pos.col + offSet].occupyingPiece?.typeOfPiece == PieceType.Queen)) {
          console.log("bottom right");
          return true;

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
      if (this.tempSquares[7 - (pos.row + offSet)][pos.col].occupyingPiece) {
        if (this.tempSquares[7 - (pos.row + offSet)][pos.col].occupyingPiece?.colorOfPiece != this.currentTurn
          && (this.tempSquares[7 - (pos.row + offSet)][pos.col].occupyingPiece?.typeOfPiece == PieceType.Rook
            || this.tempSquares[7 - (pos.row + offSet)][pos.col].occupyingPiece?.typeOfPiece == PieceType.Queen)) {
          return true;

        }
        else {
          break;
        }
      }
    }

    //down
    //rows (-)
    for (let offSet: number = 1; pos.row - offSet >= 0; offSet++) {
      if (this.tempSquares[7 - (pos.row - offSet)][pos.col].occupyingPiece) {
        if (this.tempSquares[7 - (pos.row - offSet)][pos.col].occupyingPiece?.colorOfPiece != this.currentTurn
          && (this.tempSquares[7 - (pos.row - offSet)][pos.col].occupyingPiece?.typeOfPiece == PieceType.Rook
            || this.tempSquares[7 - (pos.row - offSet)][pos.col].occupyingPiece?.typeOfPiece == PieceType.Queen)) {
          return true;

        }
        else {
          break;
        }
      }
    }

    //left
    //col (-)
    for (let offSet: number = 1; pos.col - offSet >= 0; offSet++) {
      if (this.tempSquares[7 - pos.row][pos.col - offSet].occupyingPiece) {
        if (this.tempSquares[7 - pos.row][pos.col - offSet].occupyingPiece?.colorOfPiece != this.currentTurn
          && (this.tempSquares[7 - pos.row][pos.col - offSet].occupyingPiece?.typeOfPiece == PieceType.Rook
            || this.tempSquares[7 - pos.row][pos.col - offSet].occupyingPiece?.typeOfPiece == PieceType.Queen)) {
          return true;

        }
        else {
          break;
        }
      }
    }

    //right
    //col(+)
    for (let offSet: number = 1; pos.col + offSet <= 7; offSet++) {
      if (this.tempSquares[7 - pos.row][pos.col + offSet].occupyingPiece) {
        if (this.tempSquares[7 - pos.row][pos.col + offSet].occupyingPiece?.colorOfPiece != this.currentTurn
          && (this.tempSquares[7 - pos.row][pos.col + offSet].occupyingPiece?.typeOfPiece == PieceType.Rook
            || this.tempSquares[7 - pos.row][pos.col + offSet].occupyingPiece?.typeOfPiece == PieceType.Queen)) {
          return true;

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
      if (this.tempSquares[7 - (move.row)][move.col].occupyingPiece?.colorOfPiece != this.currentTurn) {
        if (this.tempSquares[7 - (move.row)][move.col].occupyingPiece?.typeOfPiece == PieceType.Knight) {
          return true;
        }
      }
    }

    move.row = pos.row + 2 as Coord;
    move.col = pos.col + 1 as Coord;
    //move2 : row + 2, col + 1
    if (move.row <= 7 && move.row >= 0 && move.col <= 7 && move.col >= 0) {
      if (this.tempSquares[7 - (move.row)][move.col].occupyingPiece?.colorOfPiece != this.currentTurn) {
        if (this.tempSquares[7 - (move.row)][move.col].occupyingPiece?.typeOfPiece == PieceType.Knight) {
          return true;
        }
      }
    }

    move.row = pos.row - 2 as Coord;
    move.col = pos.col - 1 as Coord;
    //move3 : row - 2, col - 1
    if (move.row <= 7 && move.row >= 0 && move.col <= 7 && move.col >= 0) {
      if (this.tempSquares[7 - (move.row)][move.col].occupyingPiece
        && this.tempSquares[7 - (move.row)][move.col].occupyingPiece?.colorOfPiece != this.currentTurn) {
        if (this.tempSquares[7 - (move.row)][move.col].occupyingPiece?.typeOfPiece == PieceType.Knight) {
          return true;
        }
      }
    }

    move.row = pos.row - 2 as Coord;
    move.col = pos.col + 1 as Coord;
    //move4 : row - 2, col + 1
    if (move.row <= 7 && move.row >= 0 && move.col <= 7 && move.col >= 0) {
      if (this.tempSquares[7 - (move.row)][move.col].occupyingPiece?.colorOfPiece != this.currentTurn) {
        if (this.tempSquares[7 - (move.row)][move.col].occupyingPiece?.typeOfPiece == PieceType.Knight) {
          return true;
        }
      }
    }

    move.row = pos.row - 1 as Coord;
    move.col = pos.col - 2 as Coord;
    //move5 : row - 1, col - 2
    if (move.row <= 7 && move.row >= 0 && move.col <= 7 && move.col >= 0) {
      if (this.tempSquares[7 - (move.row)][move.col].occupyingPiece?.colorOfPiece != this.currentTurn) {
        if (this.tempSquares[7 - (move.row)][move.col].occupyingPiece?.typeOfPiece == PieceType.Knight) {
          return true;
        }
      }
    }

    move.row = pos.row + 1 as Coord;
    move.col = pos.col - 2 as Coord;
    //move6 : row + 1, col - 2
    if (move.row <= 7 && move.row >= 0 && move.col <= 7 && move.col >= 0) {
      if (this.tempSquares[7 - (move.row)][move.col].occupyingPiece?.colorOfPiece != this.currentTurn) {
        if (this.tempSquares[7 - (move.row)][move.col].occupyingPiece?.typeOfPiece == PieceType.Knight) {
          return true;
        }
      }
    }

    move.row = pos.row - 1 as Coord;
    move.col = pos.col + 2 as Coord;
    //move7 : row - 1, col + 2
    if (move.row <= 7 && move.row >= 0 && move.col <= 7 && move.col >= 0) {
      if (this.tempSquares[7 - (move.row)][move.col].occupyingPiece?.colorOfPiece != this.currentTurn) {
        if (this.tempSquares[7 - (move.row)][move.col].occupyingPiece?.typeOfPiece == PieceType.Knight) {
          return true;
        }
      }
    }

    move.row = pos.row + 1 as Coord;
    move.col = pos.col + 2 as Coord;
    //move8 : row + 1, col + 2
    if (move.row <= 7 && move.row >= 0 && move.col <= 7 && move.col >= 0) {
      if (this.tempSquares[7 - (move.row)][move.col].occupyingPiece?.colorOfPiece != this.currentTurn) {
        if (this.tempSquares[7 - (move.row)][move.col].occupyingPiece?.typeOfPiece == PieceType.Knight) {
          return true;
        }
      }
    }
    return false;
  }
  pawnAttack(pos: SquareComponent): boolean {
    if (this.currentTurn == PieceColor.White) {
      if (pos.row <= 6) {
        let row: number = (7 - (pos.row + 1));

        if (pos.col <= 6
          && this.tempSquares[row][pos.col + 1].occupyingPiece
          && this.tempSquares[row][pos.col + 1].occupyingPiece?.colorOfPiece == PieceColor.Black) {
          if (this.tempSquares[row][pos.col + 1].occupyingPiece?.typeOfPiece == PieceType.Pawn) {
            return true;
          }
        }
        if (pos.col >= 1
          && this.tempSquares[row][pos.col - 1].occupyingPiece
          && this.tempSquares[row][pos.col - 1].occupyingPiece?.colorOfPiece == PieceColor.Black) {
          if (this.tempSquares[row][pos.col - 1].occupyingPiece?.typeOfPiece == PieceType.Pawn) {
            return true;
          }
        }
      }

    }
    else {
      if (pos.row >= 1) {
        let row: number = (7 - (pos.row - 1));
        if (pos.col <= 6
          && this.tempSquares[row][pos.col + 1].occupyingPiece
          && this.tempSquares[row][pos.col + 1].occupyingPiece?.colorOfPiece == PieceColor.White) {
          if (this.tempSquares[row][pos.col + 1].occupyingPiece?.typeOfPiece == PieceType.Pawn) {
            return true;
          }
        }
        if (pos.col >= 1
          && this.tempSquares[row][pos.col - 1].occupyingPiece
          && this.tempSquares[row][pos.col - 1].occupyingPiece?.colorOfPiece == PieceColor.White) {
          if (this.tempSquares[row][pos.col - 1].occupyingPiece?.typeOfPiece == PieceType.Pawn) {
            return true;
          }
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
      if (this.tempSquares[toRow][toCol].occupyingPiece
        && this.tempSquares[toRow][toCol].occupyingPiece?.colorOfPiece == this.selectedPieceColor
        || ((toRow > upperLimit) || (toRow < lowerLimit) || (toCol < leftLimit) || (toCol > rightLimit))) {

      }
      else {
        this.tempSquares[toRow][toCol].potentialMoveMark = true;
      }
    }
    // Castling check.
    if (this.kingInCheck(square)) {
      console.log("king in check");
      return;
    }
    if (this.currentTurn == PieceColor.White) {
      if (this.wkCastle) {
        // check if these squares are un-occupied and not being attacked.
        if (!this.tempSquares[row][col + 1].occupyingPiece
          && !this.tempSquares[row][col + 2].occupyingPiece) {
          if (!this.kingInCheck(this.tempSquares[row][col + 1])
            && !this.kingInCheck(this.tempSquares[row][col + 2])) {
            this.tempSquares[row][col + 2].potentialMoveMark = true;
          }
        }
      }
      if (this.wqCastle) {
        // check if these squares are un-occupied and not being attacked.
        if (!this.tempSquares[row][col - 1].occupyingPiece
          && !this.tempSquares[row][col - 2].occupyingPiece
          && !this.tempSquares[row][col - 3].occupyingPiece) {
          if (!this.kingInCheck(this.tempSquares[row][col - 1])
            && !this.kingInCheck(this.tempSquares[row][col - 2])
            && !this.kingInCheck(this.tempSquares[row][col - 3])) {
            this.tempSquares[row][col - 2].potentialMoveMark = true;
          }
        }
      }
    }
    else {
      if (this.bkCastle) {
        if (!this.tempSquares[row][col + 1].occupyingPiece
          && !this.tempSquares[row][col + 2].occupyingPiece) {
          if (!this.kingInCheck(this.tempSquares[row][col + 1])
            && !this.kingInCheck(this.tempSquares[row][col + 2])) {
            this.tempSquares[row][col + 2].potentialMoveMark = true;
          }
        }
      }
      if (this.bqCastle) {
        if (!this.tempSquares[row][col - 1].occupyingPiece
          && !this.tempSquares[row][col - 2].occupyingPiece
          && !this.tempSquares[row][col - 3].occupyingPiece) {
          if (!this.kingInCheck(this.tempSquares[row][col - 1])
            && !this.kingInCheck(this.tempSquares[row][col - 2])
            && !this.kingInCheck(this.tempSquares[row][col - 3])) {
            this.tempSquares[row][col - 2].potentialMoveMark = true;
          }
        }
      }
    }
  }
  pawnMoves(square: SquareComponent): void {

    let potentialMoves: Move[] = this.selectedPiece.potentialMoves(square);
    let upperLimit: number = 8;
    let lowerLimit: number = -1;
    let leftLimit: number = -1;
    let rightLimit: number = 8;

    if (this.currentTurn == PieceColor.White) {
      potentialMoves = whitePawnPotentialMoves(square);
    }
    else {
      potentialMoves = blackPawnPotentialMoves(square);
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
        this.enPassantCheck(toRow as Coord, toCol as Coord);
        console.log("move must capture");
        console.log(move);
        if (this.tempSquares[toRow][toCol].occupyingPiece && this.tempSquares[toRow][toCol].occupyingPiece?.colorOfPiece != this.currentTurn) {
          this.tempSquares[toRow][toCol].potentialMoveMark = true;
          console.log("affected square:");
          console.log(this.tempSquares[toRow][toCol]);
        }
      }
      else if (this.tempSquares[toRow][toCol].occupyingPiece
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
        this.tempSquares[toRow][toCol].potentialMoveMark = true;
        console.log("affected square:");
        console.log(this.tempSquares[toRow][toCol]);
      }
    }
  }
  bishopMoves(pos: SquareComponent): void {
    //top left 
    //rows (+) col (-)
    for (let offSet: number = 1; pos.col - offSet >= 0 && pos.row + offSet <= 7; offSet++) {
      if (this.tempSquares[7 - (pos.row + offSet)][pos.col - offSet].occupyingPiece) {
        if (this.tempSquares[7 - (pos.row + offSet)][pos.col - offSet].occupyingPiece?.colorOfPiece != this.selectedPieceColor) {
          this.tempSquares[7 - (pos.row + offSet)][pos.col - offSet].potentialMoveMark = true;
          break;
        }
        else {
          break;
        }
      }
      else {
        this.tempSquares[7 - (pos.row + offSet)][pos.col - offSet].potentialMoveMark = true;
      }
    }
    //top right
    //rows (+) col (+)
    for (let offSet: number = 1; pos.col + offSet <= 7 && pos.row + offSet <= 7; offSet++) {
      if (this.tempSquares[7 - (pos.row + offSet)][pos.col + offSet].occupyingPiece) {
        if (this.tempSquares[7 - (pos.row + offSet)][pos.col + offSet].occupyingPiece?.colorOfPiece != this.selectedPieceColor) {
          this.tempSquares[7 - (pos.row + offSet)][pos.col + offSet].potentialMoveMark = true;
          break;
        }
        else {
          break;
        }
      }
      else {
        this.tempSquares[7 - (pos.row + offSet)][pos.col + offSet].potentialMoveMark = true;
      }
    }

    //bottom left
    //rows (-) col (-)
    for (let offSet: number = 1; pos.col - offSet >= 0 && pos.row - offSet >= 0; offSet++) {
      if (this.tempSquares[7 - (pos.row - offSet)][pos.col - offSet].occupyingPiece) {
        if (this.tempSquares[7 - (pos.row - offSet)][pos.col - offSet].occupyingPiece?.colorOfPiece != this.selectedPieceColor) {
          this.tempSquares[7 - (pos.row - offSet)][pos.col - offSet].potentialMoveMark = true;
          break;
        }
        else {
          break;
        }
      }
      else {
        this.tempSquares[7 - (pos.row - offSet)][pos.col - offSet].potentialMoveMark = true;
      }
    }

    //bottom right
    //row(-) col (+)
    for (let offSet: number = 1; pos.col + offSet <= 7 && pos.row - offSet >= 0; offSet++) {
      if (this.tempSquares[7 - (pos.row - offSet)][pos.col + offSet].occupyingPiece) {
        if (this.tempSquares[7 - (pos.row - offSet)][pos.col + offSet].occupyingPiece?.colorOfPiece != this.selectedPieceColor) {
          this.tempSquares[7 - (pos.row - offSet)][pos.col + offSet].potentialMoveMark = true;
          break;
        }
        else {
          break;
        }
      }
      else {
        this.tempSquares[7 - (pos.row - offSet)][pos.col + offSet].potentialMoveMark = true;
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
      if (this.tempSquares[toRow][toCol].occupyingPiece
        && this.tempSquares[toRow][toCol].occupyingPiece?.colorOfPiece == this.selectedPieceColor
        || ((toRow > upperLimit) || (toRow < lowerLimit) || (toCol < leftLimit) || (toCol > rightLimit))) {
      }
      else {
        this.tempSquares[toRow][toCol].potentialMoveMark = true;
      }
    }
  }
  rookMoves(square: SquareComponent): void {
    //up
    //rows (+)
    for (let offSet: number = 1; square.row + offSet <= 7; offSet++) {
      if (this.tempSquares[7 - (square.row + offSet)][square.col].occupyingPiece) {
        if (this.tempSquares[7 - (square.row + offSet)][square.col].occupyingPiece?.colorOfPiece != this.selectedPieceColor) {
          this.tempSquares[7 - (square.row + offSet)][square.col].potentialMoveMark = true;
          break;
        }
        else {
          break;
        }
      }
      else {
        this.tempSquares[7 - (square.row + offSet)][square.col].potentialMoveMark = true;
      }
    }
    //down
    //rows (-)
    for (let offSet: number = 1; square.row - offSet >= 0; offSet++) {
      if (this.tempSquares[7 - (square.row - offSet)][square.col].occupyingPiece) {
        if (this.tempSquares[7 - (square.row - offSet)][square.col].occupyingPiece?.colorOfPiece != this.selectedPieceColor) {
          this.tempSquares[7 - (square.row - offSet)][square.col].potentialMoveMark = true;
          break;
        }
        else {
          break;
        }
      }
      else {
        this.tempSquares[7 - (square.row - offSet)][square.col].potentialMoveMark = true;
      }
    }

    //left
    //col (-)
    for (let offSet: number = 1; square.col - offSet >= 0; offSet++) {
      if (this.tempSquares[7 - square.row][square.col - offSet].occupyingPiece) {
        if (this.tempSquares[7 - square.row][square.col - offSet].occupyingPiece?.colorOfPiece != this.selectedPieceColor) {
          this.tempSquares[7 - square.row][square.col - offSet].potentialMoveMark = true;
          break;
        }
        else {
          break;
        }
      }
      else {
        this.tempSquares[7 - square.row][square.col - offSet].potentialMoveMark = true;
      }
    }

    //right
    //col (+)
    for (let offSet: number = 1; square.col + offSet <= 7; offSet++) {
      if (this.tempSquares[7 - square.row][square.col + offSet].occupyingPiece) {
        if (this.tempSquares[7 - square.row][square.col + offSet].occupyingPiece?.colorOfPiece != this.selectedPieceColor) {
          this.tempSquares[7 - square.row][square.col + offSet].potentialMoveMark = true;
          break;
        }
        else {
          break;
        }
      }
      else {
        this.tempSquares[7 - square.row][square.col + offSet].potentialMoveMark = true;
      }
    }
  }

  enPassantCheck(toRow: Coord, toCol: Coord): void {
    if (this.enPassant && (this.selectedPiece.typeOfPiece == PieceType.Pawn)) {

      console.log("this.enPassant?.row==toRow && this.enPassant?.col == toCol");
      console.log(this.enPassant?.row == toRow && this.enPassant?.col == toCol);
      console.log("this.enpassant.row: " + this.enPassant.row);
      console.log("this.enpassant.col: " + this.enPassant.col);
      console.log("toRow: " + toRow);
      console.log("toCol: " + toCol);

      let row = (7 - toRow);
      if (this.enPassant?.row == row && this.enPassant?.col == toCol) {
        this.tempSquares[toRow][toCol].potentialMoveMark = true;
      }

      console.log("affected square:");
      console.log(this.tempSquares[toRow][toCol]);
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
    this.viewWhiteOnly = this.route.snapshot.paramMap.get('color') != 'black';
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

  makeMoveWS(toMake: MoveRequest): void {
    //this.webSocketAPI.makeMove(toMake);
    this.sendMove(toMake);
    console.log("wsFEN:");
    console.log(this.wsFEN);
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
  sendMove(toMake: any) {
    this.stompClient.send("/app/makeMove", {}, JSON.stringify(toMake));
  }
  sendUndo(undoRequest:any){
    this.stompClient.send("/app/undoMove", {}, JSON.stringify(undoRequest));
  }
  undoMove(): void {
    console.log("undoing move");
    console.log(this.FEN);
    let toUndo: any = {
      gameId: this.gameId,
      currentState: this.FEN
    }
    if(this.oneSideViewWithWS){
      console.log("inside ws undo");
      console.log(toUndo);
      this.sendUndo(toUndo);
    }
    else{
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

}
