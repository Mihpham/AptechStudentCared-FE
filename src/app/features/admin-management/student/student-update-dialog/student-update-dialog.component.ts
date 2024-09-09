import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/core/services/admin.service';
import { StudentRequest } from '../../model/studentRequest.model';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudentResponse } from '../../model/student-response.model.';

@Component({
  selector: 'app-student-update-dialog',
  templateUrl: './student-update-dialog.component.html',
  styleUrls: ['./student-update-dialog.component.scss']
})
export class StudentUpdateDialogComponent {
  studentForm: FormGroup;
  imageUrl: string | ArrayBuffer | null = null;
  imageError: string | null = null;
  availableCourses: string[] = ['Mathematics', 'Science', 'History', 'Art']; // Example courses
  selectedCourses: string[] = [];
  isDropdownOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private studentService: AdminService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<StudentUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.studentForm = this.fb.group({
      userId: [data?.userId || ''], // Ensure userId is included
      rollNumber: [data?.rollNumber || '', Validators.required],
      fullName: [data?.fullName || '', Validators.required],
      gender: [data?.gender || 'Male'], // Ensure field names match
      className: [data?.className || '', Validators.required],
      dob: [data?.dob || '', [Validators.required, this.dateValidator]],
      email: [data?.email || '', [Validators.required, Validators.email]],
      phoneNumber: [data?.phoneNumber || '', [Validators.required, Validators.pattern(/^\+?[0-9]\d{1,10}$/)]],
      address: [data?.address || '', Validators.required],
      courses: [data?.courses || [], Validators.required], // Ensure this is an array
      status: [data?.status || '', Validators.required],
      parentFullName: [data?.parentFullName || ''],
      parentGender: [data?.parentGender || 'Male'],
      parentPhone: [data?.parentPhone || ''],
      studentRelation: [data?.studentRelation || ''],
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

  onCourseToggle(course: string) {
    if (this.selectedCourses.includes(course)) {
      this.selectedCourses = this.selectedCourses.filter(c => c !== course);
    } else {
      this.selectedCourses.push(course);
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onCheckboxClick(event: MouseEvent, course: string) {
    event.stopPropagation();
    this.onCourseToggle(course);
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

  onSubmit(): void {
    if (this.studentForm.valid) {
  
      const studentId = this.studentForm.value.userId;
      const student: StudentRequest = this.studentForm.value;
  
      // Call the service to update the student
      this.studentService.updateStudent(studentId, student).subscribe({
        next: (response: StudentResponse) => {
          this.toastr.success('Student updated successfully', 'Success');
          this.dialogRef.close(response);
        },
        error: (error) => {
          console.error('Error updating student', error);
          this.toastr.error('Failed to update student', 'Error');
        }
      });
    } else {
      console.log('Form is invalid', this.studentForm.errors);
      this.toastr.error('Please fill in all required fields correctly.', 'Form Invalid');
    }
  }
  

  onCancel(): void {
    this.dialogRef.close();
  }
}
