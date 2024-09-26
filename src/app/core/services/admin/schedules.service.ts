import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, Subject } from 'rxjs';
import { UserEnviroment } from 'src/app/environments/environment';
import { Schedule } from 'src/app/features/admin-management/model/schedules/schedules.model';

@Injectable({
  providedIn: 'root'
})
export class ScheduleService {
    private baseUrl = `${UserEnviroment.apiUrl}/schedules`;

  constructor(private http: HttpClient) {}

  // Phương thức để lấy lịch theo classId
  getSchedulesByClassId(classId: number , subjectId: number): Observable<any[]> {
    return this.http.get<any[]>(`${this.baseUrl}/class/${classId}/subject/${subjectId}`);
  }
}
