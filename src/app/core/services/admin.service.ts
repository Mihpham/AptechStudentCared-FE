import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { UserEnviroment } from 'src/app/environments/environment';
import { StudentRequest } from 'src/app/features/admin-management/model/studentRequest.model';

@Injectable({
  providedIn: 'root'
})
export class AdminService {

  private baseUrl = UserEnviroment.apiUrl;

  constructor(private httpService: HttpService) { }

  getAllStudents(): Observable<StudentRequest[]> {
    return this.httpService.get<StudentRequest[]>(`${this.baseUrl}/students`);
  }

  getStudentById(id: number): Observable<StudentRequest> {
    return this.httpService.get<StudentRequest>(`${this.baseUrl}/students/${id}`);
  }

  addStudent(students: StudentRequest): Observable<any> {
    return this.httpService.post<StudentRequest>(`${this.baseUrl}/students/add`, students);
  }  

  updateStudent(student: StudentRequest): Observable<any>{
    return this.httpService.put<StudentRequest>(`${this.baseUrl}/students/update`, student);
  }

  deleteStudent(id: number): Observable<void> {
    return this.httpService.delete<void>(`${this.baseUrl}/students/${id}`);
  }
}
