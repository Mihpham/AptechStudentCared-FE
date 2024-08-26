//Log các yêu cầu và phản hồi HTTP để theo dõi hoặc debug. Điều này có thể giúp  hiểu được luồng dữ liệu giữa ứng dụng và server.
// Log thông tin chi tiết của các yêu cầu và phản hồi.

import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, tap } from "rxjs";

@Injectable()
export class LoggingInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Request:', req);
    return next.handle(req).pipe(
      tap(event => {
        if (event instanceof HttpResponse) {
          console.log('Response:', event);
        }
      })
    );
  }
}
