import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { HttpClientModule } from '@angular/common/http';
import { UpdateProfileComponent } from './update-profile/update-profile.component';
import { ChangePasswordComponent } from './update-profile/change-password/change-password.component';
import { ChangeAvatarComponent } from './update-profile/change-avatar/change-avatar.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    ProfileComponent,
    UpdateProfileComponent,
    ChangePasswordComponent,
    ChangeAvatarComponent,
  ],
  imports: [CommonModule, HttpClientModule, ReactiveFormsModule],
  exports: [ProfileComponent],
})
export class ProfileModule {}
