import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { UserProfileService } from 'src/app/core/services/profile.service';
import { UserProfile } from 'src/app/shared/models/user-profile.model';

@Component({
  selector: 'app-change-avatar',
  templateUrl: './change-avatar.component.html',
  styleUrls: ['./change-avatar.component.scss']
})
export class ChangeAvatarComponent implements OnInit {
  avatarForm: FormGroup;
  selectedFile: File | null = null;
  userProfile: UserProfile | null = null;
  userId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private userProfileService: UserProfileService,
    private toastr: ToastrService
  ) {
    this.avatarForm = this.fb.group({
      image: [null, Validators.required] // Ensures the image is required
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  private loadUserProfile(): void {
    this.userProfileService.getUserProfile().subscribe({
      next: (data: UserProfile) => {
        this.userId = data.id;
      },
      error: (error) => {
        console.error('Error fetching user profile:', error);
        this.toastr.error('Failed to fetch user profile');
      }
    });
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      // Basic file validation (optional)
      if (!file.type.startsWith('image/')) {
        this.toastr.warning('Please select a valid image file');
        return;
      }

      // Set the selected file and update the form control
      this.selectedFile = file;
      this.avatarForm.patchValue({ image: this.selectedFile });
    }
  }

  onUpload(): void {
    if (this.avatarForm.invalid || !this.selectedFile) {
      this.toastr.warning('Please select an image first');
      return;
    }

    if (this.userId) {
      this.userProfileService.updateImage(this.userId, this.selectedFile).subscribe({
        next: (response: UserProfile) => {
          this.toastr.success('Image updated successfully');
          this.userProfile = response; // Update the user profile with the new image
        },
        error: (error) => {
          console.error('Error uploading image:', error);
          this.toastr.error('Failed to upload image');
        }
      });
    } else {
      this.toastr.error('User ID is missing');
    }
  }
}
