import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { StudentService } from 'src/app/core/services/admin/student.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';
import { StudentResponse } from '../../model/student-response.model.';

type StudentStatus =  "STUDYING" | "DELAY" | "DROPPED" | "GRADUATED";
@Component({
  selector: 'app-attendance-class',
  templateUrl: './attendance-class.component.html',
  styleUrls: ['./attendance-class.component.scss'],
})
export class AttendanceClassComponent implements OnInit {
  showTooltip = false;
  selectedStatus: string = '';
  classId: number | null = null;
  classDetails: any = {}; // Ensures classDetails is initialized to an empty object
  students: StudentResponse[] = [];

  statusOrder: Record<StudentStatus, number> = {
    STUDYING: 1,
    DELAY: 2,
    DROPPED: 3,
    GRADUATED: 4,
  };

  sessions = [
    { id: 'C2408L-1', name: 'Session 1', date: '2024-09-23' },
    { id: 'C2408L-2', name: 'Session 2', date: '2024-09-23' },
    { id: 'C2408L-3', name: 'Session 3', date: '2024-09-23' },
    { id: 'C2408L-4', name: 'Session 4', date: '2024-09-23' },
    { id: 'C2408L-5', name: 'Session 5', date: '2024-09-23' },
    { id: 'C2408L-6', name: 'Session 6', date: '2024-09-23' },

    { id: 'C2408L-7', name: 'Session 7', date: '2024-09-23' },
    { id: 'C2408L-8', name: 'Session 8', date: '2024-09-23' },
    { id: 'C2408L-9', name: 'Session 9', date: '2024-09-23' },
    { id: 'C2408L-10', name: 'Session 10', date: '2024-09-23' },
    { id: 'C2408L-11', name: 'Session 11', date: '2024-09-23' },
    { id: 'C2408L-12', name: 'Session 12', date: '2024-09-23' },
    { id: 'C2408L-13', name: 'Session 13', date: '2024-09-23' },
  ];

  attendanceStatuses: Record<string, Record<string, string>> = {};
  dropdownState: Record<string, Record<string, boolean>> = {};
  attendanceComments: Record<string, Record<string, string>> = {};
  tooltip: string = '';
  hoverInfo = '';

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
        const uniqueStudents = new Map<number, StudentResponse>();

        data?.students?.forEach((student: any) => {
          uniqueStudents.set(student.userId, {
            userId: student.userId,
            image: student.image || 'assets/images/avatar-default.webp',
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
            status: student.status as StudentStatus, // Ensure the type is StudentStatus
            parentFullName: student.parentFullName,
            studentRelation: student.studentRelation,
            parentPhone: student.parentPhone,
            parentGender: student.parentGender,
          });
        });

        this.students = Array.from(uniqueStudents.values());

        // Sort based on status order
        this.students.sort((a, b) => {
          return (
            this.statusOrder[a.status as StudentStatus] -
            this.statusOrder[b.status as StudentStatus]
          );
        });
      },
      (error) => {
        console.error('Error fetching class details:', error);
      }
    );
  }

  hideTooltip(): void {
    this.tooltip = '';
  }

  

  toggleDropdown(studentId: string, sessionId: string): void {
    this.dropdownState[studentId] = {
      ...this.dropdownState[studentId],
      [sessionId]: !this.dropdownState[studentId]?.[sessionId],
    };
  }

  isDropdownOpen(studentId: string, sessionId: string): boolean {
    return this.dropdownState[studentId]?.[sessionId] || false;
  }

  markAttendance(studentId: string, status: string, sessionId: string): void {
    if (this.attendanceStatuses[studentId]) {
      this.attendanceStatuses[studentId][sessionId] = status;
    } else {
      // Initialize the inner object if it doesn't exist
      this.attendanceStatuses[studentId] = {};
      this.attendanceStatuses[studentId][sessionId] = status;
    }
  }

  getAttendanceStatus(studentId: string, sessionId: string): string {
    return this.attendanceStatuses[studentId]?.[sessionId] || 'A';
  }

  openCommentDialog(studentId: string, sessionId: string): void {
    const existingComment =
      this.attendanceComments[studentId]?.[sessionId] || '';

    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '400px',
      data: { studentId, sessionId, comment: existingComment },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (!this.attendanceComments[studentId]) {
          this.attendanceComments[studentId] = {};
        }
        this.attendanceComments[studentId][sessionId] = result;
        this.toastr.success(
          `Comment saved for Student: ${studentId}, Session: ${sessionId}`
        );
      }
    });
  }
}
