import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http : HttpClient) {
    console.log(`Init auth service`)
    this.http.get('http://localhost:3000/esseh').subscribe(r => console.log(r));
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
    return this.http.post<{ user: any}>('http://localhost:3000/login',{}, { params: {'username' : email, 'password' : password}});
  }
}
