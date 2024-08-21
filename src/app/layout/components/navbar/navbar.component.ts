import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DarkModeService } from 'src/app/core/services/dark-mode.service';
import { UserProfileService } from 'src/app/core/services/profile.service';
import { UserProfile } from 'src/app/shared/models/user-profile.model';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  isDropdownOpen = false;
  isMobileMenuOpen = false;
  showLogoutConfirm = false; 
  userProfile : UserProfile | undefined;
  darkModeService = inject(DarkModeService);

  constructor(
    private authService: AuthService,
    private router: Router,
    private userProfileService: UserProfileService,
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
    if (this.isLoggedIn) {
      this.loadUserProfile();
    }
  }

  loadUserProfile() {
    this.userProfileService.getUserProfile().subscribe(
      (data) => {
        this.userProfile = data;
      },
      (error) => {
        console.error('Error fetching user profile', error);
      }
    );
  }

  toggleDarkMode() {
    this.darkModeService.updateDarkMode();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const targetElement = event.target as HTMLElement;

    // Kiểm tra nếu click xảy ra bên ngoài dropdown hoặc trigger
    if (!targetElement.closest('.relative')) {
      this.isDropdownOpen = false;
      this.isMobileMenuOpen = false;
    }
  }

  logout() {
    this.showLogoutConfirm = true; // Show the confirmation modal instead of logging out immediately
  }

  cancelLogout() {
    this.showLogoutConfirm = false;
  }

  confirmLogout() {
    this.showLogoutConfirm = false;
    this.authService.logout();
    this.router.navigate(['/auth/login']);
  }
}
