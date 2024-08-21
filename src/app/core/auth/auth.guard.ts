import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable, of } from 'rxjs';
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
    // Check if the user is authenticated
    if (this.authService.isAuthenticated()) {
      const expectedRole = route.data['role'] as string;
      const userRole = this.authService.getRole();
  
      // Check if the user's role matches the expected role for the route
      if (userRole && userRole === expectedRole) {
        return true;
      } else {
        this.toastr.error('You do not have permission to access this page');
        // Redirect to access-denied page
        this.router.navigate(['/access-denied']);
        return false;
      }
    }

    // If not authenticated, redirect to login page with a message
    this.toastr.warning('Please log in to access this page');
    this.router.navigate(['/login']);
    return false;
  }
}
