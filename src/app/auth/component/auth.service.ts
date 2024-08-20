import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { Observable, catchError, map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:8080/auth/login';

  constructor(private http: HttpClient) { }

  login(email: string, password: string): Observable<{ result: boolean; token: string }> {
    const body = { email, password };

    return this.http.post<{ result: boolean; token: string }>(`${this.apiUrl}`, body).pipe(
      map(response => response),
      catchError(error => {
        console.error('Login failed:', error);
       
        throw error;
      })
    );
  }

}
