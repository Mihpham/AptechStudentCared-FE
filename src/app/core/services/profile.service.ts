import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserEnviroment } from 'src/app/environments/environment';
import { UserProfile } from 'src/app/shared/models/user-profile.model';
import { ChangePasswordRequest } from '../auth/models/chagePasswordRequest.model';

@Injectable({
  providedIn: 'root',
})
export class UserProfileService {
  private apiUrl = UserEnviroment.apiUrl;

  constructor(private http: HttpClient) {}

  
  getUserProfile(): Observable<UserProfile> {
    return this.http.get<UserProfile>(`${this.apiUrl}/users/profile`);
  }

  changePassword(request: ChangePasswordRequest): Observable<string> {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token')}`);
    return this.http.patch<string>(`${this.apiUrl}/admin/change-password`, request, { headers });
  }
}
