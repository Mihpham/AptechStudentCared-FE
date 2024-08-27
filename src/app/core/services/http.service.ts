import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpService {

  constructor(private http: HttpClient) { }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      console.error('Client-side error:', error.error.message);
    } else {
      // Server-side error
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${JSON.stringify(error.error)}`);
    }
    console.error(`Error occurred at URL: ${error.url}`);
    return throwError('Something bad happened; please try again later.');
  }

  get<T>(url: string, headers?: HttpHeaders , responseType: 'json' | 'text' = 'json'): Observable<T> {
    return this.http.get<T>(url, { headers: this.getDefaultHeaders(headers) }).pipe(
      catchError(this.handleError)
    );
  }

  post<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.post<T>(url, body, { headers: this.getDefaultHeaders(headers) }).pipe(
      catchError(this.handleError)
    );
  }

  postText(url: string, body: any, headers?: HttpHeaders): Observable<string> {
    return this.http.post(url, body, { headers, responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
  }
  
  put<T>(url: string, body: any, headers?: HttpHeaders): Observable<T> {
    return this.http.put<T>(url, body, { headers: this.getDefaultHeaders(headers) }).pipe(
      catchError(this.handleError)
    );
  }

  delete<T>(url: string, headers?: HttpHeaders): Observable<T> {
    return this.http.delete<T>(url, { headers: this.getDefaultHeaders(headers) }).pipe(
      catchError(this.handleError)
    );
  }

  // Helper method to add default headers if none are provided
  private getDefaultHeaders(headers?: HttpHeaders): HttpHeaders {
    const defaultHeaders = headers || new HttpHeaders();
    if (!defaultHeaders.has('Content-Type')) {
      return defaultHeaders.set('Content-Type', 'application/json');
    }
    return defaultHeaders;
  }
}
