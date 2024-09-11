import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { UserEnviroment } from 'src/app/environments/environment';
import { CourseRequest } from 'src/app/features/admin-management/model/course/course-request.model';
import { CourseResponse } from 'src/app/features/admin-management/model/course/course-response.model';

@Injectable({
  providedIn: 'root',
})
export class CourseService {
  private baseUrl = `${UserEnviroment.apiUrl}/courses`;

  constructor(private http: HttpClient) {}

  getAllCourse(): Observable<CourseResponse[]> {
    return this.http.get<CourseResponse[]>(this.baseUrl).pipe(catchError(this.handleError));
  }

  getCourseByCode(courseCode: string): Observable<CourseRequest> {
    return this.http.get<CourseRequest>(`${this.baseUrl}/code/${courseCode}`).pipe(catchError(this.handleError));
  }

  getCourseById(courseId: number): Observable<CourseResponse> {
    return this.http.get<CourseResponse>(`${this.baseUrl}/${courseId}`).pipe(catchError(this.handleError));
  }

  addCourse(course: CourseRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/add`, course, { responseType: 'text' }).pipe(catchError(this.handleError));
  }

  updateCourse(id: number, course: CourseResponse): Observable<CourseResponse> {
    return this.http.put<CourseResponse>(`${this.baseUrl}/${id}`, course).pipe(catchError(this.handleError));
  }

  deleteCourse(courseId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/${courseId}`).pipe(catchError(this.handleError));
  }

  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else {
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
}
