// sidebar.component.ts

import {Component, EventEmitter, Input, Output} from '@angular/core';
import {Router} from '@angular/router';
import {AuthService} from 'src/app/core/auth/auth.service';
import {ClassService} from 'src/app/core/services/admin/class.service';
import {UserProfileService} from 'src/app/core/services/profile.service';
import {ClassResponse} from 'src/app/features/admin-management/model/class/class-response.model';
import {UserProfile} from 'src/app/shared/models/user-profile.model';

interface SidebarItem {
  route?: string;
  label: string;
  icon: string;
  children?: SidebarItem[]; // Optional for dropdowns
  isOpen?: boolean; // Added to track dropdown state
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html', // Ensure correct path
  styleUrls: ['./sidebar.component.scss'], // If needed
})
export class SidebarComponent {
  
  role: string = '';
  sidebarItems: SidebarItem[] = [];
  userProfile: UserProfile | undefined;
  userId: number | null = null;  // giả sử userId lấy từ session hoặc từ route
  classes: ClassResponse[] = [];
  @Input() collapsed: boolean = false;
  @Output() toggle = new EventEmitter<void>();

  constructor(
    public authService: AuthService,
    private classService: ClassService,
    private router: Router,
    private profileService: UserProfileService
  ) {
    this.role = this.authService.getRole()!; // Assert not null
    this.setSidebarItems();
  }
  


  ngOnInit(): void {
    this.loadUserProfile();
    // this.getClassesByUser(this.userId);
  }

  


  loadUserProfile(): void {
    this.profileService.getUserProfile().subscribe(
      (data) => {
        this.userProfile = data;
        this.userId = this.userProfile.id;
        this.getClassesByUser(this.userId);
      },
      (error) => {
        console.error('Error fetching user profile', error);
      }
    );
  }

  getClassesByUser(userId: number) {
    this.classService.getClassesByUser(userId).subscribe({
      next: (data) => {
        this.classes = data;
        this.setSidebarItems(); // Ensure this is called here
      },
      error: (err) => {
        console.error('Error fetching classes for user', err);
      }
    });
  }

  // Set sidebarItems based on role
  private setSidebarItems() {
    const adminItems: SidebarItem[] = [
      {
        route: '/admin/dashboard',
        label: 'Dashboard',
        icon: 'fas fa-tachometer-alt',
      },
      {
        route: '/admin/class',
        label: 'Class',
        icon: 'fas fa-chalkboard-teacher',
      },
      {
        label: 'Student',
        route: '/admin/student/all',
        icon: 'fas fa-user-graduate',
        isOpen: false,
        children: [
          {
            route: '/admin/student/all',
            label: 'All Students',
            icon: 'fas fa-users',
          },
          {
            route: '/admin/student/studying',
            label: 'Studying',
            icon: 'fas fa-book-reader',
          },
          {
            route: '/admin/student/delay',
            label: 'Delay',
            icon: 'fas fa-clock',
          },
          {
            route: '/admin/student/dropout',
            label: 'Dropout',
            icon: 'fas fa-door-open',
          },
          {
            route: '/admin/student/graduated',
            label: 'Graduated',
            icon: 'fas fa-graduation-cap',
          },
        ],
      },
      {route: '/admin/teacher', label: 'Teacher', icon: 'fas fa-chalkboard'},
      {route: '/admin/sro', label: 'SRO', icon: 'fas fa-id-badge'},
      {route: '/admin/accounts', label: 'Accounts', icon: 'fas fa-book'},
      {
        route: '/admin/calendar',
        label: 'Calendar',
        icon: 'fas fa-calendar-alt',
      },
      {route: '/admin/course', label: 'Course', icon: 'fas fa-book-open'},
      {route: '/admin/subject', label: 'Subject', icon: 'fas fa-book-reader'},
    ];

    const sroItems: SidebarItem[] = [
      {
        route: '/sro/dashboard',
        label: 'Dashboard',
        icon: 'fas fa-tachometer-alt',
      },
      {
        route: '/sro/class',
        label: 'Class',
        icon: 'fas fa-chalkboard-teacher',
      },
      {
        label: 'Student',
        route: '/sro/student/all',
        icon: 'fas fa-user-graduate',
        isOpen: false,
        children: [
          {
            route: '/sro/student/all',
            label: 'All Students',
            icon: 'fas fa-users',
          },
          {
            route: '/sro/student/studying',
            label: 'Studying',
            icon: 'fas fa-book-reader',
          },
          {
            route: '/sro/student/delay',
            label: 'Delay',
            icon: 'fas fa-clock',
          },
          {
            route: '/sro/student/dropout',
            label: 'Dropout',
            icon: 'fas fa-door-open',
          },
          {
            route: '/sro/student/graduated',
            label: 'Graduated',
            icon: 'fas fa-graduation-cap',
          },
        ],
      },
      {route: '/sro/teacher', label: 'Teacher', icon: 'fas fa-chalkboard'},
      {
        route: '/sro/calendar',
        label: 'Calendar',
        icon: 'fas fa-calendar-alt',
      },

    ];

    const teacherItems: SidebarItem[] = [
      {
        route: '/teacher/dashboard',
        label: 'Dashboard',
        icon: 'fas fa-tachometer-alt',
      },
      {
        route: '/teacher/class',
        label: 'Class',
        icon: 'fas fa-chalkboard-teacher',
      },
      {
        route: '/teacher/student',
        label: 'Student',
        icon: 'fas fa-user-graduate',
      },
    ];

    const studentItems: SidebarItem[] = [
      {
        route: '/student/dashboard',
        label: 'Dashboard',
        icon: 'fas fa-tachometer-alt',
      },
      {
        label: 'Enrolled',
        icon: 'fa-solid fa-circle-check',
        isOpen: false,
        children: [
          ...this.classes.map(classItem => ({
            route: `/student/class-student-detail/${classItem.id}`,
            label: classItem.className,
            icon: 'fas fa-school',
          })),
        ],
      },

      {
        route: '/student/assignments',
        label: 'Assignments',
        icon: 'fas fa-tasks',
      },

    ];

    switch (this.role) {
      case 'ROLE_ADMIN':
        this.sidebarItems = adminItems;
        break;
      case 'ROLE_SRO':
        this.sidebarItems = sroItems;
        break;
      case 'ROLE_TEACHER':
        this.sidebarItems = teacherItems;
        break;
      case 'ROLE_STUDENT':
        this.sidebarItems = studentItems;
        break;
      // Add other roles if needed
      default:
        this.sidebarItems = []; // Show nothing if role is invalid
        break;
    }
  }

  toggleSidebar() {
    this.toggle.emit();
  }

  isChildActive(children: SidebarItem[] | undefined): boolean {
    if (!children) return false;
    return children.some(child => 
      child.route && this.router.isActive(child.route, { 
        paths: 'exact', 
        queryParams: 'ignored', 
        fragment: 'ignored', 
        matrixParams: 'ignored'  // Add this line
      })
    );
  }
  
  
  // Method to toggle dropdowns
  toggleDropdown(item: SidebarItem) {
    if (item.children) {
      item.isOpen = !item.isOpen;
    }
  }
}
