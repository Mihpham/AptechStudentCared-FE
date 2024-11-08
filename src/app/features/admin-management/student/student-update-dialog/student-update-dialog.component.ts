import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StudentRequest } from '../../model/studentRequest.model';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { StudentResponse } from '../../model/student-response.model.';
import { catchError, throwError } from 'rxjs';
import { CourseResponse } from '../../model/course/course-response.model';
import { StudentService } from 'src/app/core/services/admin/student.service';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { CourseService } from 'src/app/core/services/admin/course.service';
import { ClassRequest } from '../../model/class/class-request.model';
import { ClassResponse } from '../../model/class/class-response.model';

@Component({
  selector: 'app-student-update-dialog',
  templateUrl: './student-update-dialog.component.html',
  styleUrls: ['./student-update-dialog.component.scss'],
})
export class StudentUpdateDialogComponent implements OnInit {
  studentForm: FormGroup;
  imageUrl: string | ArrayBuffer | null = null;
  imageError: string | null = null;
  availableClasses: ClassResponse[] = [];
  availableCourses: CourseResponse[] = [];
  selectedCourses: string[] = [];
  isDropdownOpen: boolean = false;

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private classService: ClassService,
    private coursesService: CourseService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<StudentUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.studentForm = this.fb.group({
      userId: [data?.userId || '', Validators.required],
      rollNumber: [data?.rollNumber || '', Validators.required],
      fullName: [
        data?.fullName || '',
        [Validators.required, Validators.minLength(2)],
      ],
      gender: [data?.gender || 'Male', Validators.required],
      className: [data?.className || '', Validators.required],
      dob: [data?.dob || '', [Validators.required, this.dateValidator]],
      email: [data?.email || '', [Validators.required, Validators.email]],
      phoneNumber: [
        data?.phoneNumber || '',
        [Validators.required, Validators.pattern(/^\+?[0-9]\d{1,10}$/)],
      ],
      address: [data?.address || '', Validators.required],
      courses: [data?.courses || []], // Initialize with data if available
      status: [data?.status || '', Validators.required],
      parentFullName: [
        data?.parentFullName || '',
        [Validators.required, Validators.minLength(2)],
      ],
      parentGender: [data?.parentGender || 'Male', Validators.required],
      parentPhone: [
        data?.parentPhone || '',
        [Validators.required, Validators.pattern(/^\+?[0-9]\d{1,10}$/)],
      ],
      studentRelation: [data?.studentRelation || '', Validators.required],
    });

    if (data?.courses) {
      this.selectedCourses = data.courses;
      this.studentForm.get('courses')?.setValue(this.selectedCourses);
    }
  }

  ngOnInit(): void {
    this.loadAvailableClasses();
    this.loadAvailableCourses();
    this.loadGenderParent();
  }

  dateValidator(control: any) {
    const date = new Date(control.value);
    const today = new Date();
    if (date > today) {
      return { invalidDate: 'Date of birth cannot be in the future.' };
    }
    return null;
  }

  loadGenderParent() {
    this.studentForm
      .get('studentRelation')
      ?.valueChanges.subscribe((relation) => {
        if (relation === 'Father') {
          this.studentForm.get('parentGender')?.setValue('Male');
        } else if (relation === 'Mother') {
          this.studentForm.get('parentGender')?.setValue('Female');
        } else {
          this.studentForm.get('parentGender')?.setValue(null);
        }
      });
  }

  selectCourse(courseItem: CourseResponse) {
    const courseCode = courseItem.courseCode;
    if (!this.selectedCourses.includes(courseCode)) {
      this.selectedCourses.push(courseCode);
    }
    this.studentForm.get('courses')?.setValue(this.selectedCourses);
    this.isDropdownOpen = false; // Close dropdown after selection
  }

  getSelectedCoursesString(): string {
    return this.selectedCourses.join(', '); // Join with ", " ensuring no extra commas
  }

  getFormattedCourses(): string {
    return this.getSelectedCoursesString(); // Call the method to get the formatted string
  }

  onCourseToggle(course: CourseResponse) {
    const courseCode = course.courseCode;
    if (courseCode) {
      const index = this.selectedCourses.indexOf(courseCode);
      if (index > -1) {
        this.selectedCourses.splice(index, 1); // Remove the course if already selected
      } else {
        this.selectedCourses.push(courseCode); // Add the course if not selected
      }
      this.studentForm.get('courses')?.setValue(this.selectedCourses); // Update form control
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  onCheckboxClick(event: MouseEvent, course: CourseResponse) {
    event.stopPropagation();
    this.onCourseToggle(course);
  }

  loadAvailableClasses() {
    const page = 0;
    const size = 10;
  
    this.classService
      .findAllClasses(page, size)
      .pipe(
        catchError((err) => {
          this.toastr.error('Failed to load classes');
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (response: any) => {
          console.log('Full API response:', response); // Log the full response to check its structure
          if (Array.isArray(response.content)) {
            this.availableClasses = response.content;
          } else {
            console.error(
              'Expected an array of classes in response.content, but received:',
              response.content
            );
          }
        },
      });
  }  

  loadAvailableCourses() {
    this.coursesService.getAllCourse().subscribe({
      next: (courses: CourseResponse[]) => {
        this.availableCourses = courses;
      },
      error: (err: any) => this.toastr.error('Failed to load courses'),
    });
  }

  onImageChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      if (file.size > 1048576) {
        // 1MB
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

      this.studentService.updateStudent(studentId, student).subscribe({
        next: (response: StudentResponse) => {
          this.toastr.success('Student updated successfully', 'Success');
          this.dialogRef.close(response);
        },
        error: (error: any) => {
          console.error('Error updating student', error);
          this.toastr.error('Failed to update student', 'Error');
        },
      });
    } else {
      this.toastr.error(
        'Please fill in all required fields correctly.',
        'Form Invalid'
      );
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
