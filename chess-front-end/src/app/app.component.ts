import { Component } from '@angular/core';
import { AuthService } from './auth.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private authService:AuthService){

  }
  loggedIn:boolean = this.authService.isLoggedIn();
  title = 'My Chess Game';
  username:any="";
  ngOnInit():void{
    if(this.loggedIn){
      console.log("logged in");
      this.username = this.authService.getUserName();
      console.log(this.username);
    }
  }

  logout():void{
    this.authService.logout();
  }
}
