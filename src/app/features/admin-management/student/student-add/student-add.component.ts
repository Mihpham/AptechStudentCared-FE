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
  availableCourses: string[] = ['Mathematics', 'Science', 'History', 'Art'];
  imageUrl: string | ArrayBuffer | null = null;
  imageError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private studentService: AdminService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<StudentAddComponent>
  ) {
    this.studentForm = this.fb.group({
      image: ['avatar-default.webp'],
      rollNumber: ['', Validators.required],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['', Validators.required],
      className: ['', Validators.required],
      dob: ['', [Validators.required, this.dateValidator]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^\+?[0-9]\d{1,10}$/)]],
      address: ['', Validators.required],
      courses: this.fb.control([], Validators.required),
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
    const course = event.target.value;

    if (event.target.checked) {
      if (!courses.includes(course)) {
        courses.push(course);
      }
    } else {
      const index = courses.indexOf(course);
      if (index > -1) {
        courses.splice(index, 1);
      }
    }
    this.studentForm.get('courses')?.setValue(courses);
  }

  onSubmit() {
    if (this.studentForm.valid) {
      const student: StudentRequest = this.studentForm.value;
      this.studentService.addStudent(student)
        .pipe(
          catchError((err) => {
            console.error('Error:', err);
            this.toastr.error('Failed to add student');
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
