import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { ClassResponse } from '../../model/class/class-response.model';
import { StudentAddComponent } from '../../student/student-add/student-add.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/core/services/admin/student.service';
import { StudentRequest } from '../../model/studentRequest.model';
import { StudentUpdateDialogComponent } from '../../student/student-update-dialog/student-update-dialog.component';
import { StudentResponse } from '../../model/student-response.model.';
import { StudentInClassResponse } from '../../model/class/student-in-class-response.model';

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.component.html',
})
export class ClassDetailComponent implements OnInit {
  classId: number | null = null;
  classDetails: any;
  students: StudentResponse[] = [];
  studentList: StudentInClassResponse[] = [];

  constructor(
    private route: ActivatedRoute,
    private classService: ClassService,
    private studentService: StudentService,
    private router: Router,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
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

  getClassDetails(id: number): void {
    this.classService.findClassById(id).subscribe(
      (data) => {
        this.classDetails = data;
        // Load the list of students from class details if available
        this.studentList = data.students ?? [];
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
      this.classDetails.students.forEach((student: { status: any; }) => {
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

  // Function to map StudentInClassResponse to StudentRequest
  mapToStudentRequest(student: StudentInClassResponse): StudentRequest {
    return {
      userId: student.id,
      rollNumber: student.rollNumber ?? '',
      fullName: student.fullName ?? '',
      email: student.email ?? '',
      phoneNumber: student.phoneNumber ?? '',
      status: student.status ?? '',
      password: '', // Provide password from another source if needed
      gender: '', // Provide gender from another source if needed
      className: '', // Provide className if needed
      dob: '', // Provide DOB if needed
      address: '', // Provide address if needed
      parentFullName: '', // Provide parentFullName if needed
      studentRelation: '', // Provide studentRelation if needed
      parentPhone: '', // Provide parentPhone if needed
      parentGender: '', // Provide parentGender if needed
      courses: [], // Provide courses if needed
    };
  }

  onUpdate(student: StudentInClassResponse, event: Event): void {
    event.stopPropagation(); // Prevent row click event

    const studentRequest = this.mapToStudentRequest(student);

    const dialogRef = this.dialog.open(StudentUpdateDialogComponent, {
      width: '650px',
      data: studentRequest,
    });

    dialogRef.afterClosed().subscribe((updatedStudent: StudentRequest | undefined) => {
      if (updatedStudent) {
        const index = this.students.findIndex(
          (s) => s.userId === updatedStudent.userId
        );
        if (index !== -1) {
          this.students[index] = updatedStudent;
        } else {
          this.loadStudent();
        }
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
      this.toastr.warning('Unable to delete student. Invalid ID.');
    }
  }
  
}
