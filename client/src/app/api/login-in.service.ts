import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {Observable, of} from "rxjs";
import {map, switchMap, tap} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class LogInService {

  username: string;
  role: string;

  constructor(private http: HttpClient) {
  }

  /*
    1. Call sign in
    2. If the login is successful, store values, and emit true
    3. If the login fails, emit false
   */
  signIn(username: string, password: string): Observable<boolean> {
    return this.http.post<LogInResponse>('/api/log-in',
      {username: username, password: password})
      .pipe(
        switchMap((response: LogInResponse) => {
            if (response.isSuccess) {
              this.username = response.username;
              this.role = response.role;
              return of(true)
            } else {
              return of(false);
            }
          }
        )
      )
  }

  logout(){
    this.username =null;
    this.role = null; 
  }

  getUsername() {
    if (this.username) {
      return this.username;
    }
  }

  getRole() {
    if (this.role) {
      return this.role;
    }
  }
}

export class LogInResponse {
  username: string;
  role: string;
  isSuccess: boolean;
}
