import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACKEND_URL } from '../models/Config.model';

@Injectable({
  providedIn: 'root'
})
export class UsersService {

  constructor(
    private http: HttpClient,
  ) { }

  public getUsersList(): Observable<UsersResponseInterface> {
    return this.http.get<UsersResponseInterface>(`${BACKEND_URL}/users`);
  }

  public addUser(user: {
    username: string,
    password: string,
    admin: boolean,
  }): Observable<UsersResponseInterface> {
    return this.http.post<UsersResponseInterface>(`${BACKEND_URL}/users`, user);
  }
}

export interface UsersResponse {
  _id:      string;
  username: string;
  admin:    boolean;
  __v:      number;
}

export interface UsersResponseInterface {
  [key: string]: UsersResponse;
}
