import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './auth.guard';
import { BoardComponent } from './board/board.component';
import { GameListComponent } from './game-list/game-list.component';
import { GameComponent } from './game/game.component';
import { SigninComponent } from './signin/signin.component';
import { SignupComponent } from './signup/signup.component';

const routes: Routes = [
  {path:'home', component: GameComponent},
  {path:'', redirectTo:'/home', pathMatch:'full'},
  {path:'gamelist', component: GameListComponent, canActivate: [AuthGuard]},
  {path:'game/:id', component: BoardComponent, canActivate: [AuthGuard]},
  {path:'game/:color/:id', component: BoardComponent, canActivate: [AuthGuard]},
  {path:'signin', component:SigninComponent},
  {path:'signup', component:SignupComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
