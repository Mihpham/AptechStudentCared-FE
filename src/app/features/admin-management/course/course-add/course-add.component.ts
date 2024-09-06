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
      // courseName: ['', [Validators.required]], 
      // courseCode: ['', [Validators.required]],
      // classSchedule: ['', [Validators.required]],

      courseName: ['', [Validators.required]], 
      courseCode: ['', [Validators.required]],
      classSchedule: ['', [Validators.required]],
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

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  

  onCourseToggle(course: string) {
    const index = this.selectedCourses.indexOf(course);
    if (index > -1) {
      this.selectedCourses.splice(index, 1);
    } else {
      this.selectedCourses.push(course);
    }
    this.courseForm.get('courses')?.setValue(this.selectedCourses);
  }

  onCheckboxClick(event: Event, course: string) {
    event.stopPropagation(); // Prevents the event from bubbling up to the parent div
    const checkbox = event.target as HTMLInputElement;
    this.onCourseToggle(course);
  }

  onSubmit() {
    if (this.courseForm.valid) {
      const course: CourseRequest = this.courseForm.value;
      this.courseService.addCourse(course)
        .pipe(
          catchError((err) => {
            console.error('Error:', err);
            this.toastr.error('Failed to add course');
            return throwError(err);
          })
        )
        .subscribe({
          next: (response) => {
            console.log('Response:', response);
            this.toastr.success('Course added successfully');
            this.courseForm.reset();
            this.dialogRef.close(this.courseForm.value);
          },
          error: (err) => {
            console.error('Error:', err);
            this.toastr.error('Failed to add course');
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
