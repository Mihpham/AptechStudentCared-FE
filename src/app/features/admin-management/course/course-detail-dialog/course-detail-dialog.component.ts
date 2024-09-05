import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CourseRequest } from '../../model/course/course-request.model';
import { MatDialogModule } from '@angular/material/dialog';

// Import the Course interface


@Component({
  selector: 'app-course-detail-dialog',
  templateUrl: './course-detail-dialog.component.html',
  styleUrls: ['./course-detail-dialog.component.scss']
})
export class CourseDetailDialogComponent {
  constructor(
    public dialogRef: MatDialogRef<CourseDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public course: CourseRequest
  ) {}

  onClose(): void {
    this.dialogRef.close();
  }

  // getAvatarUrl(avatarName: string | undefined): string {
  //   return `/assets/images/${avatarName}`;
  // }



}
