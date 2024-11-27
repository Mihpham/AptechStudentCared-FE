import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserEnviroment } from 'src/app/environments/environment';
import { CreateScheduleRequest } from 'src/app/features/admin-management/model/schedules/create-schedule-request.model';
import { ScheduleRequest } from 'src/app/features/admin-management/model/schedules/schedule-request.model';
import { Schedule } from 'src/app/features/admin-management/model/schedules/schedules.model';

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
    request: CreateScheduleRequest
  ): Observable<any[]> {
    return this.http.post<any[]>(
      `${this.baseUrl}/create/class/${classId}/subject/${subjectId}`,
      request
    );
  }

  regenerateSchedules(classId: number, subjectId: number, request: ScheduleRequest): Observable<Schedule[]> {
    return this.http.put<Schedule[]>(`${this.baseUrl}/class/${classId}/subject/${subjectId}`, request);
  }

  updateScheduleById(id: number, schedule: Schedule): Observable<Schedule> {
    return this.http.put<Schedule>(`${this.baseUrl}/${id}`, schedule);
  }

  deleteScheduleById(id: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${id}`);
  }  

}
