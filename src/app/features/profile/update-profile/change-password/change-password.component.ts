import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  passwordMismatchError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private toastr: ToastrService
  ) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', [Validators.required, Validators.minLength(8)]],
      confirmPassword: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.changePasswordForm.valid) {
      const { currentPassword, newPassword, confirmPassword } = this.changePasswordForm.value;

      if (newPassword !== confirmPassword) {
        this.passwordMismatchError = 'New password and confirmation do not match.';
        return;
      }

      // Call the service to change the password
      this.authService.changePassword(currentPassword, newPassword).subscribe({
        next: () => {
          this.toastr.success('Password changed successfully');
          this.changePasswordForm.reset();
        },
        error: (err: any) => {
          console.error('Error changing password:', err);
          this.toastr.error('Failed to change password');
        },
      });
    } else {
      this.toastr.error('Please fill out the form correctly!');
    }
  }
}
