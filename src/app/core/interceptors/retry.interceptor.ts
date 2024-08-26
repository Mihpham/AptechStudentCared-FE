// Tự động thử lại yêu cầu HTTP nếu nó thất bại, đặc biệt hữu ích cho các yêu cầu mạng không ổn định.
// Thử lại yêu cầu 3 lần nếu gặp lỗi trước khi từ bỏ

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, catchError, retry, throwError } from "rxjs";

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      retry(3), // Thử lại 3 lần
      catchError(error => {
        return throwError(() => error);
      })
    );
  }
}
