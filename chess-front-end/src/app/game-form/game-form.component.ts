import { Component, OnInit } from '@angular/core';
import { GameServiceService } from '../game-service.service';
import { Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-game-form',
  templateUrl: './game-form.component.html',
  styleUrls: ['./game-form.component.scss']
})
export class GameFormComponent implements OnInit {

  public gameId!: number;
  public browser!: string;
  public color?: string;
  // gameForm = new FormGroup({
  //   gameId: new FormControl(),

  //   browser: new FormControl(),
  //   color: new FormControl()

  // })

  gameList!: number[];

  @Output() boardData = new EventEmitter<string>();
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

  retrieveGameById(): void {
    console.log("submit");
    console.log(this.gameId);
    this.gameService.getGameById(this.gameId)
    .subscribe(game=>{
      console.log(game);
      this.retrieveBoardById(game.boardId);
    });
  }

  retrieveBoardById(boardId: number): void{
    this.gameService.getBoardById(boardId)
    .subscribe(board=>{
      console.log(board);
      this.boardData.emit(board);
    })
  }
}
