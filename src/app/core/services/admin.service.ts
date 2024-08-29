import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { UserEnviroment } from 'src/app/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { StudentResponse } from 'src/app/features/admin-management/model/studentResponse.model';
import { StudentRequest } from 'src/app/features/admin-management/model/studentRequest.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  
  private baseUrl = UserEnviroment.apiUrl;

  constructor( private http : HttpClient) { }
  
  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

 
  getAllStudents(): Observable<StudentResponse[]> {
    return this.http.get<StudentResponse[]>(`${this.baseUrl}/students`);
  }

  addStudent(student: StudentRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/students/add`, student, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  getStudentById(studentId: number): Observable<StudentResponse> {
    return this.http.get<StudentResponse>(`${this.baseUrl}/students/${studentId}`);
  }

  updateStudent(studentId: number, student: StudentRequest): Observable<StudentResponse> {
    return this.http.put<StudentResponse>(`${this.baseUrl}/students/${studentId}`, student, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  deleteStudent(userId: number): Observable<StudentResponse> {
    return this.http.delete<any>(`${this.baseUrl}/students/${userId}`)
        .pipe(
            catchError((error: HttpErrorResponse) => {
                console.error('Delete student failed:', error);
                return throwError(error); // Propagate the error to be caught in the component
            })
        );
}
}
