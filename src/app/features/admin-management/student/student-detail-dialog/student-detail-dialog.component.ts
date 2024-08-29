import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudentRequest } from '../../model/student-request.model';
// Import the Student interface


@Component({
  selector: 'app-student-detail-dialog',
  templateUrl: './student-detail-dialog.component.html',
  styleUrls: ['./student-detail-dialog.component.scss']
})
export class StudentDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<StudentDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public student: StudentRequest
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  getAvatarUrl(avatarName: string | undefined): string {
    return `/assets/images/${avatarName}`;
  }



}
