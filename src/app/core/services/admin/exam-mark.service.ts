import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExamMarkService {
  private apiUrl = 'http://localhost:1010/api/exam-score'; // Đặt URL API của bạn

  constructor(private http: HttpClient) { }


  
  importStudentExamScore(classId: number, file: File): Observable<any> {
    const formData: FormData = new FormData();
    formData.append('file', file);

    return this.http.put(`${this.apiUrl}/import/${classId}`, formData); 
  }
  // Phương thức cập nhật điểm thi
  updateStudentExamScore(classId: number, scoreData: any): Observable<any> {
    const url = `${this.apiUrl}/update-score/${classId}`;
    return this.http.put(url, scoreData, { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) });
  }
}
