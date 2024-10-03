import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserEnviroment } from 'src/app/environments/environment';
import { ClassRequest } from 'src/app/features/admin-management/model/class/class-request.model';
import { ClassResponse } from 'src/app/features/admin-management/model/class/class-response.model';
import { AssignTeacherRequest } from 'src/app/features/admin-management/model/class/assign-teacher.model';
import { CourseResponse } from 'src/app/features/admin-management/model/course/course-response.model';
import { StudentPerformanceResponse } from 'src/app/features/admin-management/model/student-performance/student-performance-response.model';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private baseUrl = `${UserEnviroment.apiUrl}/classes`;

  constructor(private http: HttpClient) {}

  findAllClasses(): Observable<ClassResponse[]> {
    return this.http.get<ClassResponse[]>(this.baseUrl);
  }

  findClassById(classId: number): Observable<ClassResponse> {
    return this.http.get<ClassResponse>(`${this.baseUrl}/${classId}`);
  }
  findAllSubjectByClassId(classId: number): Observable<CourseResponse> {
    const url = `${this.baseUrl}/class/${classId}`;
    return this.http.get<CourseResponse>(url);
  }

  addClass(classData: ClassRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, classData, { responseType: 'text' }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          return throwError(() => new Error('Class with this name already exists'));
        }
        return throwError(() => new Error('An unexpected error occurred!'));
      })
    );
  }

  updateClass(id: number, classData: ClassRequest): Observable<ClassRequest> {
    return this.http.put<ClassRequest>(`${this.baseUrl}/${id}`, classData);
  }

  deleteClass(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }

  assignTeacher(classId: number, request: AssignTeacherRequest): Observable<string> {
    return this.http.put(`${this.baseUrl}/${classId}/assign-teacher`, request, { responseType: 'text' }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Error assigning teacher: ' + error.message));
      })
    );
  }  

  getSubjects(classId: number, semester: string): Observable<any> {
    return this.http.get(`${this.baseUrl}/${classId}/subjects?semester=${semester}`);
  }

  getStudentPerformance(classId: number, userId: number, subjectId: string): Observable<StudentPerformanceResponse> {
    const url = `${this.baseUrl}/class/${classId}/user/${userId}/subject/${subjectId}`;
    return this.http.get<StudentPerformanceResponse>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Error fetching student performance: ' + error.message));
      })
    );
  }
  
}
