import { Component, OnInit } from '@angular/core';
import { UserProfileService } from 'src/app/core/services/profile.service';
import { UserProfile } from 'src/app/shared/models/user-profile.model';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  userProfile: UserProfile | undefined;

  constructor(private profileService: UserProfileService) {}

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.profileService.getUserProfile().subscribe(
      (data) => {
        this.userProfile = data;
      },
      (error) => {
        console.error("Error fetching user profile", error);
      }
    );
  }
}
