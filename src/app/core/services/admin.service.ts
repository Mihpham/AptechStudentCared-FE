import { Injectable } from '@angular/core';
import { Observable, catchError, throwError } from 'rxjs';
import { UserEnviroment } from 'src/app/environments/environment';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { StudentResponse } from 'src/app/features/admin-management/model/student-response.model.';
import { StudentRequest } from 'src/app/features/admin-management/model/student-request.model';
import { CourseResponse } from 'src/app/features/admin-management/model/course/course-response.model';
import { CourseRequest } from 'src/app/features/admin-management/model/course/course-request.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private studentApiUrl = `${UserEnviroment.apiUrl}/students`;
  private courseApiUrl = `${UserEnviroment.apiUrl}/courses`;

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });


  getAllStudents(): Observable<StudentResponse[]> {
    return this.http.get<StudentResponse[]>(`${this.studentApiUrl}`);
  }

  addStudent(student: StudentRequest): Observable<any> {
    return this.http.post(`${this.studentApiUrl}/add`, student, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  getStudentById(studentId: number): Observable<StudentResponse> {
    return this.http.get<StudentResponse>(`${this.studentApiUrl}/${studentId}`);
  }

  updateStudent(studentId: number, student: StudentRequest): Observable<StudentResponse> {
    return this.http.put<StudentResponse>(`${this.studentApiUrl}/${studentId}`, student, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  deleteStudent(userId: number): Observable<StudentResponse> {
    return this.http.delete<any>(`${this.studentApiUrl}/${userId}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Delete student failed:', error);
          return throwError(error); // Propagate the error to be caught in the component
        })
      );
  }

  getAllCourse(): Observable<CourseResponse[]> {
    return this.http.get<CourseResponse[]>(`${this.courseApiUrl}`);
  }

  getCourseByCode(courseCode: string): Observable<CourseResponse> {
    return this.http.get<CourseResponse>(`${this.courseApiUrl}/${courseCode}`);
  }

  getCourseById(courseId: number): Observable<CourseResponse> {
    return this.http.get<CourseResponse>(`${this.courseApiUrl}/${courseId}`);
  }

  addCourse(course: CourseRequest): Observable<any> {
    return this.http.post(`${this.courseApiUrl}/add`, course, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  updateCourse(courseId: number, course: CourseRequest): Observable<CourseResponse> {
    return this.http.put<CourseResponse>(`${this.courseApiUrl}/${courseId}`, course, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    });
  }

  deleteCourse(courseId: number): Observable<CourseResponse> {
    return this.http.delete<any>(`${this.courseApiUrl}/${courseId}`)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          console.error('Delete course failed:', error);
          return throwError(error); // Propagate the error to be caught in the component
        })
      );
  }
}
