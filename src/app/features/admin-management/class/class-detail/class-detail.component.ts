import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { StudentAddComponent } from '../../student/student-add/student-add.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/core/services/admin/student.service';
import { StudentRequest } from '../../model/studentRequest.model';
import { StudentUpdateDialogComponent } from '../../student/student-update-dialog/student-update-dialog.component';
import { StudentResponse } from '../../model/student-response.model.';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.component.html',
})
export class ClassDetailComponent implements OnInit {
  classId: number | null = null;
  subjectId: number | null = null;
  currentUserRole!: string | null;

  classDetails: any;
  students: StudentResponse[] = [];

  constructor(
    private route: ActivatedRoute,
    private classService: ClassService,
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.currentUserRole = this.authService.getRole();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
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

  getExamMarkLink() {
    return this.currentUserRole === 'ROLE_ADMIN'
      ? ['/admin/exam/exam-mark-all-subject', this.classDetails.id]
      : ['/sro/exam/exam-mark-all-subject', this.classDetails.id];
  }
  
  navigateToStudentPerformance(
    classId: number,
    userId: number,
    subjectId: number
  ) {
    this.router.navigate([`/student-performance`, classId, userId, subjectId]);
    
  }

  getClassDetails(id: number): void {
    this.classService.findClassById(id).subscribe(
      (data) => {
        this.classDetails = data;
        this.students =
          data.students?.map((student: any) => ({
            userId: student.userId,
            classId:student.classId,
            image: student.image
              ? student.image
              : 'assets/images/avatar-default.webp',
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

  onAdd(): void {
    const dialogRef = this.dialog.open(StudentAddComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.reload) {
        this.loadStudent(); // Reload data if student added
      }
    });
  }

  goToStudentDetail(studentId: number): void {
    this.router.navigate(['/student-detail', studentId]);
  }

  statusCounts() {
    const statusCount = {
      studying: 0,
      delay: 0,
      dropped: 0,
      graduated: 0,
    };

    if (this.classDetails?.students) {
      this.classDetails.students.forEach((student: { status: any }) => {
        switch (student.status) {
          case 'STUDYING':
            statusCount.studying++;
            break;
          case 'DELAY':
            statusCount.delay++;
            break;
          case 'DROPPED':
            statusCount.dropped++;
            break;
          case 'GRADUATED':
            statusCount.graduated++;
            break;
        }
      });
    }
    return statusCount;
  }

  onUpdate(student: StudentResponse, event: Event): void {
    event.stopPropagation(); // Prevent row click event

    const dialogRef = this.dialog.open(StudentUpdateDialogComponent, {
      width: '650px',
      data: student, // Pass the StudentResponse object to the dialog
    });

    dialogRef
      .afterClosed()
      .subscribe((updatedStudent: StudentResponse | undefined) => {
        if (updatedStudent) {
          const index = this.students.findIndex(
            (s) => s.userId === updatedStudent.userId
          );
          this.loadStudent();
        }
      });
  }

  deleteStudent(studentId?: number): void {
    if (studentId && confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(studentId).subscribe({
        next: () => {
          this.toastr.success('Student deleted successfully');
          this.classDetails.students = this.classDetails.students.filter(
            (student: any) => student.id !== studentId
          );
          this.loadStudent();
        },
        error: (err) => {
          this.toastr.error('Failed to delete student');
          console.error(err);
        },
      });
    } else {
    }
  }
}
