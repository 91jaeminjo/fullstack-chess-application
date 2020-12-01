import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable, Output } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'ngx-webstorage';
import { Observable, throwError } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { SigninRequestPayload, SigninResponse } from './signin/signin.component';
import { SignupRequestPayload } from './signup/signup.component';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  @Output() loggedIn: EventEmitter<boolean> = new EventEmitter();
  @Output() username: EventEmitter<string> = new EventEmitter();

  authUrl = "http://localhost:8080/api/auth"
  
  constructor(
    private httpClient: HttpClient,
    private localStorage: LocalStorageService,
    private router: Router
  ) {}

  signup(signupRequestPayload: SignupRequestPayload): Observable<any> {
    return this.httpClient.post(
      this.authUrl+"/signup",
      signupRequestPayload,
      { responseType: "text" }
    );
  }

  login(loginRequestPayload: SigninRequestPayload): Observable<boolean> {
    return this.httpClient
      .post<SigninResponse>(
        this.authUrl+"/signin",
        loginRequestPayload
      )
      .pipe(
        map((data) => {
          console.log(data);
          this.localStorage.store("username", data.username);
          this.localStorage.store("token", data.token);

          this.loggedIn.emit(true);
          this.username.emit(data.username);
          return true;
        })
      );
  }

  getJwtToken() {
    return this.localStorage.retrieve("token");
  }

  logout() {
    
    this.localStorage.clear("token");
    this.localStorage.clear("username");
    this.router.navigateByUrl("/home");
  }

  getUserName() {
    return this.localStorage.retrieve("username");
  }

  isLoggedIn(): boolean {
    return this.getJwtToken() != null;
  }
}
