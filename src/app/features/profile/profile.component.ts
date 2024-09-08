import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ImageRequest } from 'src/app/core/auth/models/ImageRequest.model';
import { UserProfileService } from 'src/app/core/services/profile.service';
import { UserProfile } from 'src/app/shared/models/user-profile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile | undefined;
  imageProfile: ImageRequest | undefined;
  showChangePassword = false;
  showChangeAvatar = false;
  constructor(
    private router: Router,
    private profileService: UserProfileService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.profileService.getUserProfile().subscribe(
      (data) => {
        this.userProfile = data;
      },
      (error) => {
        console.error('Error fetching user profile', error);
      }
    );
  }

  isActive(route: string): boolean {
    return (route === '/profile' && !this.showChangePassword && !this.showChangeAvatar) ||
           (route === '/update/change-password' && this.showChangePassword) ||
           (route === '/update/change-avatar' && this.showChangeAvatar);
  }

  navigateTo(section: string) {
    if (section === '/update/change-password') {
      this.showChangePassword = true;
      this.showChangeAvatar = false;
    } else if (section === '/update/change-avatar') {
      this.showChangePassword = false;
      this.showChangeAvatar = true;
    } else {
      // Reset or handle other cases
      this.showChangePassword = false;
      this.showChangeAvatar = false;
    }
  }
}
