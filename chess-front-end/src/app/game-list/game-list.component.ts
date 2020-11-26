import { Component, OnInit } from '@angular/core';
import { GameServiceService } from '../game-service.service';
import { Location } from '@angular/common';


@Component({
  selector: 'app-game-list',
  templateUrl: './game-list.component.html',
  styleUrls: ['./game-list.component.scss']
})
export class GameListComponent implements OnInit {

  gameId!: number;
  browser!: string;
  color?: string;
  
  gameList!: number[];
  
  constructor(
    private gameService: GameServiceService,
    private location: Location) { }

  ngOnInit(): void {
    this.getAllGameList();
  }

  setColor(color:string):void{
    this.color = color;
  }

  goBack():void{
    this.location.back();
  }

  getAllGameList(): void {
    this.gameService.getAllGameList()
      .subscribe(list => {
        this.gameList = list
      });
  }
}
