import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { AdminService } from 'src/app/core/services/admin.service';
import { CourseRequest } from '../../model/course/course-request.model';

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.component.html',
  styleUrls: ['./course-add.component.scss'],
})
export class CourseAddComponent implements AfterViewInit, OnDestroy {
  courseForm: FormGroup;
  availableCourses: string[] = ['Mathematics', 'Science', 'History', 'Art'];
  selectedCourses: string[] = [];
  isDropdownOpen = false;
  private dropdownElement: HTMLElement | null = null;

  constructor(
    private fb: FormBuilder,
    private courseService: AdminService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<CourseAddComponent>,
    private el: ElementRef
  ) {
    this.courseForm = this.fb.group({
      // courseId: [''],
      courseName: ['', [Validators.required]],
      courseCode: ['', [Validators.required]],
      classSchedule: ['', [Validators.required]],
      courseCompTime: ['', Validators.required],
    });
  }

  ngAfterViewInit() {
    this.dropdownElement = this.el.nativeElement.querySelector('.relative');
  }

  ngOnDestroy() {
    // Clean up any listeners if necessary
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (this.dropdownElement && !this.dropdownElement.contains(event.target as Node)) {
      this.isDropdownOpen = false;
    }
  }

  onSubmit() {
    if (this.courseForm.valid) {
      const course: CourseRequest = this.courseForm.value;
      this.courseService.addCourse(course)
        .subscribe({
          next: (response: any) => {
            console.log('Response:', response);
            this.toastr.success('Course added successfully');
            this.courseForm.reset();
            this.dialogRef.close(); // Close the dialog
          },
          error: (err) => {
            if (err.status === 201) {
              console.log('Course added successfully');
              this.toastr.success('Course added successfully');
              this.courseForm.reset();
              this.dialogRef.close(this.courseForm.value); // Close the dialog
            } else {
              console.error('Error:', err);
              console.log('Response:', err.error); // log the response body
              this.toastr.error('Failed to add course');
              this.dialogRef.close(); // Close the dialog on error
            }
          },
        });
    } else {
      this.toastr.error('Please fill out the form correctly!');
    }
  }


  onCancel(): void {
    this.dialogRef.close();
  }


}
