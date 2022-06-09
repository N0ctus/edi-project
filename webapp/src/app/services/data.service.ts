import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BACKEND_URL } from '../models/Config.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  public getTransactionsData() {
    return this.http.get(`${BACKEND_URL}/data/transactions`);
  }
}
