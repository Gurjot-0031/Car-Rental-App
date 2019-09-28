import { Component, OnInit } from '@angular/core';
import {LogInService} from "../api/login-in.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(
    private loginService: LogInService,
    private router: Router) { }

  ngOnInit() {
    if (!this.loginService.username) {
      this.router.navigate(['']);
    }
  }

  getUsername() {
    return this.loginService.username;
  }

  getRole() {
    return this.loginService.role;
  }
}
