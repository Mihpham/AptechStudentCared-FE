import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { DayOfWeek } from 'src/app/core/enum/DayOfWeek';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { ScheduleService } from 'src/app/core/services/admin/schedules.service';
import { ClassResponse } from '../../model/class/class-response.model';
import { Schedule } from '../../model/schedules/schedules.model';
import { MatDialog } from '@angular/material/dialog';
import { AddScheduleComponent } from '../add-schedule/add-schedule.component';

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

  get paginatedSchedules() {
    const start = this.currentPage * this.itemsPerPage;
    return this.schedules.slice(start, start + this.itemsPerPage);
  }

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Inject the Router service
    private classService: ClassService,
    private dialog: MatDialog ,
    private scheduleService: ScheduleService
  ) {}

  ngOnInit(): void {
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
      data: { classId: this.classId, subjectId: this.subjectId } // Pass data if needed
    });
  
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Reload schedules if needed
        this.loadSchedules();
      }
    });
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
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
}
