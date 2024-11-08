import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { UserEnviroment } from 'src/app/environments/environment';
import { ClassRequest } from 'src/app/features/admin-management/model/class/class-request.model';
import { ClassResponse } from 'src/app/features/admin-management/model/class/class-response.model';
import { AssignTeacherRequest } from 'src/app/features/admin-management/model/class/assign-teacher.model';
import { CourseResponse } from 'src/app/features/admin-management/model/course/course-response.model';
import {
  StudentPerformanceApiResponse,
} from 'src/app/features/admin-management/model/student-performance/student-performance-response.model';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private baseUrl = `${UserEnviroment.apiUrl}/classes`;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  findAllClasses(page: number, size: number): Observable<any> {
    const url = `${this.baseUrl}?page=${page}&size=${size}`;
    return this.http.get<any>(url);
  }
  
  

  findClassById(classId: number): Observable<ClassResponse> {
    return this.http.get<ClassResponse>(`${this.baseUrl}/${classId}`);
  }
  findAllSubjectByClassId(classId: number): Observable<CourseResponse> {
    const url = `${this.baseUrl}/class/${classId}`;
    return this.http.get<CourseResponse>(url);
  }

  addClass(classData: ClassRequest): Observable<any> {
    return this.http
      .post(`${this.baseUrl}/add`, classData, { responseType: 'text' })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 400) {
            return throwError(
              () => new Error('Class with this name already exists')
            );
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

  assignTeacher(
    classId: number,
    request: AssignTeacherRequest
  ): Observable<string> {
    return this.http
      .put(`${this.baseUrl}/${classId}/assign-teacher`, request, {
        responseType: 'text',
      })
      .pipe(
        catchError((error: HttpErrorResponse) => {
          return throwError(
            () => new Error('Error assigning teacher: ' + error.message)
          );
        })
      );
  }

  getAllSubjectsBySemester(
    classId: number,
    userId: number,
    semesterName?: string
  ): Observable<StudentPerformanceApiResponse[]> {
    let url = `${UserEnviroment.apiUrl}/student-performance/class/${classId}/user/${userId}/subjects`;
    if (semesterName) {
      url += `?semesterName=${semesterName}`;
    }

    return this.http.get<StudentPerformanceApiResponse[]>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Error details:', error); // Log more details
        if (error.status === 404) {
          this.toastr.error('No subjects found for semester');
        } else {
          this.toastr.error('An error occurred while fetching subjects. Please try again.');
        }
        return throwError(() => new Error('Error fetching subjects: ' + error.message));
      })
    );
    
  }
  getClassesByUser(userId: number): Observable<ClassResponse[]> {
    const url = `${this.baseUrl}/user/${userId}`;
    return this.http.get<ClassResponse[]>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(
          () => new Error('Error fetching classes for user: ' + error.message)
        );
      })
    );
  }
}
