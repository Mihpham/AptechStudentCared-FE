import {
  Component,
  ElementRef,
  HostListener,
  OnInit,
  Renderer2,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AttendanceService } from 'src/app/core/services/admin/attendance.service';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { ScheduleService } from 'src/app/core/services/admin/schedules.service';
import { AttendanceRequest } from '../../model/attendance/attendance-request .model';
import { AttendanceResponse } from '../../model/attendance/attendance-response.model';
import { SubjectTeacherResponse } from '../../model/class/subject-teacher-response.model';
import { Schedule } from '../../model/schedules/schedules.model';
import { StudentResponse } from '../../model/student-response.model.';
import { CommentDialogComponent } from '../comment-dialog/comment-dialog.component';

@Component({
  selector: 'app-attendance-class',
  templateUrl: './attendance-class.component.html',
  styleUrls: ['./attendance-class.component.scss'],
})
export class AttendanceClassComponent implements OnInit {
  showTooltip = false;
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
  dropdownTimeout: any;
  selectedStatus: { [key: number]: string } = {};
  
  dropdownOpenIndex: number | null = null;
  dropdownOpenIndex1: number | null = null;
  dropdownOpenIndex2: number | null = null;
  openTimeout: any;
  closeTimeout: any;

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
      this.subjectId = params['subjectId'];

      // Call loadSchedules only if IDs are defined
      if (this.classId && this.subjectId) {
        this.loadSchedules();
        this.getClassDetails(this.classId);
      } else {
        console.error('Class ID or Subject ID is undefined');
      }
      this.loadAllAttendances();
      this.renderer.listen('document', 'click', this.onClickOutside.bind(this));
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
        // Ensure subjectId is defined
        this.scheduleService
            .getSchedulesByClassId(this.classId, this.subjectId)
            .subscribe(
                (data) => {
                    // Gán giá trị cho isHoliday
                    this.schedules = data.map(schedule => ({
                        ...schedule,
                        isHoliday: false // Khởi tạo isHoliday là false
                    }));
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


  // Check if the dropdown is open for a specific studentId, scheduleId, and attendance status
  isDropdownOpenCheck(
    studentId: number,
    scheduleId: number,
    attendanceStatus: string
  ): boolean {
    return (
      this.isDropdownOpen &&
      this.openDropdownInfo?.studentId === studentId &&
      this.openDropdownInfo?.scheduleId === scheduleId &&
      this.openDropdownInfo?.attendanceStatus === attendanceStatus
    );
  }

  trackByStudentId(index: number, student: StudentResponse): number {
    return student.userId;
  }

  toggleHoliday(index: number): void {
    if (this.schedules[index]) {
        this.schedules[index].isHoliday = !this.schedules[index].isHoliday;
    }
}



  toggleDropdown(
    isOpen: boolean,
    studentId: number,
    scheduleId: number,
    attendanceStatus: string
  ): void {
    if (isOpen) {
      clearTimeout(this.dropdownTimeout); // Dừng đếm thời gian nếu dropdown cần được mở
      this.isDropdownOpen = true;
      this.openDropdownInfo = { studentId, scheduleId, attendanceStatus };
    } else {
      // Đặt thời gian chờ để đóng dropdown khi rời khỏi cả nút và dropdown
      this.dropdownTimeout = setTimeout(() => {
        this.isDropdownOpen = false;
        this.openDropdownInfo = null;
      }, 200); // Thời gian chờ 200ms có thể điều chỉnh
    }
  }

  openDropdown(index: number, shift: 'shift1' | 'shift2') {
    clearTimeout(this.closeTimeout);
    this.openTimeout = setTimeout(() => {
      if (shift === 'shift1') {
        this.dropdownOpenIndex1 = index;
      } else if (shift === 'shift2') {
        this.dropdownOpenIndex2 = index;
      }
    }, 200);
  }

  closeDropdown(shift: 'shift1' | 'shift2') {
    clearTimeout(this.openTimeout);
    this.closeTimeout = setTimeout(() => {
      if (shift === 'shift1') {
        this.dropdownOpenIndex1 = null;
      } else if (shift === 'shift2') {
        this.dropdownOpenIndex2 = null;
      }
    }, 200);
  }

  toggleDropdownStar(index: number): void {
    this.dropdownOpenIndex = this.dropdownOpenIndex === index ? null : index;
  }
  applyStatusToAll(
    status: string,
    sessionIndex: number,
    shift: 'shift1' | 'shift2'
  ): void {
    this.selectedStatus[sessionIndex] = status;
    this.students.forEach((student) => {
      this.selectStatus(
        student.userId,
        this.schedules[sessionIndex].scheduleId,
        status,
        shift === 'shift1' // Pass true if shift1, false if shift2
      );
    });

    // Close the specific dropdown after selection
    if (shift === 'shift1') {
      this.dropdownOpenIndex1 = null;
    } else if (shift === 'shift2') {
      this.dropdownOpenIndex2 = null;
    }
  }

  // Listen for clicks outside the component and close the dropdown if necessary
  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
    const clickedInside = this.el.nativeElement.contains(event.target);
    if (!clickedInside) {
      // Close all dropdowns if clicked outside
      this.isDropdownOpen = false;
      this.openDropdownInfo = null;
    }
  }

  getAttendanceStatus1(studentId: number, scheduleId: number): string {
    return (
      this.attendanceStatuses[studentId]?.[scheduleId]?.attendanceStatus1 ?? ''
    );
  }

  getAttendanceStatus2(studentId: number, scheduleId: number): string {
    return (
      this.attendanceStatuses[studentId]?.[scheduleId]?.attendanceStatus2 ?? ''
    );
  }

  selectStatus(
    studentId: number,
    scheduleId: number,
    status: string,
    isStatus1: boolean
  ): void {
    if (!this.attendanceStatuses[studentId]) {
      this.attendanceStatuses[studentId] = {};
    }
    if (!this.attendanceStatuses[studentId][scheduleId]) {
      this.attendanceStatuses[studentId][scheduleId] = {
        attendanceStatus1: '',
        attendanceStatus2: '',
      };
    }

    if (isStatus1) {
      this.attendanceStatuses[studentId][scheduleId].attendanceStatus1 = status;
    } else {
      this.attendanceStatuses[studentId][scheduleId].attendanceStatus2 = status;
    }

    const attendanceRequest: AttendanceRequest = {
      studentId: studentId,
      scheduleId: scheduleId,
      attendanceStatus1:
        this.attendanceStatuses[studentId][scheduleId].attendanceStatus1,
      attendanceStatus2:
        this.attendanceStatuses[studentId][scheduleId].attendanceStatus2,
      note: this.attendanceComments[studentId]?.[scheduleId] || null,
    };

    this.attendanceService
      .updateOrCreateAttendance(studentId, scheduleId, attendanceRequest)
      .subscribe(
        (response: AttendanceResponse) => {
          this.attendanceStatuses[studentId][scheduleId].attendanceStatus1 =
            response.attendanceStatus1;
          this.attendanceStatuses[studentId][scheduleId].attendanceStatus2 =
            response.attendanceStatus2;
          this.toastr.success('Attendance updated successfully.');
        },
        (error) => {
          console.error('Error updating attendance:', error);
          this.toastr.error('Failed to update attendance.');
        }
      );
  }

  openCommentDialog(studentId: number, scheduleId: number): void {
    const existingComment =
      this.attendanceComments[studentId]?.[scheduleId] || '';

    const dialogRef = this.dialog.open(CommentDialogComponent, {
      width: '400px',
      data: { studentId, sessionId: scheduleId, comment: existingComment },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined) {
        if (!this.attendanceComments[studentId]) {
          this.attendanceComments[studentId] = {};
        }
        this.attendanceComments[studentId][scheduleId] = result;

        const attendanceRequest: AttendanceRequest = {
          studentId: studentId,
          scheduleId: scheduleId,
          attendanceStatus1:
            this.attendanceStatuses[studentId]?.[scheduleId]
              ?.attendanceStatus1 || '',
          attendanceStatus2:
            this.attendanceStatuses[studentId]?.[scheduleId]
              ?.attendanceStatus2 || '',
          note: result,
        };

        this.attendanceService
          .updateOrCreateAttendance(studentId, scheduleId, attendanceRequest)
          .subscribe(
            (response: AttendanceResponse) => {
              this.attendanceComments[studentId][scheduleId] = response.note;
              this.toastr.success('Comment added successfully.');
            },
            (error) => {
              console.error('Error updating attendance with comment:', error);
              this.toastr.error('Failed to add comment.');
            }
          );
      }
    });
  }
}
