import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { UserEnviroment } from 'src/app/environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { StudentResponse } from 'src/app/features/admin-management/model/studentResponse.model';
import { StudentRequest } from 'src/app/features/admin-management/model/studentRequest.model';
import { Class } from 'src/app/features/admin-management/model/class.model';

@Injectable({
  providedIn: 'root',
})
export class AdminService {
  private baseUrl = UserEnviroment.apiUrl;

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  // Student API
  getAllStudents(): Observable<StudentResponse[]> {
    return this.http
      .get<StudentResponse[]>(`${this.baseUrl}/students`, {
        headers: this.headers,
      })
      .pipe(
        map((response) => {
          return response;
        })
      );
  }

  addStudent(student: StudentRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/students/add`, student, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
    });
  }

  getStudentById(studentId: string): Observable<StudentResponse> {
    return this.http.get<StudentResponse>(
      `${this.baseUrl}/students/${studentId}`
    );
  }

  updateStudent(
    studentId: number,
    student: StudentRequest
  ): Observable<StudentResponse> {
    return this.http.put<StudentResponse>(
      `${this.baseUrl}/students/${studentId}`,
      student,
      {
        headers: new HttpHeaders({ 'Content-Type': 'application/json' }),
      }
    );
  }

  deleteStudent(userId: number): Observable<StudentResponse> {
    return this.http.delete<any>(`${this.baseUrl}/students/${userId}`).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Delete student failed:', error);
        return throwError(error); // Propagate the error to be caught in the component
      })
    );
  }

  // Class
  findAllClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(`${this.baseUrl}/classes`);
  }

  findClassById(id: number): Observable<Class> {
    return this.http.get<Class>(`${this.baseUrl}/classes/${id}`);
  }

  addClass(classRequest: Class): Observable<string> {
    return this.http.post<string>(`${this.baseUrl}/classes/add`, classRequest, { responseType: 'text' as 'json' });
  }

  updateClass(id: number, classRequest: Class): Observable<Class> {
    return this.http.put<Class>(`${this.baseUrl}/classes/${id}`, classRequest, { responseType: 'text' as 'json' });
  }

  deleteClass(id: number): Observable<string> {
    return this.http.delete<string>(`${this.baseUrl}/classes/${id}`, { responseType: 'text' as 'json' });
  }
}
