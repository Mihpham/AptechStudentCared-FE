import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ScheduleService } from 'src/app/core/services/admin/schedules.service';
import { CreateScheduleRequest } from '../../model/schedules/create-schedule-request.model';

@Component({
  selector: 'app-add-schedule',
  templateUrl: './add-schedule.component.html',
  styleUrls: ['./add-schedule.component.scss'],
})
export class AddScheduleComponent implements OnInit {
  classId: number | null = null;
  subjectId: number | null = null;
  scheduleRequest: CreateScheduleRequest = {
    startDate: '',
    status: '',
    note: '',
  };

  constructor(
    private scheduleService: ScheduleService,
    private dialogRef: MatDialogRef<AddScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { classId: number; subjectId: number }
  ) {}

  ngOnInit(): void {
    this.classId = this.data.classId; // Get classId from data
    this.subjectId = this.data.subjectId; // Get subjectId from data
  }

  submitSchedule() {
    if (this.classId && this.subjectId) {
      this.scheduleService
        .createSchedule(this.classId, this.subjectId, this.scheduleRequest)
        .subscribe(
          (response) => {
            console.log('Schedule created:', response);
            this.dialogRef.close(true); // Close dialog and pass true to indicate success
          },
          (error) => {
            console.error('Error creating schedule:', error);
          }
        );
    } else {
      console.error('Class ID or Subject ID is undefined.');
    }
  }
}
