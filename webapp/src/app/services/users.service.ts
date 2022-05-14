import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

const BACKEND_URL = `http://localhost:3000`;

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
  ) { }

  public getUsersList() {
    return this.http.get(`${BACKEND_URL}/users`);
  }
}
