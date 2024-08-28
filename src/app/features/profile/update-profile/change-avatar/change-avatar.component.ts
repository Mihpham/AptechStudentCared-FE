import { Component } from '@angular/core';

@Component({
  selector: 'app-change-avatar',
  templateUrl: './change-avatar.component.html',
  styleUrls: ['./change-avatar.component.scss']
})
export class ChangeAvatarComponent {
  avatarUrl: string | ArrayBuffer | null = null;
  imageError: string | null = null;

  onImageChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];

      // Validate file size (1MB limit)
      if (file.size > 1048576) { // 1MB
        this.imageError = 'File size should not exceed 1MB.';
        this.avatarUrl = null;
        return;
      }

      // Convert image to Base64 string
      const reader = new FileReader();
      reader.onload = () => {
        this.avatarUrl = reader.result; // Set the image preview
        this.imageError = null;
      };
      reader.onerror = () => {
        this.imageError = 'Failed to read the file.';
        this.avatarUrl = null;
      };
      reader.readAsDataURL(file); // Converts to Base64 string
    }
  }
  
  onSubmit(): void {
    if (this.avatarUrl) {
      console.log('Uploading image...');
      // Here you would send the Base64 image string to your backend API
      // Example: this.userService.updateAvatar(this.avatarUrl).subscribe(...);
    } else {
      this.imageError = 'Please select an image to upload.';
    }
  }
}
