import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { DayOfWeek } from 'src/app/core/enum/DayOfWeek';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { ScheduleService } from 'src/app/core/services/admin/schedules.service';
import { ClassResponse } from '../../model/class/class-response.model';
import { Schedule } from '../../model/schedules/schedules.model';
import { AddScheduleComponent } from '../add-schedule/add-schedule.component';
import { UpdateClassComponent } from '../../class/update-class/update-class.component';
import { UpdateScheduleComponent } from '../update-schedule/update-schedule.component';
import { ToastrService } from 'ngx-toastr';
import { RegenerateScheduleComponent } from '../regenerate-schedule/regenerate-schedule.component';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-schedule-class',
  templateUrl: './schedule-class.component.html',
  styleUrls: ['./schedule-class.component.scss'],
})
export class ScheduleClassComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  classId: number | null = null;
  subjectId: number | null = null;
  classDetails: ClassResponse | null = null;
  schedules: Schedule[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 10;
  currentUserRole!: string | null;

  get paginatedSchedules() {
    const start = this.currentPage * this.itemsPerPage;
    return this.schedules.slice(start, start + this.itemsPerPage);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private classService: ClassService,
    private authService: AuthService,
    private dialog: MatDialog,
    private scheduleService: ScheduleService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.currentUserRole = this.authService.getRole();

    this.route.params.subscribe((params) => {
      this.classId = +params['classId'];
      this.subjectId = +params['subjectId'];

      if (this.classId && this.subjectId) {
        this.getClassDetails(this.classId);
        this.loadSchedules();
      } else {
        console.error('Class ID or Subject ID is undefined.');
      }
    });
  }

  navigateToAddSchedule() {
    const dialogRef = this.dialog.open(AddScheduleComponent, {
      width: '400px',
      data: { classId: this.classId, subjectId: this.subjectId },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadSchedules();
      }
    });
  }

  navigateToAttendance(): void {
    if (this.classId && this.subjectId) {
      const path = `/${this.currentUserRole === 'ROLE_ADMIN' ? 'admin' : 'sro'}/attendance/${this.classId}/${this.subjectId}`;
      this.router.navigate([path]).then(() => {
        console.log('Navigation successful to attendance.');
      }).catch(err => {
        console.error('Navigation failed:', err);
      });
    } else {
      console.error('Class ID or Subject ID is undefined.');
    }
  }
  

  getSubjectCodeById(subjectId: number | null): string | undefined {
    if (!this.classDetails || !this.classDetails.subjectTeachers) {
      return undefined;
    }
    const subject = this.classDetails.subjectTeachers.find(
      (teacher) => teacher.subjectId === subjectId
    );
    return subject ? subject.subjectCode : undefined;
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
  }
  getSubjectCode(): string {
    const subject = this.classDetails?.subjectTeachers.find(st => st.subjectId === this.subjectId);
    return subject ? subject.subjectCode : 'N/A';
}


getTeacherName(): string {
    const subject = this.classDetails?.subjectTeachers.find(st => st.subjectId === this.subjectId);
    return subject ? subject.teacherName : 'N/A';
}

getNumberOfSessions(): number {
    const subject = this.classDetails?.subjectTeachers.find(st => st.subjectId === this.subjectId);
    return subject ? subject.numberOfSessions : 0;
}


  getDaysAsNumbers(days: DayOfWeek[]): string {
    const dayMap: { [key in DayOfWeek]: number } = {
      [DayOfWeek.MONDAY]: 2,
      [DayOfWeek.TUESDAY]: 3,
      [DayOfWeek.WEDNESDAY]: 4,
      [DayOfWeek.THURSDAY]: 5,
      [DayOfWeek.FRIDAY]: 6,
      [DayOfWeek.SATURDAY]: 7,
      [DayOfWeek.SUNDAY]: 8,
    };

    return days.map((day) => dayMap[day]).join(', ');
  }

  getClassDetails(classId: number): void {
    this.classService.findClassById(classId).subscribe(
      (data: ClassResponse) => {
        this.classDetails = data;
        console.log('Class Details:', this.classDetails);
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
            console.log('Schedules loaded:', this.schedules);
          },
          (error) => {
            console.error('Error fetching schedules:', error);
          }
        );
    } else {
      console.error('Class ID or Subject ID is undefined.');
    }
  }
  openEditSchedule(schedule: Schedule) {
    const dialogRef = this.dialog.open(UpdateScheduleComponent, {
      width: '400px',
      data: { schedule }, // Pass the schedule data to the dialog
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadSchedules(); // Reload schedules if the edit was successful
      }
    });
  }

  deleteSchedule(id: number): void {
    this.scheduleService.deleteScheduleById(id).subscribe(
      () => {
        this.loadSchedules();
        this.toastr.success('Delete Sucessfully');
      },
      (error) => {
        this.toastr.error('Delete failed', error);
      }
    );
  }

  openRegenerateDialog(): void {
    const dialogRef = this.dialog.open(RegenerateScheduleComponent, {
        width: '400px',
        data: { classId: this.classId, subjectId: this.subjectId },
    });

    dialogRef.afterClosed().subscribe((result) => {
        if (result) {
            this.loadSchedules(); // Reload schedules if regeneration was successful
        }
    });
}
}
