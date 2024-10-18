import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  hidePassword: boolean = true;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    // Redirect to the dashboard if already logged in
    if (this.authService.isAuthenticated()) {
      const role = this.authService.getRole();
      console.log("role",role);
      
      let returnUrl = '/';
      switch (role) {
        case 'ROLE_ADMIN':
          returnUrl = '/admin/dashboard';
          break;
        case 'ROLE_SRO':
          returnUrl = '/sro';
          break;
        case 'ROLE_TEACHER':
          returnUrl = '/teacher';
          break;
        case 'ROLE_STUDENT':
          returnUrl = '/student/dashboard';
          break;
      }
      this.router.navigate([returnUrl]);
    }
  }

  get email() {
    return this.loginForm.get('email');
  }

  get password() {
    return this.loginForm.get('password');
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit() {
    if (this.loginForm.invalid) {
      this.toastr.error('Please fix the validation errors.');
      return;
    }

    this.authService.login(this.loginForm.value).subscribe(
      response => {
        if (response) {
          this.handleLoginResponse(response);
        } else {
          this.toastr.error('Login failed. Please check your credentials.');
        }
      },
      error => {
        console.error('Login failed:', error);
        this.toastr.error('Login failed. Please try again later.');
      }
    );
  }

  private handleLoginResponse(response: any) {
    const token = response?.jwt;

    if (token && token.split('.').length === 3) {
        this.authService.setToken(token);

        // Decode the token to extract the role
        const decodedToken = this.authService.decodeToken(token);
        const role = decodedToken?.roles ? decodedToken.roles[0] : null; // Adjust based on your token structure

        this.authService.setRole(role);
        this.toastr.success('Logged in successfully');

        let returnUrl = '/';
        switch (role) {
            case 'ROLE_ADMIN':
                returnUrl = '/admin/dashboard';
                break;
            case 'ROLE_SRO':
                returnUrl = '/sro';
                break;
            case 'ROLE_TEACHER':
                returnUrl = '/teacher';
                break;
            case 'ROLE_STUDENT':
                returnUrl = '/student/dashboard';
                break;
            default:
                returnUrl = '/'; // Fallback for undefined roles
        }
        this.router.navigate([returnUrl]);
    } else {
        console.error('Invalid token format:', token);
        this.toastr.error('Invalid token received');
    }
}


  emailValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(control.value)) {
      return { invalidEmail: true };
    }
    return null;
  }
}
