import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { UserEnviroment } from 'src/app/environments/environment';
import { UserProfile } from 'src/app/shared/models/user-profile.model';
import { ChangePasswordRequest } from '../auth/models/chagePasswordRequest.model';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private apiUrl = UserEnviroment.apiUrl;

  constructor(private http: HttpClient) { }

  getUserProfile(): Observable<UserProfile> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return this.http.get<UserProfile>(`${this.apiUrl}/users/profile`, {
      headers,
    });
  }

  getUserProfileById(userId: number): Observable<UserProfile> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return this.http.get<UserProfile>(`${this.apiUrl}/users/${userId}`, {
      headers,
    });
  }
  changePassword(request: ChangePasswordRequest): Observable<any> {
    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );
    return this.http
      .patch<any>(`${this.apiUrl}/users/change-password`, request, {
        headers,
        responseType: 'json', // Ensure the response is expected as JSON
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            return throwError(() => new Error('Current password is incorrect'));
          }
          return throwError(() => new Error('An unexpected error occurred!'));
        })
      );
  }

  updateImage(userId: number, image: File): Observable<any> {
    const formData = new FormData();
    formData.append('image', image);

    const headers = new HttpHeaders().set(
      'Authorization',
      `Bearer ${localStorage.getItem('token')}`
    );

    return this.http
      .patch(`${this.apiUrl}/users/${userId}/image`, formData, {
        headers,
        responseType: 'text', 
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(() => new Error('Failed to update image'));
        })
      );
  }
}
