import { Component, OnInit } from '@angular/core';
import {LogInService} from "../api/login-in.service";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  constructor(private loginService: LogInService) { }

  ngOnInit() {
    console.log('HOME');
  }

  getUsername() {
    return this.loginService.username;
  }

  getRole() {
    return this.loginService.role;
  }
}
