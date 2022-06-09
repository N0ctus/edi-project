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

  public set theme(dark: boolean) {
    if (dark) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'white');
    }
  }

  public get theme(): boolean {
    const theme = localStorage.getItem('theme');
    return theme && theme === 'dark' ? true : false;
  }


  public login(email: string, password: string) {
    return this.http.post<UserAuthResponse>('http://localhost:3000/auth/login', {}, { params: { 'username': email, 'password': password } })
      .pipe(tap(res => this.setSession(res)));
  }

  public logout() {
    localStorage.removeItem("id_token");
    localStorage.removeItem("expires_at");
  }

  public isLoggedIn() {
    return moment().isBefore(this.getExpiration());
  }

  public isLoggedOut() {
    return !this.isLoggedIn();
  }

  public getExpiration() {
    const expiration: any = localStorage.getItem("expires_at");
    const expiresAt = JSON.parse(expiration);
    return moment(expiresAt);
  }

  public getToken(): string {
    return localStorage.getItem('id_token') as string;
  }

  private setSession(authResult: UserAuthResponse) {
    const expiresAt = moment().add(authResult.expiresIn, 'second');

    localStorage.setItem('id_token', authResult.token);
    localStorage.setItem("expires_at", JSON.stringify(expiresAt.valueOf()));
  }
}
