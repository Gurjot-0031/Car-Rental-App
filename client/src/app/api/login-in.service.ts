import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of, Subscription} from "rxjs";
import {switchMap} from "rxjs/operators";
import {SessionTimeOutService} from "../session-time-out.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogSessionTimeOutComponent} from "../dialog-session-time-out/dialog-session-time-out.component";
import {Router} from "@angular/router";

@Injectable({
  providedIn: 'root'
})
export class LogInService {

  private username: string;
  private roles: string[] = [];

  private _idleTimerSubscription: Subscription;

  constructor(
    private http: HttpClient,
    private router: Router,
    private sessionTimeoutService: SessionTimeOutService,
    public dialog: MatDialog,) {
  }

  /*
    1. Call sign in
    2. If the login is successful, store values, and emit true
    3. If the login fails, emit false
   */
  signIn(username: string, password: string): Observable<LogInResponse> {
    return this.http.post<LogInResponse>('/api/log-in',
      {username: username, password: password})
      .pipe(
        switchMap((response: LogInResponse) => {
            if (response.isSuccess) {
              this.username = response.username;
              this.roles.push(response.role);
              if (this.roles.includes('admin')) {
                this.startAdminSessionTimer();
              }
              return of(response)
            } else {
              // TODO FOR DEVELOPMENT ONLY!!!
              this.username = 'FORCED ADMIN';
              this.roles.push('admin');
              this.roles.push('clerk');
              return of(response);
            }
          }
        )
      )
  }

  startAdminSessionTimer() {
    this.sessionTimeoutService.startTimer();
    this._idleTimerSubscription = this.sessionTimeoutService.timeoutExpired.subscribe(res => {
      this.dialog.open(DialogSessionTimeOutComponent, {
        disableClose: true,
        autoFocus: false,
        width: '40vw',
        data: {res: res}
      }).afterClosed().subscribe(
        (isExtend) => {
          if (isExtend) {
            console.log("Extending session...");
            this.sessionTimeoutService.resetTimer();
          } else {
            console.log("Not extending session...");
            this.logout().subscribe();
            this.router.navigate(['/', 'login'])
          }
        },
        (reason) => {
          console.log("Dismissed " + reason);
        }
      );
    });
  }

  logout(): Observable<any> {
    const response = this.http.post('/api/log-out', this.roles);
    this.username = null;
    this.roles = [];
    return response;
  }

  getUsername() {
    if (this.username) {
      return this.username;
    }
  }

  getRoles() {
    if (this.roles) {
      return this.roles;
    }
  }
}

export class LogInResponse {
  username: string;
  role: string;
  isSuccess: boolean;
}
