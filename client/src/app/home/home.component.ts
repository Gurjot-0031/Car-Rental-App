import { Component, OnInit } from '@angular/core';
import {LogInService} from "../api/login-in.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  isLoading: boolean;

  constructor(
    private loginService: LogInService,
    private router: Router) {
  }

  ngOnInit() {
    this.isLoading = true;
    if (!this.loginService.username) {
      this.loginService.signIn('dev','only').subscribe(() => this.isLoading = false);
    }
  }

  getUsername() {
    return this.loginService.username ? this.loginService.username : "No User";
  }

  getRole() {
    return this.loginService.role ? this.loginService.role : "No Role";
  }

  logout() {
    this.loginService.logout();
  }

  isAdmin() {
    return this.getRole() === 'admin';
  }

}
