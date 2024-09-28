import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserEnviroment } from 'src/app/environments/environment';
import { ScheduleRequest } from 'src/app/features/admin-management/model/schedules/schedule-request.model';

@Injectable({
  providedIn: 'root',
})
export class ScheduleService {
  private baseUrl = `${UserEnviroment.apiUrl}/schedules`;

  constructor(private http: HttpClient) {}

  getSchedulesByClassId(classId: number, subjectId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.baseUrl}/class/${classId}/subject/${subjectId}`
    );
  }

  createSchedule(
    classId: number,
    subjectId: number,
    request: ScheduleRequest
  ): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.baseUrl}/create/class/${classId}/subject/${subjectId}`,
      request
    );
  }
}
