import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserEnviroment } from 'src/app/environments/environment';
import { Class } from 'src/app/features/admin-management/model/class.model';

@Injectable({
  providedIn: 'root',
})
export class ClassService {
  private baseUrl = `${UserEnviroment.apiUrl}/classes`;

  constructor(private http: HttpClient) {}

  findAllClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(this.baseUrl);
  }

  findClassById(id: number): Observable<Class> {
    return this.http.get<Class>(`${this.baseUrl}/${id}`);
  }

  addClass(classData: Class): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, classData, { responseType: 'text' }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          return throwError(() => new Error('Class with this name already exists'));
        }
        return throwError(() => new Error('An unexpected error occurred!'));
      })
    );
  }

  updateClass(id: number, classData: Class): Observable<Class> {
    return this.http.put<Class>(`${this.baseUrl}/${id}`, classData);
  }

  deleteClass(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`, { responseType: 'text' });
  }
}
