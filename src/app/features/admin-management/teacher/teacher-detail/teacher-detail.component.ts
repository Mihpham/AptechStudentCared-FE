import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-teacher-detail',
  templateUrl: './teacher-detail.component.html',
  styleUrls: ['./teacher-detail.component.scss']
})
export class TeacherDetailComponent {
  constructor(
    public dialogRef: MatDialogRef<TeacherDetailComponent>,
    @Inject(MAT_DIALOG_DATA) public teacher: any // Adjust type as needed
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
}
