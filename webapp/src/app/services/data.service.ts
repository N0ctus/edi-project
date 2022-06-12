import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BACKEND_URL } from './../models/Config.model';
import { Connection, ConnectionChartDataResponse } from './../models/Connection.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  public getTransactionsChartData() {
    return this.http.get(`${BACKEND_URL}/data/transactions/chart-data`);
  }

  public getConnectionsChartData(): Observable<ConnectionChartDataResponse[]> {
    return this.http.get<ConnectionChartDataResponse[]>(`${BACKEND_URL}/data/connections/chart-data`);
  }

  public getConnectionsRawData(): Observable<ConnectionsResponseInterface> {
    return this.http.get<ConnectionsResponseInterface>(`${BACKEND_URL}/data/connections`);
  }
}

export interface ConnectionsResponseInterface {
  [key: string]: Connection;
}
