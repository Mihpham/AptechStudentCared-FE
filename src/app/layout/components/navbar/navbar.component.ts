import { Component, HostListener, OnInit, inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DarkModeService } from 'src/app/core/services/dark-mode.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
  isLoggedIn: boolean = false;
  isDropdownOpen = false;
  isMobileMenuOpen = false;

  darkModeService = inject(DarkModeService);

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  toggleDarkMode() {
    this.darkModeService.updateDarkMode();
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  toggleMobileMenu () : void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }
  @HostListener('document:click', ['$event'])
  closeDropdown(event: Event) {
    const targetElement = event.target as HTMLElement;

    if (!targetElement.closest('.relative')) {
      this.isDropdownOpen = false;
      this.isMobileMenuOpen = false;
    }
    
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/auth/login']);
    window.location.reload();
  }
}
