import { Component, OnInit } from '@angular/core';
import { GameServiceService } from '../game-service.service';
import { Output, EventEmitter } from '@angular/core';

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
  
  constructor(private gameService: GameServiceService) { }

  ngOnInit(): void {
    this.getAllGameList();
  }
  getAllGameList(): void {
    this.gameService.getAllGameList()
      .subscribe(list => {
        this.gameList = list
      });
  }
}
