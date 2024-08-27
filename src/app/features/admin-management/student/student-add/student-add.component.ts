import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/core/services/admin.service';
import { StudentRequest } from '../../model/studentRequest.model';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-student-add',
  templateUrl: './student-add.component.html',
  styleUrls: ['./student-add.component.scss'],
})
export class StudentAddComponent {
  studentForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private studentService: AdminService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<StudentAddComponent>
  ) {
    this.studentForm = this.fb.group({
      rollNumber: ['', Validators.required],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['', Validators.required],
      className: ['', Validators.required],
      dob: ['', [Validators.required, this.dateValidator]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)],
      ],
      address: ['', Validators.required],
      course: ['', Validators.required],
      parentFullName: ['', [Validators.required, Validators.minLength(2)]],
      studentRelation: ['', Validators.required],
      parentPhone: [
        '',
        [Validators.required, Validators.pattern(/^\+?[1-9]\d{1,14}$/)],
      ],
      parentGender: ['', Validators.required],
      parentJob: ['', Validators.required],
    });
  }

  dateValidator(control: any) {
    const date = new Date(control.value);
    const today = new Date();
    if (date > today) {
      return { invalidDate: true };
    }
    return null;
  }

  onSubmit() {
    if (this.studentForm.valid) {
      const student: StudentRequest = this.studentForm.value;
      console.log('Submitting student:', student);
      this.studentService
        .addStudent(student)
        .pipe(
          catchError((err) => {
            console.error('Error:', err);
            return throwError(err);
          })
        )
        .subscribe({
          next: (response) => {
            console.log('Response:', response);
            this.toastr.success('Student added successfully');
            this.studentForm.reset();
            this.closeDialog(true);
          },
          error: (err) => {
            console.error('Error:', err);
            this.toastr.error('Failed to add student');
          },
        });
    } else {
      this.toastr.error('Please fill out the form correctly!');
    }
  }

  onCancel(): void {
    this.closeDialog();
  }

  private closeDialog(success: boolean = false): void {
    this.dialogRef.close(success);
  }
}
