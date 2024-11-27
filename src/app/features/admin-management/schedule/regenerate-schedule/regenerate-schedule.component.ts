import { Component, Inject } from '@angular/core';
import { ScheduleRequest } from '../../model/schedules/schedule-request.model';
import { ScheduleService } from 'src/app/core/services/admin/schedules.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-regenerate-schedule',
  templateUrl: './regenerate-schedule.component.html',
  styleUrls: ['./regenerate-schedule.component.scss'],
})
export class RegenerateScheduleComponent {
  classId: number | null = null;
  subjectId: number | null = null;
  scheduleRequest: ScheduleRequest = {
    startDate: '',
    endDate: '',
    status: '',
    note: '',
  }; 

  constructor(
    private scheduleService: ScheduleService,
    private dialogRef: MatDialogRef<RegenerateScheduleComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { classId: number; subjectId: number },
    private toastr: ToastrService
  ) {
    this.classId = data.classId; // Get classId from data
    this.dialogRef = dialogRef; // Assign to the private property
    this.subjectId = data.subjectId; // Get subjectId from data
  }

  regenerateSchedules() {
    console.log('Schedule Request:', this.scheduleRequest); // Log the request to check values
    if (this.classId && this.subjectId) {
        this.scheduleService
            .regenerateSchedules(this.classId, this.subjectId, this.scheduleRequest)
            .subscribe(
                (response) => {
                    console.log('Schedules regenerated:', response);
                    this.dialogRef.close(true);
                    this.toastr.success('Schedules regenerated successfully!');
                },
                (error) => {
                    console.error('Error regenerating schedules:', error);
                    this.toastr.error('Error regenerating schedules');
                }
            );
    } else {
        console.error('Class ID or Subject ID is undefined.');
    }
}

  getDialogRef() {
    return this.dialogRef;
}
}
