// src/app/services/sro.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { UserEnviroment } from 'src/app/environments/environment';
import {
  SroRequest,
  SroResponse,
} from 'src/app/features/admin-management/model/sro/sro.model';

@Injectable({
  providedIn: 'root',
})
export class SroService {
  private apiUrl = `${UserEnviroment.apiUrl}/sros`;

  constructor(private http: HttpClient) {}

  getAllSros(): Observable<SroResponse[]> {
    return this.http.get<SroResponse[]>(this.apiUrl);
  }

  getSroById(sroId: number): Observable<SroResponse> {
    return this.http.get<SroResponse>(`${this.apiUrl}/${sroId}`);
  }

  addSro(sroRequest: SroRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/add`, sroRequest).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          return throwError(
            () => new Error('Email already exists')
          );
        }
        return throwError(() => new Error('An unexpected error occurred!'));
      })
    );
  }

  updateSro(sroId: number, sroRequest: SroRequest): Observable<SroResponse> {
    return this.http.put<SroResponse>(`${this.apiUrl}/${sroId}`, sroRequest);
  }

  deleteSro(sroId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${sroId}`);
  }
}
