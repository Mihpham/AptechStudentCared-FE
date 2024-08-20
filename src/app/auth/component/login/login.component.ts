import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
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
    const role = response?.role;

    if (token && token.split('.').length === 3) {
      this.authService.setToken(token); 
      this.authService.setRole(role);
      this.toastr.success('Logged in successfully');

      let returnUrl = '/';
      switch (role) {
        case 'ADMIN':
          returnUrl = 'admin';
          break;
        case 'SRO':
          returnUrl = 'sro';
          break;
        case 'TEACHER':
          returnUrl = 'teacher';
          break;
        case 'STUDENT':
          returnUrl = 'student';
          break;
      }
      this.router.navigate([returnUrl]);
    } else {
      console.error('Invalid token format:', token);
      this.toastr.error('Invalid token received');
    }
  }

  passwordValidator(
    control: AbstractControl
  ): { [key: string]: boolean } | null {
    const passwordPattern =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
    if (!passwordPattern.test(control.value)) {
      return { invalidPassword: true };
    }
    return null;
  }
  emailValidator(control: AbstractControl): { [key: string]: boolean } | null {
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;
    if (!emailPattern.test(control.value)) {
      return { invalidEmail: true };
    }
    return null;
  }
}
