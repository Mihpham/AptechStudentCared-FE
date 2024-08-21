import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  hidePassword: boolean = true;
  hidePasswordConfirm: boolean = true;

  constructor(
    private authService: AuthService,
    private fb: FormBuilder,
    private router: Router,
    private toastr: ToastrService
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      fullName: ['', [Validators.required]],
      phone: ['', [Validators.required]],
      address: ['', [Validators.required]],
      roleName: ['ADMIN']
    },);
  }


  get email() {
    return this.registerForm.get('email');
  }

  get password() {
    return this.registerForm.get('password');
  }

  get confirmPassword() {
    return this.registerForm.get('confirmPassword');
  }
  get fullName() {
    return this.registerForm.get('fullName');
  }

  get phone() {
    return this.registerForm.get('phone');
  }

  get address() {
    return this.registerForm.get('address');
  }

  get roleName() {
    return this.registerForm.get('roleName');
  }

  passwordMatchValidation(): boolean {
    const password = this.registerForm.get('password')?.value;
    const confirmPassword = this.registerForm.get('confirmPassword')?.value;
    return password === confirmPassword;
  }

  togglePasswordVisibility() {
    this.hidePassword = !this.hidePassword;
  }

  togglePasswordConfirmVisibility() {
    this.hidePasswordConfirm = !this.hidePasswordConfirm;
  }

  onSubmit() {
    if (this.registerForm.invalid) {
      this.toastr.error('Please fix the validation errors.');
      return;
    }

    if (!this.passwordMatchValidation()) {
      this.toastr.error('Passwords do not match.');
      return;
    }

    this.authService.register(this.registerForm.value).subscribe(
      response => {
        if (response) {
          this.toastr.success('Registration successful');
          this.router.navigate(['auth/login']);
        } else {
          this.toastr.error('Registration failed. Please try again.');
        }
      },
      error => {
        console.error('Registration failed:', error);
        this.toastr.error('Registration failed. Please try again later.');
      }
    );
  }

  
}
