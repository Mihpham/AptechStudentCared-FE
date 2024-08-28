import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
// Import the Student interface
import { StudentRequest } from '../../model/studentRequest.model';


@Component({
  selector: 'app-student-detail-dialog',
  templateUrl: './student-detail-dialog.component.html',
  styleUrls: ['./student-detail-dialog.component.scss']
})
export class StudentDetailDialogComponent {
 imageSrc: string | null = null;
  constructor(
    public dialogRef: MatDialogRef<StudentDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public student: StudentRequest
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }
 

  handleImageError(): void {
    this.imageSrc = null;
  }


}
