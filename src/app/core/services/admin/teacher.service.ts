import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TeacherResponse } from 'src/app/features/admin-management/model/teacher/teacher-response.model'; // Import the Teacher model
import { TeacherRequest } from 'src/app/features/admin-management/model/teacher/teacher-request.model';// Import the TeacherRequest for adding/updating

@Injectable({
  providedIn: 'root'
})
export class TeacherService {
  private apiUrl = 'http://localhost:1010/api/teachers';

  // Inject HttpClient for making API requests
  constructor(private http: HttpClient) {}

  // Method to get all teachers
  getAllTeachers(): Observable<TeacherResponse[]> {
    return this.http.get<TeacherResponse[]>(this.apiUrl);
  }

  // Method to get a teacher by ID
  getTeacherById(id: number): Observable<TeacherResponse> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.get<TeacherResponse>(url);
  }

  // Method to add a new teacher
  addTeacher(teacher: TeacherRequest): Observable<TeacherResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.post<TeacherResponse>(`${this.apiUrl}/add`, teacher, { headers });
  }

  // Method to update a teacher
  updateTeacher(id: number, teacher: TeacherRequest): Observable<TeacherResponse> {
    const url = `${this.apiUrl}/${id}`;
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http.put<TeacherResponse>(url, teacher, { headers });
  }

  // Method to delete a teacher
  deleteTeacher(id: number): Observable<void> {
    const url = `${this.apiUrl}/${id}`;
    return this.http.delete<void>(url);
  }
  getTeachersByClassId(classId: number): Observable<TeacherResponse[]> {
    return this.http.get<TeacherResponse[]>(`${this.apiUrl}/class/${classId}`);
}

}
