import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';

const BACKEND_URL = `http://localhost:3000`;

@Injectable({
  providedIn: 'root'
})
export class CsvUploadService {

  constructor(private http: HttpClient) { }

  uploadFile(name: string, csvFile: File): Observable<any> {
    const formData: any = new FormData();
    formData.append('name', name);
    formData.append('csv', csvFile);
    return this.http
      .post(`${BACKEND_URL}/csv/connections`, formData, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(catchError(this.errorMgmt));
  }
  errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(() => {
      return errorMessage;
    });
  }
}
