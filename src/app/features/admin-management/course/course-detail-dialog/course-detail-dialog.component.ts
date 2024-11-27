import { Component, OnInit, Inject } from '@angular/core';

import { CourseResponse } from '../../model/course/course-response.model';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-course-detail-dialog',
  templateUrl: './course-detail-dialog.component.html',
  styleUrls: ['./course-detail-dialog.component.scss']
})
export class CourseDetailDialogComponent {
  course: CourseResponse;

  constructor(public dialogRef: MatDialogRef<CourseDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CourseResponse) {
    this.course = data;
  }
  
onClose(){
  this.dialogRef.close();
}
  
}
