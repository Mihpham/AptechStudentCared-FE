import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { UserEnviroment } from 'src/app/environments/environment';
import { StudentRequest } from 'src/app/features/admin-management/model/studentRequest.model';
import { StudentResponse } from 'src/app/features/admin-management/model/student-response.model.';
import { PaginatedStudentResponse } from 'src/app/features/admin-management/model/pagination-response';

@Injectable({
  providedIn: 'root',
})
export class StudentService {
  private baseUrl = `${UserEnviroment.apiUrl}/students`;

  constructor(private http: HttpClient) { }

  private headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  getAllStudents(pageIndex: number, pageSize: number): Observable<PaginatedStudentResponse> {
    return this.http.get<PaginatedStudentResponse>(`${this.baseUrl}?page=${pageIndex}&size=${pageSize}`);
  }
  
  
  

  getStudentsByStatus(status: string): Observable<StudentResponse[]> {
    return this.http.get<StudentResponse[]>(`${this.baseUrl}/status/${status}`);
  }

  importStudents(file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    const headers = new HttpHeaders();
    headers.append('Content-Type', 'multipart/form-data');

    return this.http.post(`${this.baseUrl}/import`, formData, { headers });
  }

  addStudent(student: StudentRequest): Observable<StudentResponse> {
    return this.http.post<StudentResponse>(`${this.baseUrl}/add`, student).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          return throwError(
            () =>
              new Error(
                'Full name must contain at least first name and last name.'
              )
          );
        }
        return throwError(() => new Error('An unexpected error occurred!'));
      })
    );
  }

  getStudentById(studentId: string): Observable<StudentResponse> {
    return this.http.get<StudentResponse>(`${this.baseUrl}/${studentId}`);
  }

  updateStudent(
    studentId: number,
    student: StudentRequest
  ): Observable<StudentResponse> {
    return this.http.put<StudentResponse>(
      `${this.baseUrl}/${studentId}`,
      student,
      { headers: this.headers }
    );
  }

  deleteStudent(userId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${userId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Delete student failed:', error);
        return throwError(error);
      })
    );
  }
}
