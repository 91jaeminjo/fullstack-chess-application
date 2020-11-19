import { Component, OnInit } from '@angular/core';

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
import { Coord, Outcome } from "../chess-model/game-definitions/GameData";
import { Board } from "../chess-model/game-definitions/game-interface/Board";
import { Move } from "../chess-model/game-definitions/game-interface/Move";
import { Piece } from "../chess-model/game-definitions/game-interface/Piece";
import { Square } from "../chess-model/game-definitions/game-interface/Square";


@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss']
})
export class BoardComponent implements OnInit, Board {
  squares: Square[][];
  isWhiteTurn: boolean;
  wkCastle: boolean;
  wqCastle: boolean;
  bkCastle: boolean;
  bqCastle: boolean;
  enPassant: Square;
  fiftyMoveDrawCount: number;
  turn: number;
  isInCheck: boolean;
  condition: Outcome;
  state: string[];

  constructor() {
    let boardState: string = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1";
    let input: string[] = boardState.split(" ");
    this.state = input[0].split("/");

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


      this.enPassant = {
        row: rowNum,
        col: colNum
      }
    }
    else {
      this.enPassant = {
        row: 0,
        col: 0
      };
    }

    this.fiftyMoveDrawCount = +input[4];
    this.turn = +input[5];
    this.isInCheck = false;
    this.condition = Outcome.InProgress;
    
  }

  ngOnInit(): void {
    for (let i = 0; i < 8; i++) {
      let squareLine: Square[] = [];
      let charLine: string[] = this.state[i].split("");
      for (let j = 0; j < 8; j++) {
        console.log(charLine[j]);
        if (!isNaN(Number(charLine[j]))) {
          console.log(Number(charLine[j]));
          let count = Number(charLine[j]);
          while (count > 0) {
            let newSquare: Square = {
              row: i + 1 as Coord,
              col: j + 1 as Coord
            }
            squareLine.push(newSquare);
            j++;
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
          let newSquare: Square = {
            row: i + 1 as Coord,
            col: j + 1 as Coord,
            occupyingPiece: squarePiece
          }
          squareLine.push(newSquare);
        }

      }
      this.squares.push(squareLine);
    }
    console.log(this.squares);
  }
  makeMove(toMake: Move): Board {
    throw new Error("Method not implemented.");
  }
  isValidMove(toCheck: Move): boolean {
    throw new Error("Method not implemented.");
  }

}