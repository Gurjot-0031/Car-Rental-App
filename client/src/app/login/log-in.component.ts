import { Component, OnInit } from '@angular/core';
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {LogInService} from "../api/login-in.service";
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './log-in.component.html',
  styleUrls: ['./log-in.component.scss']
})
export class LogInComponent implements OnInit {

  username = new FormControl('', [Validators.required]);
  password = new FormControl('', [Validators.required]);
  loginForm = new FormGroup({
      username: this.username,
      password: this.password,
    }
  );

  constructor(
    private logInService: LogInService,
    private router: Router,
    private snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
  }

  onLoginClicked() {
    this.logInService
      .signIn(this.username.value, this.password.value)
      .subscribe(success => {
        if (success) {
          this.router.navigate(['/home']);
        } else {
          this.snackBar.open('Invalid username and/or password', '', {duration: 5000});
        }
      })
  }
}