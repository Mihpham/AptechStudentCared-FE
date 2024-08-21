import { Component, EventEmitter, Output, Input } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent {
  isLoggedIn: boolean = false;
  @Input() collapsed: boolean = false;
  @Output() toggle = new EventEmitter<void>();
  openDropdown: string | null = null;

  constructor(private authService: AuthService) { }

  ngOnInit() {
    this.isLoggedIn = this.authService.isAuthenticated();
  }


  toggleSidebar() {
    this.toggle.emit();
  }

  isOpen(dropdown: string): boolean {
    return this.openDropdown === dropdown;
  }
}
