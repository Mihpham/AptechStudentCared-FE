import { Component, Inject } from '@angular/core';
import { Schedule } from '../../model/schedules/schedules.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ScheduleService } from 'src/app/core/services/admin/schedules.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-update-schedule',
  templateUrl: './update-schedule.component.html',
  styleUrls: ['./update-schedule.component.scss']
})
export class UpdateScheduleComponent {
  schedule: Schedule;

  constructor(
    private toastr:ToastrService,
    public dialogRef: MatDialogRef<UpdateScheduleComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { schedule: Schedule },
    private scheduleService: ScheduleService
  ) {
    this.schedule = { ...data.schedule }; // Clone the passed schedule to edit
  }

  onSubmit() {
    this.scheduleService.updateScheduleById(this.schedule.scheduleId, this.schedule).subscribe(
      (response) => {
        this.dialogRef.close(true); // Close the dialog and return success
        this.toastr.success('Update Sucessfully');
      },
      (error) => {
        this.toastr.success('Update failed');
        console.log("error" ,error);
        
      }
    );
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
