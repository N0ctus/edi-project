import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const BACKEND_URL = `http://localhost:3000`;

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

  public getTransactionsData() {
    return this.http.get(`${BACKEND_URL}/data/transactions`);
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
