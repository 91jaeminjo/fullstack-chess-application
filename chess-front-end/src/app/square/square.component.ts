import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Coord, PieceColor } from "../chess-model/game-definitions/GameData";
import { Piece } from "../chess-model/game-definitions/game-interface/Piece";


@Component({
  selector: 'app-square',
  templateUrl: './square.component.html',
  styleUrls: ['./square.component.scss']
})
export class SquareComponent implements OnInit {
  @Input()
  row!: Coord | number;
  @Input()
  col!: Coord | number;
  @Input() occupyingPiece: Piece | undefined;
  @Input() selected?: boolean;
  @Input() whiteSelected?:boolean;
  @Input() blackSelected?:boolean;
  @Input() potentialMoveMark?:boolean;
  @Input() isWhiteTurn?:boolean;
  @Input() viewMode?:boolean;
  
  image?:string;
  rowNum?:string = "";
  colLabel?:string = "";
  
  constructor() {
    
  }
  
  ngOnInit(): void {
    this.setSquareImage();
    this.setBoardLabel();
    
  }
  setBoardLabel() : void{
    if(this.col==0){
      if(this.viewMode){
        this.rowNum =(8-this.row)+"";
      } else{
        this.rowNum = (this.row+1)+"";
      }
      
    }
    if(this.row==7){
      switch(this.col){
        case(0): {
          this.colLabel = "a";
          break;
        }
        case(1): {
          this.colLabel = "b";
          break;
        }
        case(2): {
          this.colLabel = "c";
          break;
        }
        case(3): {
          this.colLabel = "d";
          break;
        }
        case(4): {
          this.colLabel = "e";
          break;
        }
        case(5): {
          this.colLabel = "f";
          break;
        }
        case(6): {
          this.colLabel = "g";
          break;
        }
        case(7): {
          this.colLabel = "h";
          break;
        }
      }
    }
  }
  toChessCoord():string{
    let toReturn:string ="";
    switch(this.col){
      case(0): {
        toReturn = "a";
        break;
      }
      case(1): {
        toReturn = "b";
        break;
      }
      case(2): {
        toReturn = "c";
        break;
      }
      case(3): {
        toReturn = "d";
        break;
      }
      case(4): {
        toReturn = "e";
        break;
      }
      case(5): {
        toReturn = "f";
        break;
      }
      case(6): {
        toReturn = "g";
        break;
      }
      case(7): {
        toReturn = "h";
        break;
      }
    }
    
    toReturn += (this.row + 1)+"";
    return toReturn;
  }
  setSquareImage() : void{
    if(this.occupyingPiece){
      let color: string = "";
      let pieceType: string = "";
      switch(this.occupyingPiece.colorOfPiece){
        case(0) : {
          color = "w";
          break;
        }
        case(1) : {
          color = "b";
          break;
        }
      }
      switch(this.occupyingPiece.typeOfPiece){
        case(0) : {
          pieceType = "P";
          break;
        }
        case(1) : {
          pieceType = "B";
          break;
        }
        case(2) : {
          pieceType = "N";
          break;
        }
        case(3) : {
          pieceType = "R";
          break;
        }
        case(4) : {
          pieceType = "Q";
          break;
        }
        case(5) : {
          pieceType = "K";
          break;
        }
      }
      this.image = "assets/chess-piece-img/"+color+pieceType+".png";
    }
  }

}
