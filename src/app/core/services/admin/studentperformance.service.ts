import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { UserEnviroment } from 'src/app/environments/environment';
import { StudentPerformanceResponse } from 'src/app/features/admin-management/model/student-performance/student-performance-response.model';

@Injectable({
  providedIn: 'root',
})
export class StudentPerformanceService {
  private baseUrl = `${UserEnviroment.apiUrl}/student-performance`;

  constructor(private http: HttpClient) {}

  getStudentPerformance(classId: number, userId: number, subjectId: string): Observable<any> {
    const url = `${this.baseUrl}/class/${classId}/user/${userId}/subject/${subjectId}`;
    return this.http.get<StudentPerformanceResponse>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Error fetching student performance: ' + error.message));
      })
    );
  }
  
}
