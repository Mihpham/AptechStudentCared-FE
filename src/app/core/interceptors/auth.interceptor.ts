//Thêm token xác thực (JWT hoặc token khác) vào headers của mọi yêu cầu HTTP, đảm bảo rằng người dùng đã được xác thực khi truy cập các API bảo vệ.

import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    const authToken = this.authService.getToken();
    // Nếu có token, thêm vào header của yêu cầu
    if (authToken) {
        const authReq = req.clone({
          headers: req.headers.set('Authorization', `Bearer ${authToken}`)
        });
        return next.handle(authReq);
      } else {
        return next.handle(req);
      }
    }
}
