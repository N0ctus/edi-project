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

  public deleteUser(userId: string): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${BACKEND_URL}/users/${userId}`);
  }

  public addUser(user: {
    username: string,
    password: string,
    admin: boolean,
  }): Observable<{ message: string }> {
    return this.http.post<{ message: string }>(`${BACKEND_URL}/users/new`, user);
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
