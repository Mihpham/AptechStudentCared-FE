import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(
    private authService: AuthService,
    private router: Router,
    private toastr: ToastrService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    const isLoggedIn = this.authService.isAuthenticated();
    const userRole = this.authService.getRole();
    const expectedRole = route.data['role'] as string;

    // Nếu người dùng đã đăng nhập và cố gắng truy cập trang login, chuyển hướng đến dashboard
    if (isLoggedIn && state.url.includes('auth/login')) {
      this.router.navigate(['/admin/dashboard']);
      return false;
    }

    // Kiểm tra xem người dùng có đăng nhập hay không
    if (isLoggedIn) {
      // Kiểm tra vai trò của người dùng
      if (userRole && userRole === expectedRole) {
        return true;
      } else {
        this.toastr.error('You do not have permission to access this page');
        this.router.navigate(['/access-denied']);
        return false;
      }
    } else {
      // Nếu chưa đăng nhập, chuyển hướng đến trang đăng nhập
      this.toastr.warning('Please log in to access this page');
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}
