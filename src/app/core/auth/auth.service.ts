import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { JwtHelperService } from '@auth0/angular-jwt';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private token: string | null = null;

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private toastr: ToastrService
  ) {}

  login(credentials: any) {
    return this.http.post('/api/auth/login', credentials).subscribe(
      (res: any) => {
        this.token = res.token;
        localStorage.setItem('token', this.token!);
        this.toastr.success('Logged in successfully');
        this.router.navigate(['/']);
      },
      err => {
        this.toastr.error('Login failed');
      }
    );
  }

  register(data: any) {
    return this.http.post('/api/auth/register', data).subscribe(
      res => {
        this.toastr.success('Registration successful');
        this.router.navigate(['/login']);
      },
      err => {
        this.toastr.error('Registration failed');
      }
    );
  }

  logout() {
    this.token = null;
    localStorage.removeItem('token');
    this.toastr.success('Logged out successfully');
    this.router.navigate(['/login']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    return token != null && !this.jwtHelper.isTokenExpired(token);
  }

  getRole(): string | null {
    const token = this.getToken();
    if (token) {
      const decodedToken = this.jwtHelper.decodeToken(token);
      return decodedToken.role;
    }
    return null;
  }
}
