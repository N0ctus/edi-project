import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityChartDataResponse } from '../models/Entity.model';
import { BACKEND_URL } from './../models/Config.model';
import { Connection, ConnectionChartDataResponse } from './../models/Connection.model';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private http: HttpClient) { }

  /** Chart data */
  public getTransactionsChartData() {
    return this.http.get(`${BACKEND_URL}/data/chart-data/transactions`);
  }

  public getConnectionsChartData(): Observable<ConnectionChartDataResponse[]> {
    return this.http.get<ConnectionChartDataResponse[]>(`${BACKEND_URL}/data/chart-data/connections`);
  }

  public getEntityChartData(): Observable<EntityChartDataResponse[]> {
    return this.http.get<EntityChartDataResponse[]>(`${BACKEND_URL}/data/chart-data/entities`);
  }

  public getPartnersChartData(): Observable<any> {
    return this.http.get<any>(`${BACKEND_URL}/data/chart-data/partners`);
  }

  /** Data-tables data */

  public getConnectionsRawData(): Observable<ConnectionsResponseInterface> {
    return this.http.get<ConnectionsResponseInterface>(`${BACKEND_URL}/data/connections`);
  }

  /** Top widgets data */
  public getTopTransactionsEntityNames(): Observable<TopTransactionsEntityNamesResponse[]> {
    return this.http.get<TopTransactionsEntityNamesResponse[]>(`${BACKEND_URL}/data/transactions/top-entities`);
  }

}

export interface ConnectionsResponseInterface {
  [key: string]: Connection;
}

export interface TopTransactionsEntityNamesResponse {
  totalPercent: number;
  _id: {
    entityName: string;
  };
}
