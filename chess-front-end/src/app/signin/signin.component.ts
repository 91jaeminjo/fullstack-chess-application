import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';


export interface SigninRequestPayload {
  username: string;
  password: string;
}
export interface SigninResponse {
  token: string;
  
  username: string;
}

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})


export class SigninComponent implements OnInit {

  loginForm!: FormGroup;
  loginRequestPayload: SigninRequestPayload;
  registerSuccessMessage!: string;
  isError!: boolean;

  constructor(
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) {
    this.loginRequestPayload = {
      username: "",
      password: "",
    };
  }

  ngOnInit(): void {
    this.loginForm = new FormGroup({
      username: new FormControl("", Validators.required),
      password: new FormControl("", Validators.required),
    });

    this.activatedRoute.queryParams.subscribe((params) => {
      if (params.registered !== undefined && params.registered === "true") {
        
        this.registerSuccessMessage =
          "Please Check your inbox for activation email " +
          "activate your account before you Login!";
      }
    });
  }

  login() {
    this.loginRequestPayload.username = this.loginForm.get("username")?.value;
    this.loginRequestPayload.password = this.loginForm.get("password")?.value;

    this.authService.login(this.loginRequestPayload).subscribe((data) => {
      if (data) {
        this.isError = false;
        this.router.navigateByUrl("/home");
      } else {
        this.isError = true;
      }
    });
  }
}
