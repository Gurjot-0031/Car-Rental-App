import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {map, switchMap, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LogInService {

  private username: string;
  private roles: string[] = [];

  constructor(private http: HttpClient) {
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

  logout(): Observable<any> {
    const response = this.http.post('/api/log-out', this.roles);
    this.username =null;
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
