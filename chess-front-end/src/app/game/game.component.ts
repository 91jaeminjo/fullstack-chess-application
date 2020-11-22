import { Component, OnInit } from '@angular/core';
import { GameServiceService } from '../game-service.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  gameId!:number;
  boardId!:number;
  boardState!:string;
  started!: boolean;
  newGame!: boolean;

  constructor(
  

  ) { }

  ngOnInit(): void {
    
  }
  
  loadBoardData(event:any):void{
    this.gameId = event.gameId;
    this.boardId = event.boardId;
    this.boardState = event.state.trim();
    console.log("board: "+this.boardState);
    this.started = true;
  }
}
