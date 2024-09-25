import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserEnviroment } from 'src/app/environments/environment';
import { AttendanceResponse } from 'src/app/features/admin-management/model/attendance/attendance-response.model';
import { AttendanceRequest } from 'src/app/features/admin-management/model/attendance/attendance-request .model';

@Injectable({
  providedIn: 'root',
})
export class AttendanceService {
  private baseUrl = `${UserEnviroment.apiUrl}/attendances`;

  constructor(private http: HttpClient) {}

  updateOrCreateAttendance(
    userId: number,
    scheduleId: number,
    request: AttendanceRequest
  ): Observable<AttendanceResponse> {
    return this.http.put<AttendanceResponse>(
      `${this.baseUrl}/update/user/${userId}/schedule/${scheduleId}`,
      request
    );
  }

  getAllAttendances(): Observable<AttendanceResponse[]> {
    return this.http.get<AttendanceResponse[]>(`${this.baseUrl}`);
  }
}
