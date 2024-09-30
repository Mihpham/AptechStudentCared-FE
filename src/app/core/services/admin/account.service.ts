import {
    HttpClient,
    HttpHeaders,
    HttpErrorResponse
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { UserEnviroment } from 'src/app/environments/environment';
import { AccountRequest } from 'src/app/features/admin-management/model/account/account-request.model';
import { AccountResponse } from 'src/app/features/admin-management/model/account/account-response.model';

@Injectable({
    providedIn: 'root'
})
export class AccountService {
    private accountApiUrl = UserEnviroment.apiUrl + '/users'; // Đường dẫn API
    private accountsSubject = new BehaviorSubject<AccountResponse[]>([]); // BehaviorSubject để theo dõi danh sách tài khoản

    constructor(private http: HttpClient) { }

    headers = new HttpHeaders({
        'Content-Type': 'application/json',
    });

    // Hàm lấy tất cả tài khoản
    getAllAccounts(): Observable<AccountResponse[]> {
        return this.http.get<AccountResponse[]>(`${this.accountApiUrl}`).pipe(
            tap(accounts => this.accountsSubject.next(accounts)), // Cập nhật danh sách tài khoản trong BehaviorSubject
            catchError(this.handleError) // Bắt lỗi
        );
    }
    // Hàm lấy tổng số tài khoản theo role
    getTotalAccountsByRole(role: string): Observable<{ totalAccount: number }> {
        return this.http.get<{ totalAccount: number }>(`${this.accountApiUrl}/role/total/${role}`);
    }


    // Hàm lấy tài khoản theo ID
    getAccountById(accountId: number): Observable<AccountRequest> {
        return this.http.get<AccountRequest>(`${this.accountApiUrl}/${accountId}`).pipe(
            catchError(this.handleError) // Bắt lỗi
        );
    }

    // Hàm lấy tài khoản theo roleName
    getAccountsByRole(roleName: string): Observable<AccountResponse[]> {
        return this.http.get<AccountResponse[]>(`${this.accountApiUrl}/role/${roleName}`);
    }

    // Hàm cập nhật trạng thái tài khoản
    updateAccountStatus(accountId: number): Observable<AccountResponse> {
        return this.http.put<AccountResponse>(`${this.accountApiUrl}/${accountId}/status`, {}).pipe(
            catchError(this.handleError) // Bắt lỗi
        );
    }


    // Xử lý lỗi
    private handleError(error: HttpErrorResponse) {
        let errorMessage = 'Unknown error!';
        if (error.error instanceof ErrorEvent) {
            // Lỗi từ phía client
            errorMessage = `Error: ${error.error.message}`;
        } else {
            // Lỗi từ phía server
            errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
        }
        return throwError(errorMessage);
    }
}
