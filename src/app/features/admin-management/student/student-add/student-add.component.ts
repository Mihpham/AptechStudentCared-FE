import { Component, HostListener, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/core/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { MatDialogRef } from '@angular/material/dialog';
import { catchError, throwError } from 'rxjs';
import { StudentRequest } from '../../model/studentRequest.model';

@Component({
  selector: 'app-student-add',
  templateUrl: './student-add.component.html',
  styleUrls: ['./student-add.component.scss'],
})
export class StudentAddComponent implements AfterViewInit, OnDestroy {
  studentForm: FormGroup;
  availableCourses: string[] = ['Mathematics', 'Science', 'History', 'Art'];
  selectedCourses: string[] = [];
  isDropdownOpen = false;
  private dropdownElement: HTMLElement | null = null;

  constructor(
    private fb: FormBuilder,
    private studentService: AdminService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<StudentAddComponent>,
    private el: ElementRef
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
  
  dateValidator(control: any) {
    const date = new Date(control.value);
    const today = new Date();
    if (date > today) {
      return { invalidDate: 'Date of birth cannot be in the future.' };
    }
    return null;
  }

  onCourseToggle(course: string) {
    const index = this.selectedCourses.indexOf(course);
    if (index > -1) {
      this.selectedCourses.splice(index, 1);
    } else {
      this.selectedCourses.push(course);
    }
    this.studentForm.get('courses')?.setValue(this.selectedCourses);
  }

  onCheckboxClick(event: Event, course: string) {
    event.stopPropagation(); // Prevents the event from bubbling up to the parent div
    const checkbox = event.target as HTMLInputElement;
    this.onCourseToggle(course);
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
            this.closeDialog(student);
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

  private closeDialog(newStudent?: StudentRequest): void {
    this.dialogRef.close(newStudent); 
  }
}
