import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-student-update-dialog',
  templateUrl: './student-update-dialog.component.html',
  styleUrls: ['./student-update-dialog.component.scss']
})
export class StudentUpdateDialogComponent {
  studentForm: FormGroup;
  classes: string[] = ['10A', '10B', '11A', '11B']; // Example classes
  courses: string[] = ['Math', 'Science', 'History']; // Example courses

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StudentUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.studentForm = this.fb.group({
      fullName: [data?.fullName || '', Validators.required],
      rollNumber: [data?.rollNumber || '', Validators.required],
      class: [data?.class || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      phoneNumber: [data?.phoneNumber || '', Validators.required],
      course: [data?.course || '', Validators.required],
      address: [data?.address || '', Validators.required],
      status: [data?.status || 'Studying', Validators.required],
      studentGender: [data?.gender || 'Male'],
      guardianFullName: [data?.guardian?.fullName || ''],
      guardianGender: [data?.guardian?.gender || 'Male'],
      guardianPhoneNumber: [data?.guardian?.phoneNumber || ''],
      guardianRelationship: [data?.guardian?.relationship || ''],
    });
  }

  onSave(): void {
    if (this.studentForm.valid) {
      this.dialogRef.close(this.studentForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
