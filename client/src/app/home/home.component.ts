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
    if (!this.loginService.getUsername()) {
      this.loginService.signIn('dev','only').subscribe(() => this.isLoading = false);
    } else {
      this.isLoading = false;
    }
  }

  getUsername() {
    return this.loginService.getUsername() ? this.loginService.getUsername() : "No User";
  }

  getRole() {
    const roles = this.loginService.getRoles();
    if (!roles) {
      return "No Role";
    }
    if (roles.length > 1) {
      return "Dev Mode"
    }  else {
      return roles[0]
    }
  }

  logout() {
    this.loginService.logout().subscribe();
  }

  isAdmin() {
    return this.loginService.getRoles().includes('admin');
  }

  isClerk() {
    return this.loginService.getRoles().includes('clerk');
  }

}
