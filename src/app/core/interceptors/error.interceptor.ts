//Thêm headers vào yêu cầu HTTP (ví dụ: token xác thực).
// Log hoặc xử lý lỗi.
// Biến đổi dữ liệu trước khi gửi hoặc sau khi nhận.
// Implement caching (bộ nhớ đệm).

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => {
        let errorMsg = error.status ? `Error Code: ${error.status}\nMessage: ${error.message}` : 'An unknown error occurred!';
        console.error(errorMsg);
        return throwError(() => new Error(errorMsg));
      })
    );
  }
}
