import { Component, OnInit } from '@angular/core';
import { GameServiceService } from '../game-service.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  
  boardState!:string;
  started!: boolean;

  constructor(
  

  ) { }

  ngOnInit(): void {
    
  }
  
  loadBoardData(event:any):void{
    
    this.boardState = event.state.trim();
    console.log("board: "+this.boardState);
    this.started = true;
  }
}
