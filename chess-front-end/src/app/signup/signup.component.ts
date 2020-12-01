import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

export interface SignupRequestPayload {
  username: string;
  email: string;
  password: string;
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})

export class SignupComponent implements OnInit {

  signupRequestPayload: SignupRequestPayload;
  signupForm!: FormGroup;

  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.signupRequestPayload = {
      username: "",
      email: "",
      password: "",
    };
  }

  ngOnInit() {
    this.signupForm = new FormGroup({
      username: new FormControl("", Validators.required),
      email: new FormControl("", [Validators.required, Validators.email]),
      password: new FormControl("", Validators.required),
    });
  }

  signup() {
    this.signupRequestPayload.email = this.signupForm.get("email")?.value;
    this.signupRequestPayload.username = this.signupForm.get("username")?.value;
    this.signupRequestPayload.password = this.signupForm.get("password")?.value;

    this.authService.signup(this.signupRequestPayload).subscribe(
      () => {
        this.router.navigate(["/signin"], {
          queryParams: { registered: "true" },
        });
      },
      () => {
        console.log("Registration Failed! Please try again");
      }
    );
  }

}
