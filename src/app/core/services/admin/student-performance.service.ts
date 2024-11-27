import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { UserEnviroment } from "src/app/environments/environment";
import { StudentPerformanceResponse } from "src/app/shared/models/student-performance.model";

@Injectable({
    providedIn: 'root',
  })
  export class StudentPerformanceService {
    private baseUrl = UserEnviroment.apiUrl + '/student-performance'; // Đường dẫn API

    constructor(private http: HttpClient) {}
  
    getStudentPerformance(
      userId: number,
      subjectId: number,
      classId: number
    ): Observable<StudentPerformanceResponse> {
      const url = `${this.baseUrl}/class/${classId}/user/${userId}/subject/${subjectId}`;
      return this.http.get<StudentPerformanceResponse>(url);
    }
}