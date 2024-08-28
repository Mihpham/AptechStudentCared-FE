import { Component, OnInit } from '@angular/core';
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
  student : StudentRequest | undefined;
  studentForm: FormGroup;
  availableCourses: string[] = ['Mathematics', 'Science', 'History', 'Art']; // Example courses
  imageUrl: string | ArrayBuffer | null = null;
  imageError: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private studentService: AdminService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<StudentAddComponent>
  ) {
    this.studentForm = this.fb.group({
      image: [''], // Field for image
      rollNumber: ['', Validators.required],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['', Validators.required],
      className: ['', Validators.required],
      dob: ['', [Validators.required, this.dateValidator]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^\+?[0-9]\d{1,10}$/)],
      ],
      address: ['', Validators.required],
      courses: [[], Validators.required], // Changed to courses
      parentFullName: ['', [Validators.required, Validators.minLength(2)]],
      studentRelation: ['', Validators.required],
      parentPhone: ['', [Validators.required]],
      parentGender: ['', Validators.required],
    });
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

  onCancel(): void {
    this.closeDialog();
  }

  private closeDialog(success: boolean = false): void {
    this.dialogRef.close(success);
  }
}
