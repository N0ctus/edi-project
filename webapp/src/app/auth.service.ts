import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserAuthResponse } from 'src/auth/User.model';

import * as moment from "moment";
import { tap } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  login(email: string, password: string) {
    return this.http.post<UserAuthResponse>('http://localhost:3000/auth/login', {}, { params: { 'username': email, 'password': password } })
      .pipe(tap(res => this.setSession(res)));
  }

  private setSession(authResult: UserAuthResponse) {
    const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }

  logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  isLoggedOut() {
    return !this.isLoggedIn();
  }

  getExpiration() {
    const expiration: any = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }
}
