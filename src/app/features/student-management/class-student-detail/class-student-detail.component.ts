import { Component, OnInit } from '@angular/core';
import { StudentResponse } from '../../admin-management/model/student-response.model.';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { StudentService } from 'src/app/core/services/admin/student.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ClassResponse } from '../../admin-management/model/class/class-response.model';

@Component({
  selector: 'app-class-student-detail',
  templateUrl: './class-student-detail.component.html',
  styleUrls: ['./class-student-detail.component.scss']
})
export class ClassStudentDetailComponent implements OnInit {
    classId: number | null = null;
    subjectId: number | null = null;
  
    classDetails: any | null = null;
    students: StudentResponse[] = [];
    currentWeekRange: string | null = null;

    constructor(
      private route: ActivatedRoute,
      private classService: ClassService,
      private router: Router,
    ) {}
  
    ngOnInit(): void {
      this.setCurrentWeekRange();
      this.route.paramMap.subscribe((params) => {
        const id = params.get('classId');
        this.classId = id ? +id : null;
        if (this.classId) {
          this.getClassDetails(this.classId);
        } else {
          console.error('Class ID is undefined or invalid.');
        }
      });
    }
  
    getAvatarUrl(avatarName: string | undefined): string {
      return `/assets/images/${avatarName}`;
    }
  
 
  
    getClassDetails(id: number): void {
      this.classService.findClassById(id).subscribe(
        (data) => {
          this.classDetails = data;
          
        },
        (error) => {
          console.error('Error fetching class details:', error);
        }
      );
    }
  
    loadStudent(): void {
      if (this.classId) {
        this.getClassDetails(this.classId);
      }
    }
  
  
    setCurrentWeekRange() {
      const currentDate = new Date();
      const startOfWeek = this.getStartOfWeek(currentDate);
      const endOfWeek = this.getEndOfWeek(currentDate);
      
      const options = { month: 'short', day: 'numeric' } as const;
      
      const startWeekFormatted = startOfWeek.toLocaleDateString('en-US', options);
      const endWeekFormatted = endOfWeek.toLocaleDateString('en-US', options);
      
      this.currentWeekRange = `Week of ${startWeekFormatted} - ${endWeekFormatted}, ${currentDate.getFullYear()}`;
    }
  
    getStartOfWeek(date: Date): Date {
      const day = date.getDay(); // 0 (Sunday) - 6 (Saturday)
      const diff = date.getDate() - day; // Adjust back to Sunday
      return new Date(date.setDate(diff));
    }
  
    getEndOfWeek(date: Date): Date {
      const startOfWeek = this.getStartOfWeek(date);
      return new Date(startOfWeek.setDate(startOfWeek.getDate() + 6)); // Add 6 days to get Saturday
    }
  
    
  }
  
