import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { GameListComponent } from './game-list/game-list.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  {path:'home', component: GameComponent},
  {path:'', redirectTo:'/home', pathMatch:'full'},
  {path:'gamelist', component: GameListComponent},
  {path:'game/:id', component: BoardComponent},
  {path:'game/:color/:id', component: BoardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
