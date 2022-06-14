import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { EntityChartDataResponse } from '../models/Entity.model';
import { BACKEND_URL } from './../models/Config.model';
import { ConnectionChartDataResponse } from './../models/Connection.model';

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

  public getConnectionsRawData(): Observable<DataTableResponse> {
    return this.http.get<DataTableResponse>(`${BACKEND_URL}/data/connections`);
  }
  public getTransactionsRawData(): Observable<DataTableResponse> {
    return this.http.get<DataTableResponse>(`${BACKEND_URL}/data/transactions`);
  }
  public getEntitiesRawData(): Observable<DataTableResponse> {
    return this.http.get<DataTableResponse>(`${BACKEND_URL}/data/entities`);
  }
  public getPartnersRawData(): Observable<DataTableResponse> {
    return this.http.get<DataTableResponse>(`${BACKEND_URL}/data/partners`);
  }

  /** Top widgets data */
  public getTopTransactionsEntityNames(): Observable<TopTransactionsEntityNamesResponse[]> {
    return this.http.get<TopTransactionsEntityNamesResponse[]>(`${BACKEND_URL}/data/transactions/top-entities`);
  }
  public getTopCustomersPartners(): Observable<TopCustomersPartnersResponse[]> {
    return this.http.get<TopCustomersPartnersResponse[]>(`${BACKEND_URL}/data/partners/top-customers`);
  }
  public getTopOwnersPartners(): Observable<TopOwnersPartnersResponse[]> {
    return this.http.get<TopOwnersPartnersResponse[]>(`${BACKEND_URL}/data/partners/top-owners`);
  }

}

export interface DataTableResponse {
  [key: string]: string;
}

export interface TopTransactionsEntityNamesResponse {
  totalPercent: number;
  _id: {
    entityName: string;
  };
}

export interface TopCustomersPartnersResponse {
  totalPercent: number;
  _id: {
    clientName: string;
  };
}

export interface TopOwnersPartnersResponse {
  totalPercent: number;
  _id: {
    clientName: string;
  };
}
