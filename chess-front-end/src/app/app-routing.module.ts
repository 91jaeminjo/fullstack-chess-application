import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BoardComponent } from './board/board.component';
import { GameComponent } from './game/game.component';

const routes: Routes = [
  {path:'home', component: GameComponent},
  {path:'', redirectTo:'/home', pathMatch:'full'},
  {path:'board/:boardId', component: BoardComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
