import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { AdminService } from 'src/app/core/services/admin.service';
import { CourseRequest } from '../../model/course/course-request.model';
import { CourseResponse } from '../../model/course/course-response.model';

@Component({
  selector: 'app-course-update-dialog',
  templateUrl: './course-update-dialog.component.html',
  styleUrls: ['./course-update-dialog.component.scss']
})
export class CourseUpdateDialogComponent {
  courseForm: FormGroup;
  imageUrl: string | ArrayBuffer | null = null;
  imageError: string | null = null;
  availableCourses: string[] = ['Mathematics', 'Science', 'History', 'Art']; // Example courses

  constructor(
    private fb: FormBuilder,
    private courseService: AdminService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<CourseUpdateDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.courseForm = this.fb.group({
      courseId: [data?.id],
      courseName: [data?.courseName || ''],
      courseCode: [data?.courseCode || '', Validators.required],
      classSchedule: [data?.classSchedule || '', Validators.required],
    });

  }

  onCourseChange(event: any) {
    const courses = this.courseForm.get('courses')?.value || [];
    if (event.target.checked) {
      courses.push(event.target.value);
    } else {
      const index = courses.indexOf(event.target.value);
      if (index > -1) {
        courses.splice(index, 1);
      }
    }
    this.courseForm.get('courses')?.setValue(courses);
  }


  onSubmit(): void {
    if (this.courseForm.valid) {
      console.log('Form submitted:', this.courseForm.value);

      const courseId = this.courseForm.value.courseId; // Extract courseId from the form
      const course: CourseRequest = this.courseForm.value; // Extract course details

      // Call the service to update the course
      this.courseService.updateCourse(courseId, course).subscribe({
        next: (response: CourseResponse) => {
          console.log('Course updated successfully', response);
          this.dialogRef.close(response); // Close dialog and return the response
        },
        error: (error) => {
          console.error('Error updating student', error);
          this.toastr.error('Failed to update student', 'Error');
        }
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
