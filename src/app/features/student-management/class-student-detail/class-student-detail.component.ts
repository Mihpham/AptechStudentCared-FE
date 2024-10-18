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
  
    classDetails: ClassResponse | null = null;
    students: StudentResponse[] = [];
  
    constructor(
      private route: ActivatedRoute,
      private classService: ClassService,
      private router: Router,
    ) {}
  
    ngOnInit(): void {
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
          this.students =
            data.students?.map((student: any) => ({
              userId: student.userId,
              image: student.image
                ? student.image
                : 'assets/images/avatar-default.webp',
                classId : student.classId,
              rollNumber: student.rollNumber,
              fullName: student.fullName,
              password: student.password,
              email: student.email,
              dob: student.dob,
              address: student.address,
              className: student.className,
              gender: student.gender,
              phoneNumber: student.phoneNumber,
              courses: student.courses,
              status: student.status,
              parentFullName: student.parentFullName,
              studentRelation: student.studentRelation,
              parentPhone: student.parentPhone,
              parentGender: student.parentGender,
            })) ?? [];
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
  
    
  
    
  }
  
