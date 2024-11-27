import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { SubjectResponse } from '../../../features/admin-management/subject/model/subject-response.model';
import { UserEnviroment } from 'src/app/environments/environment';
import { SubjectRequest } from '../../../features/admin-management/subject/model/subject-request.model';
import { tap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class SubjectService {
    private subjectApiUrl = UserEnviroment.apiUrl;
    private subjectsSubject = new BehaviorSubject<SubjectResponse[]>([]);

    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json',
    });

    getAllSubjects(): Observable<SubjectResponse[]> {
        return this.http.get<SubjectResponse[]>(`${this.subjectApiUrl}/subjects`).pipe(
            tap(subjects => this.subjectsSubject.next(subjects))
        );;
    }

    getSubjectById(subjectId: number): Observable<SubjectRequest> {
        return this.http.get<SubjectRequest>(`${this.subjectApiUrl}/subjects/${subjectId}`);
    }


    addSubject(subject: SubjectResponse): Observable<SubjectResponse> {
        const headers = new HttpHeaders({
            'Content-Type': 'application/json', // Thay đổi hoặc thêm các tiêu đề nếu cần
        });
        return this.http.post<SubjectResponse>(`${this.subjectApiUrl}/subjects/add`, subject, { headers });
    }

    updateSubject(id: number, subject: SubjectRequest): Observable<SubjectResponse> {
        return this.http.put<SubjectResponse>(`${this.subjectApiUrl}/subjects/${id}`, subject);
    }

    deleteSubject(id: number): Observable<void> {
        return this.http.delete<void>(`${this.subjectApiUrl}/subjects/${id}`);
    }
}
