import { Component, OnInit } from '@angular/core';
import { ClassService } from './../../../../core/services/admin/class.service';
import { ClassResponse } from '../../model/class/class-response.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AssignEditComponent } from '../assign-edit/assign-edit.component';
import { AssignTeacherRequest } from '../../model/class/assign-teacher.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assign-teacher',
  templateUrl: './assign-teacher.component.html',
  styleUrls: ['./assign-teacher.component.scss'],
})
export class AssignTeacherComponent implements OnInit {
  classDetails: ClassResponse | null = null;
  semesters = ['Sem1', 'Sem2', 'Sem3', 'Sem4'];
  subjectId: string | undefined;

  constructor(
    private classService: ClassService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      const classId = +params['id'];
      this.getClassDetails(classId);
    });
  }


  getClassDetails(classId: number): void {
    this.classService.findClassById(classId).subscribe(
      (data: ClassResponse) => {
        this.classDetails = data;
        console.log('Class Details:', this.classDetails); // In thông tin lớp ra console
      },
      (error) => {
        console.error('Error getting class information:', error);
      }
    );
  }

  getCourseDetails(
    semester: string
  ): { subject: string; teacher: string; status: string }[] {
    const subjects = this.classDetails?.course.semesters[semester] || [];
    return subjects.map((subject) => {
      const teacherInfo = this.classDetails?.subjectTeachers.find(
        (teacher) => teacher.subjectCode === subject
      );
      return {
        subject: subject,
        teacher: teacherInfo ? teacherInfo.teacherName : 'Not available',
        status: teacherInfo ? teacherInfo.status : 'Inactive',
      };
    });
  }

  goToAttendance(): void {
    const classId = this.classDetails?.id; // Get class ID
    // Ensure subjectTeachers array exists and is not empty
    const subjectId = this.classDetails?.subjectTeachers && this.classDetails.subjectTeachers.length > 0 
        ? this.classDetails.subjectTeachers[0].subjectId 
        : null; // Get subject code from the first teacher or null
  
    console.log('Class ID:', classId, 'Subject Id:', subjectId); // Debug info
  
    if (classId && subjectId) {
      this.router.navigate([`admin/attendance/${classId}/${subjectId}`]).then(() => {
        this.toastr.success('Navigated to attendance page successfully!');
      });
    } else {
      this.toastr.error('Class ID or Subject Code is missing.');
    }
  }
  
  

  openEditDialog(subject: string, teacherName: string, status: string): void {
    const dialogRef = this.dialog.open(AssignEditComponent, {
      data: { subject, teacherName, status },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.assignTeacherToSubject(
          result.subject,
          result.teacherName,
          result.status
        );
      }
    });
  }

  assignTeacherToSubject(
    subject: string,
    teacherName: string,
    status: string
  ): void {
    const request: AssignTeacherRequest = {
      subjectCode: subject,
      teacherName: teacherName,
      status: status, // Chuyển trạng thái vào request
    };

    this.classService
      .assignTeacher(this.classDetails?.id || 0, request)
      .subscribe({
        next: (response: string) => {
          if (this.classDetails?.id) {
            this.getClassDetails(this.classDetails.id);
          }
          this.toastr.success('Teacher assigned successfully!'); // Hiển thị thông báo thành công
        },
        error: (error: any) => {
          console.error('Error assigning teacher:', error);
          this.toastr.error('Error assigning teacher.'); // Hiển thị thông báo lỗi
        },
      });
  }

  goBack(): void {
    this.router.navigate(['admin/class']);
  }
}
