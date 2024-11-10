import { Component, OnInit } from '@angular/core';
import { UserProfile } from 'src/app/shared/models/user-profile.model';
import { ClassResponse } from '../admin-management/model/class/class-response.model';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { Router } from '@angular/router';
import { UserProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-student',
  templateUrl: './student.component.html',
  styleUrls: ['./student.component.scss']
})
export class StudentComponent implements OnInit{
  userProfile: UserProfile | undefined;
  userId: number | null = null;  // giả sử userId lấy từ session hoặc từ route
  classes: ClassResponse[] = [];

  constructor(private classService: ClassService,
    private router: Router,
    private profileService: UserProfileService
  ) {}

  ngOnInit(): void {
    this.loadUserProfile(); 
    // this.getClassesByUser(this.userId); 
  } 


  getClassesByUser(userId: number) {
    this.classService.getClassesByUser(userId).subscribe({
      next: (data) => {
        this.classes = data;
        console.log(this.classes)
      },
      error: (err) => {
        console.error('Error fetching classes for user', err);
      }
    });
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
  convertToDate(timeString: string): Date {
    const [hours, minutes] = timeString.split(':');
    const now = new Date(); // Lấy thời gian hiện tại
    now.setHours(+hours); // Thiết lập giờ
    now.setMinutes(+minutes); // Thiết lập phút
    now.setSeconds(0); // Đặt giây về 0
    return now;
  }
  
}
