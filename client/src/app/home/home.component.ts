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
    //TODO reimplement this when we care about concurrency
    // if (!this.loginService.username) {
    //   this.router.navigate(['']);
    // }
  }

  getUsername() {
    return this.loginService.username ? this.loginService.username : "No User";
  }

  getRole() {
    return this.loginService.role ? this.loginService.role : "No Role";
  }
}
