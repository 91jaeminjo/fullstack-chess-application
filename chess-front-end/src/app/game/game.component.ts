import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { GameServiceService } from '../game-service.service';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  gameId!: number;
  FEN!: string;
  begin!: boolean;
  newGame!: boolean;
  gameOver!: boolean;
  color?: string;
  constructor(private gameService: GameServiceService,
    private authService: AuthService,
    private router: Router) { }

  ngOnInit(): void {

  }

  setColor(color: string): void {
    this.color = color;
  }

  back(): void {
    this.begin = false;
  }
  beginNewGame(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigateByUrl('/signin');
      console.log("not logged in");
    }
    else {
      console.log("begin game");
      this.gameService.beginGame()
        .subscribe(game => {
          this.gameId = game.gameId;
          this.FEN = game.state;
          this.gameOver = game.gameOver;
          this.begin = true;
        })
    }

  }

  loadGameData(event: any): void {
    this.gameId = event.gameId;
    this.FEN = event.state.trim();
    this.gameOver = event.gameOver;
    console.log("board: " + this.FEN);

  }
}
