// Thiết lập thời gian chờ (timeout) cho các yêu cầu HTTP, giúp ngăn chặn việc các yêu cầu bị treo quá lâu mà không có phản hồi.
// Hủy bỏ yêu cầu nếu nó vượt quá thời gian chờ được định nghĩa.

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError, TimeoutError } from 'rxjs';
import { timeout, catchError } from 'rxjs/operators';

@Injectable()
export class TimeoutInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      timeout(5000), // Timeout sau 5 giây
      catchError(error => {
        if (error instanceof TimeoutError) {
          return throwError(() => new Error('Request timed out!'));
        }
        return throwError(() => error);
      })
    );
  }
}
