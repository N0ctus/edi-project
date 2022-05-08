import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { UserAuthResponse } from 'src/auth/User.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient) {
    console.log(`Init auth service`)
  }

  public isAuthenticated() : Boolean {
    let userData = localStorage.getItem('userInfo')
    if(userData && JSON.parse(userData)){
      return true;
    }
    return false;
  }

  public setUserInfo(user: any){
    localStorage.setItem('userInfo', JSON.stringify(user));
  }

  public validate(email: string, password: string) {
    return this.http.post<UserAuthResponse>('http://localhost:3000/auth/login',{}, { params: {'username' : email, 'password' : password}});
  }
}
