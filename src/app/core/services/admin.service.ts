import { Injectable } from '@angular/core';
import { Observable, catchError, map, throwError } from 'rxjs';
import { UserEnviroment } from 'src/app/environments/environment';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
} from '@angular/common/http';
import { StudentRequest } from 'src/app/features/admin-management/model/studentRequest.model';
import { Class } from 'src/app/features/admin-management/model/class.model';
import { CourseRequest } from 'src/app/features/admin-management/model/course/course-request.model';
import { StudentResponse } from 'src/app/features/admin-management/model/student-response.model.';

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
      responseType: 'json' 
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

  
  // Get all classes
  findAllClasses(): Observable<Class[]> {
    return this.http.get<Class[]>(`${this.baseUrl}/classes`);
  }

  // Get class by id
  findClassById(id: number): Observable<Class> {
    return this.http.get<Class>(`${this.baseUrl}/classes/${id}`);
  }

  // Add new class
  addClass(classData: Class): Observable<any> {
    return this.http.post(`${this.baseUrl}/classes/add`, classData, {
      responseType: 'text' 
    }).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) { // Mã lỗi khi tên lớp bị trùng
          return throwError(() => new Error('Class with this name already exists'));
        }
        return throwError(() => new Error('An unexpected error occurred!'));
      })
    );;
  }

  // Update class by id
  updateClass(id: number, classData: Class): Observable<Class> {
    return this.http.put<Class>(`${this.baseUrl}/classes/${id}`, classData);
  }

  deleteClass(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/classes/${id}`, { responseType: 'text' });
  }


  //Courses
   // Get all courses
   getAllCourse(): Observable<CourseRequest[]> {
    return this.http.get<CourseRequest[]>(`${this.baseUrl}/courses`)
      .pipe(catchError(this.handleError));
  }

  // Get course by code
  getCourseByCode(courseCode: string): Observable<CourseRequest> {
    return this.http.get<CourseRequest>(`${this.baseUrl}/courses/code/${courseCode}`)
      .pipe(catchError(this.handleError));
  }

  // Get course by ID
  getCourseById(courseId: number): Observable<CourseRequest> {
    return this.http.get<CourseRequest>(`${this.baseUrl}/courses/${courseId}`)
      .pipe(catchError(this.handleError));
  }

  // Add a new course
  addCourse(course: CourseRequest): Observable<any> {
    return this.http.post(`${this.baseUrl}/courses/add`, course, {
      responseType: 'text' // Adjust this based on what the backend returns (e.g., plain text or JSON)
    })
    .pipe(catchError(this.handleError));
  }

  // Update an existing course
  updateCourse(courseId: number, course: CourseRequest): Observable<CourseRequest> {
    return this.http.put<CourseRequest>(`${this.baseUrl}/courses/${courseId}`, course, {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' }) // Ensure the content type is JSON
    })
    .pipe(catchError(this.handleError));
  }

  // Delete a course
  deleteCourse(courseId: number): Observable<any> {
    return this.http.delete<any>(`${this.baseUrl}/courses/${courseId}`)
      .pipe(catchError(this.handleError));
  }

  // Handle HTTP errors
  private handleError(error: HttpErrorResponse) {
    let errorMessage = 'An unknown error occurred!';
    if (error.error instanceof ErrorEvent) {
      // Client-side or network error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Backend returned an unsuccessful response code
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(errorMessage);
  }
  
}
