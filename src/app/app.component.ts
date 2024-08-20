import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from './core/auth/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'school_management';

  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  isAdminPage(): boolean {
    return this.router.url.includes('/admin');
  }

  isLoginPage(): boolean {
    return this.router.url.includes('/login');
  }

  is404Page(): boolean {
    return this.router.url.includes('/error');
  }
}
