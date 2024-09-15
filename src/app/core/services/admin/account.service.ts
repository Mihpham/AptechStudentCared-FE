import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { UserEnviroment } from 'src/app/environments/environment';
import { AccountRequest } from 'src/app/features/admin-management/accounts/model/accounts-request.model';
import { AccountResponse } from 'src/app/features/admin-management/accounts/model/accounts-response.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private accountApiUrl = UserEnviroment.apiUrl;
  private accountsSubject = new BehaviorSubject<AccountResponse[]>([]);

  constructor(private http: HttpClient) { }

  headers = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  getAllAccounts(): Observable<AccountResponse[]> {
    return this.http.get<AccountResponse[]>(`${this.accountApiUrl}/accounts`).pipe(
        tap(accounts => this.accountsSubject.next(accounts))
    );;
}

getAccountById(accountId: number): Observable<AccountRequest> {
    return this.http.get<AccountRequest>(`${this.accountApiUrl}/accounts/${accountId}`);
}


addAccount(account: AccountResponse): Observable<AccountResponse> {
    const headers = new HttpHeaders({
        'Content-Type': 'application/json', // Thay đổi hoặc thêm các tiêu đề nếu cần
    });
    return this.http.post<AccountResponse>(`${this.accountApiUrl}/accounts/add`, account, { headers });
}

updateAccount(id: number, account: AccountRequest): Observable<AccountResponse> {
    return this.http.put<AccountResponse>(`${this.accountApiUrl}/accounts/${id}`, account);
}

deleteAccount(id: number): Observable<void> {
    return this.http.delete<void>(`${this.accountApiUrl}/accounts/${id}`);
}
}
