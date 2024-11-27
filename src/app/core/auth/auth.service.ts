import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { JwtHelperService } from "@auth0/angular-jwt";
import { ToastrService } from "ngx-toastr";
import { Observable, catchError, of } from "rxjs";
import { AuthEnvironment } from "src/app/environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
 
  
  private token: string | null = null;
  private role: string | null = null;
  private baseUrl = AuthEnvironment.apiUrl;

  constructor(
    private http: HttpClient,
    private router: Router,
    private jwtHelper: JwtHelperService,
    private toastr: ToastrService
  ) {}

  public decodeToken(token: string): any {
    return this.jwtHelper.decodeToken(token);
  }

  login(credentials: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/login`, credentials).pipe(
      catchError(err => {
        console.error('Login failed:', err);
        this.toastr.error('Login failed. Please check your credentials.');
        return of(null);
      })
    );
  }

  register(data: any): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/signup`, data).pipe(
      catchError(err => {
        console.error('Registration failed:', err);
        this.toastr.error('Registration failed. Please try again later.');
        return of(null);
      })
    );
  }

  changePassword(currentPassword: string, newPassword: string): Observable<any> {
    const payload = { currentPassword, newPassword };
    return this.http.post('/api/change-password', payload); // Replace with your API endpoint
  }

  resetPasswordOtp(otp: string, email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password-otp`, { otp, email });
  }

  resetPassword(newPassword: string, confirmPassword: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/reset-password`, { newPassword, confirmPassword });
  }

  forgotPassword(email: string): Observable<any> {
    return this.http.post(`${this.baseUrl}/forgot-password`, { email });
  }
  

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('token', token);
  }

  setRole(role: string) {
    this.role = role;
    localStorage.setItem('role', role);
  }

  hasRole(expectedRole: string): boolean {
    const role = this.getRole();
    return role === expectedRole;
  }
  

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    const role = this.getRole();
    return token != null && !this.jwtHelper.isTokenExpired(token) && role != null;
    
  }
  

  getRole(): string | null {
    return localStorage.getItem('role');
  }

  logout() {
    this.token = null;
    this.role = null;
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    this.toastr.success('Logged out successfully');
    this.router.navigate(['auth/login']);
  }

  refreshToken(): Observable<any> {
    return this.http.post<any>(`${this.baseUrl}/refresh-token`, {}).pipe(
      catchError(err => {
        console.error('Token refresh failed:', err);
        this.logout();
        return of(null);
      })
    );
  }
}
