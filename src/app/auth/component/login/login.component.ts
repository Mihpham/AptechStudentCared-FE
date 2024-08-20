import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword: boolean = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required]]
    });
  }

  togglePasswordVisibility(): void {
    this.hidePassword = !this.hidePassword;
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;

      this.authService.login(email, password).subscribe({
        next: (response) => {
          if (response.result) {
            const token = response.token;
            localStorage.setItem('authToken', token);
            this.toastr.success('Đăng nhập thành công!', 'Thành công');
          } else {
            this.toastr.error('Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại.', 'Lỗi');
          }
        },
        error: (error) => {
          console.error('Đăng nhập thất bại:', error);
          this.toastr.error('Đăng nhập thất bại. Vui lòng kiểm tra thông tin và thử lại.', 'Lỗi');
        }
      });
    } else {
      this.toastr.warning('Vui lòng điền đầy đủ thông tin.', 'Cảnh báo');
    }
  }
}
