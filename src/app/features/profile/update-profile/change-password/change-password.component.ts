import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent {
  changePasswordForm: FormGroup;
  message: string | null = null;
  isSuccess: boolean = false;

  constructor(private fb: FormBuilder, private userProfileService: UserProfileService, private toastr : ToastrService) {
    this.changePasswordForm = this.fb.group({
      currentPassword: ['', Validators.required],
      newPassword: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordsMatch });
  }

  passwordsMatch(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { 'passwordMismatch': true };
  }

  onSubmit(): void {
    if (this.changePasswordForm.invalid) {
      return;
    }
  
    this.userProfileService.changePassword(this.changePasswordForm.value).subscribe({
      next: () => {
        this.toastr.success("Change password was successful!");
        this.isSuccess = true;
        this.changePasswordForm.reset();
      },
      error: (error: any) => {
        if (error.message.includes('Current password is incorrect')) {
          this.toastr.error('Current password is incorrect!', 'Error');
        } else {
          this.toastr.error('Failed to change password!', 'Error');
        }
        this.isSuccess = false;
      }
    });
  }
  
  
}
