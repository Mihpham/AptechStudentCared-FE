import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/core/services/admin.service';
import { StudentRequest } from '../../model/studentRequest.model';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, throwError } from 'rxjs';

@Component({
  selector: 'app-student-update-dialog',
  templateUrl: './student-update-dialog.component.html',
  styleUrls: ['./student-update-dialog.component.scss']
})
export class StudentUpdateDialogComponent {
  student : StudentRequest | undefined;
  studentForm: FormGroup;
  imageUrl: string | ArrayBuffer | null = null;
  imageError: string | null = null;
  availableCourses: string[] = ['Mathematics', 'Science', 'History', 'Art']; // Example courses
  

  constructor(
    private fb: FormBuilder,
    private studentService: AdminService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<StudentUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.studentForm = this.fb.group({
      image: [data?.image || ''], // Field for image
      rollNumber: [data?.rollNumber || '', Validators.required],
      fullName: [data?.fullName || '', Validators.required],
      studentGender: [data?.gender || 'Male'],
      className: [data?.class || '', Validators.required],
      dob: ['', [Validators.required, this.dateValidator]],
      email: [data?.email || '', [Validators.required, Validators.email]],
      phoneNumber: [data?.phoneNumber || '', Validators.required, Validators.pattern(/^\+?[0-9]\d{1,10}$/)],
      address: [data?.address || '', Validators.required],
      courses: [data?.course || '', Validators.required],
      status: [data?.status || 'Studying', Validators.required],
      parentFullName: [data?.parent?.fullName || ''],
      parentGender: [data?.parent?.gender || 'Male'],
      parentPhone: [data?.parent?.phoneNumber || ''],
      studentRelation: [data?.student?.relationship || ''],
    });


    // // Set the image URL if it exists in data
    // this.imageUrl = data?.image || null;
  }

  dateValidator(control: any) {
    const date = new Date(control.value);
    const today = new Date();
    if (date > today) {
      return { invalidDate: 'Date of birth cannot be in the future.' };
    }
    return null;
  }

  onCourseChange(event: any) {
    const courses = this.studentForm.get('courses')?.value || [];
    if (event.target.checked) {
      courses.push(event.target.value);
    } else {
      const index = courses.indexOf(event.target.value);
      if (index > -1) {
        courses.splice(index, 1);
      }
    }
    this.studentForm.get('courses')?.setValue(courses);
  }

  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 1048576) { // 1MB
        this.imageError = 'File size should not exceed 1MB.';
        return;
      }
      const reader = new FileReader();
      reader.onload = () => {
        this.imageUrl = reader.result;
      };
      reader.readAsDataURL(file);
      this.imageError = null;
    }
  }

  onSubmit() {
    if (this.studentForm.valid) {
      const updatedStudent: StudentRequest = this.studentForm.value;
      console.log('Updating student:', updatedStudent);
      // Pass the image as a separate property if needed
      updatedStudent.image = this.imageUrl as string;
      this.studentService.updateStudent(updatedStudent)
      .pipe(
        catchError((err) => {
          console.error("Error:", err);
          return throwError(err);
        })
      )
      .subscribe({
        next: (response) => {
          console.log('Response:', response);
          this.toastr.success('Student updated successfully');
          this.dialogRef.close(true);
        },
        error: (err) => {
          console.error('Error:', err);
          this.toastr.error('Failed to update student');
          this.dialogRef.close(false);
        }
      });
    } else {
      this.toastr.error('Please fill out the form correctly!');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
