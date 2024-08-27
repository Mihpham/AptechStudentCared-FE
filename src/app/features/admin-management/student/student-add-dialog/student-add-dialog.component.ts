import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-student-add-dialog',
  templateUrl: './student-add-dialog.component.html',
  styleUrls: ['./student-add-dialog.component.scss']
})
export class StudentAddDialogComponent implements OnInit {
  studentForm: FormGroup;
  classes: string[] = ['10A', '10B', '11A', '11B']; // Replace with your actual classes
  courses: string[] = ['Math', 'Science', 'History']; // Replace with your actual courses

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<StudentAddDialogComponent>
  ) {
    this.studentForm = this.fb.group({
      fullName: ['', Validators.required],
      rollNumber: ['', Validators.required],
      class: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phoneNumber: ['', Validators.required],
      course: ['', Validators.required],
      address: ['', Validators.required],
      status: ['', Validators.required],
      gender: ['', Validators.required],
      guardianFullName: ['', Validators.required],
      guardianGender: ['', Validators.required],
      guardianPhoneNumber: ['', Validators.required],
      guardianRelationship: ['', Validators.required]
    });
  }

  ngOnInit(): void {  }

  getInitialAvatar(name: string): string {
    const initial = name.charAt(0).toUpperCase();
    return `https://via.placeholder.com/150?text=${initial}`;
  }

  onSave(): void {
    if (this.studentForm.valid) {
      // Handle save logic here
      this.dialogRef.close(this.studentForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
