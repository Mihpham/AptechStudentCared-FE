import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserEnviroment } from 'src/app/environments/environment';
import { ClassRequest } from 'src/app/features/admin-management/model/class/class-request.model';
import { ClassResponse } from 'src/app/features/admin-management/model/class/class-response.model';
import { AssignTeacherRequest } from 'src/app/features/admin-management/model/class/assign-teacher.model';

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
  assignTeacher(request: AssignTeacherRequest): Observable<string> {
    return this.http.post(`${this.baseUrl}/assign-teacher`, request, { responseType: 'text' }).pipe(
      catchError((error: HttpErrorResponse) => {
        return throwError(() => new Error('Error assigning teacher: ' + error.message));
      })
    );
  }
  
}
