import { Component, ElementRef, HostListener, OnInit, Renderer2 } from '@angular/core';
import { SubjectTeacherResponse } from '../../admin-management/model/class/subject-teacher-response.model';
import { StudentResponse } from '../../admin-management/model/student-response.model.';
import { Schedule } from '../../admin-management/model/schedules/schedules.model';
import { AttendanceResponse } from '../../admin-management/model/attendance/attendance-response.model';
import { ActivatedRoute } from '@angular/router';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { AttendanceService } from 'src/app/core/services/admin/attendance.service';
import { ScheduleService } from 'src/app/core/services/admin/schedules.service';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AttendanceRequest } from '../../admin-management/model/attendance/attendance-request .model';
import { CommentDialogComponent } from '../../admin-management/attendance/comment-dialog/comment-dialog.component';

@Component({
  selector: 'app-attendance-student',
  templateUrl: './attendance-student.component.html',
  styleUrls: ['./attendance-student.component.scss']
})
export class AttendanceStudentComponent implements OnInit {
  showTooltip = false;
  selectedStatus: string = '';
  classId: number | null = null;
  subjectId?: number;
  subjectTeachers: SubjectTeacherResponse[] = [];
  classDetails: any = {};
  students: StudentResponse[] = [];
  schedules: Schedule[] = [];
  attendances: AttendanceResponse[] = [];
  attendanceStatuses: Record<
    number,
    Record<number, { attendanceStatus1: string; attendanceStatus2: string }>
  > = {};
  attendanceComments: {
    [studentId: number]: { [scheduleId: number]: string };
  } = {};
  isDropdownOpen: boolean = false; // Default false
  openDropdownInfo: {
    studentId: number;
    scheduleId: number;
    attendanceStatus: string;
  } | null = null; // Track which dropdown is open
  tooltip: string = '';
  hoverInfo = '';

  constructor(
    private route: ActivatedRoute,
    private classService: ClassService,
    private attendanceService: AttendanceService,
    private scheduleService: ScheduleService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private el: ElementRef,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    // Example: Retrieve IDs from route parameters
    this.route.params.subscribe((params) => {
      this.classId = params['classId'];
      this.subjectId = 1;

      // Call loadSchedules only if IDs are defined
      if (this.classId && this.subjectId) {
        this.loadSchedules();
        this.getClassDetails(this.classId);
      } else {
        console.error('Class ID or Subject ID is undefined');
      }
      this.loadAllAttendances();
    });
  }

  getTeacherName(subjectCode: string): string | undefined {
    const teacher = this.classDetails?.subjectTeachers.find(
      (teacher: SubjectTeacherResponse) => teacher.subjectCode === subjectCode
    );
    return teacher ? teacher.teacherName : undefined;
  }

  loadAllAttendances(): void {
    this.attendanceService.getAllAttendances().subscribe(
      (data) => {
        this.attendances = data;

        this.attendances.forEach((attendance) => {
          if (!this.attendanceStatuses[attendance.studentId]) {
            this.attendanceStatuses[attendance.studentId] = {};
          }

          this.attendanceStatuses[attendance.studentId][attendance.scheduleId] =
            {
              attendanceStatus1: attendance.attendanceStatus1 || '',
              attendanceStatus2: attendance.attendanceStatus2 || '',
            };

          if (!this.attendanceComments[attendance.studentId]) {
            this.attendanceComments[attendance.studentId] = {};
          }
          this.attendanceComments[attendance.studentId][attendance.scheduleId] =
            attendance.note || '';
        });
      },
      (error) => {
        console.error('Error fetching attendance records:', error);
      }
    );
  }

  getClassDetails(classId: number): void {
    this.classService.findClassById(classId).subscribe(
      (data) => {
        this.classDetails = data;
        const uniqueStudents = new Map<number, StudentResponse>();
        console.log(data);
        data?.students?.forEach((student: any) => {
          uniqueStudents.set(student.userId, student);
        });

        this.students = Array.from(uniqueStudents.values());
      },
      (error) => {
        console.error('Error fetching class details:', error);
      }
    );
  }

  loadSchedules(): void {
    if (this.classId && this.subjectId) {
      this.scheduleService
        .getSchedulesByClassId(this.classId, this.subjectId)
        .subscribe(
          (data) => {
            this.schedules = data;
            console.log(this.schedules);
          },
          (error) => {
            console.error('Error fetching schedules:', error);
          }
        );
    } else {
      console.error('Class ID or Subject ID is undefined.');
    }
  }

  getAttendanceStatus1(studentId: number, scheduleId: number): string {
    return (
      this.attendanceStatuses[studentId]?.[scheduleId]?.attendanceStatus1 || ''
    );
  }

  getAttendanceStatus2(studentId: number, scheduleId: number): string {
    return (
      this.attendanceStatuses[studentId]?.[scheduleId]?.attendanceStatus2 || ''
    );
  }



  
}
