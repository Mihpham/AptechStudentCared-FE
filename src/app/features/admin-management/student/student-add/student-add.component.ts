import {
  Component,
  HostListener,
  ElementRef,
  AfterViewInit,
  OnDestroy,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  OnInit,
  Inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminService } from 'src/app/core/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, throwError } from 'rxjs';
import { StudentRequest } from '../../model/studentRequest.model';
import { Class } from '../../model/class.model';
import { CourseResponse } from '../../model/course/course-response.model';
import { AddressService } from 'src/app/core/services/address.service';

@Component({
  selector: 'app-student-add',
  templateUrl: './student-add.component.html',
  styleUrls: ['./student-add.component.scss'],
  providers: [AdminService],
})
export class StudentAddComponent implements AfterViewInit, OnInit {
  studentForm: FormGroup;
  selectedCourses: string[] = [];
  availableClasses: Class[] = [];
  availableCourses: CourseResponse[] = [];
  dropdownOpen = false;
  courseDropdownOpen = false;
  selectedClass: string | undefined;
  selectedCourse: any;
  provinces: any[] = [];

  isDropdownOpen = false;
  private dropdownElement: HTMLElement | null = null;
  students: StudentRequest | undefined;
  @Output() studentAdded = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private studentService: AdminService,
    private addressService: AddressService,
    private toastr: ToastrService,
    private el: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<StudentAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StudentRequest
  ) {
    this.studentForm = this.fb.group({
      image: ['avatar-default.webp'],
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
      courses: this.fb.control([], Validators.required),
      parentFullName: ['', [Validators.required, Validators.minLength(2)]],
      studentRelation: ['', Validators.required],
      parentPhone: ['', [Validators.required]],
      parentGender: ['', Validators.required],
    });
  }
  ngOnInit(): void {
    this.loadAvailableClasses();
    this.loadAvailableCourses();
    this.loadGenderParent();

    this.addressService.getProvinces().subscribe((data) => {
      this.provinces = data;
    });
  }

  ngAfterViewInit() {
    this.dropdownElement = this.el.nativeElement.querySelector('.relative');
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    if (
      this.dropdownElement &&
      !this.dropdownElement.contains(event.target as Node)
    ) {
      this.isDropdownOpen = false;
    }
  }

  loadAvailableClasses() {
    this.studentService
      .findAllClasses()
      .pipe(
        catchError((err) => {
          this.toastr.error('Failed to load classes');
          return throwError(() => err);
        })
      )
      .subscribe({
        next: (classes) => (this.availableClasses = classes),
      });
  }

  loadAvailableCourses() {
    this.studentService.getAllCourse().subscribe({
      next: (courses) => (this.availableCourses = courses),
      error: (err) => this.toastr.error('Failed to load courses'),
    });
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

  
  selectClass(className: any) {
    this.selectedClass = className.className;
    this.studentForm.get('className')?.setValue(this.selectedClass);
    this.dropdownOpen = false;
  }

  selectCourse(courseItem: any) {
    this.selectedCourse = courseItem.courseName;
    this.studentForm.get('courses')?.setValue(this.selectedCourse);
    this.courseDropdownOpen = false;
  }

  toggleDropdown(): void {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  toggleCourseDropdown() {
    this.courseDropdownOpen = !this.courseDropdownOpen;
  }

  getFormattedCourses(): string {
    return this.selectedCourses.join(', ');
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

      this.studentService.addStudent(student).subscribe({
        next: () => {
          this.toastr.success('Student added successfully');

          // Emit event to notify parent component that a student was added
          this.studentAdded.emit();

          // Optionally trigger change detection (only if necessary)
          this.changeDetectorRef.detectChanges();

          // Close the dialog and pass true to indicate success
          this.closeDialog(true);
        },
        error: (err) => {
          // Handle the specific full name error case
          if (
            err.message &&
            err.message.includes(
              'Full name must contain at least first name and last name.'
            )
          ) {
            this.toastr.error(
              'Full name must contain at least first name and last name.'
            );
          } else {
            // Handle generic error case
            this.toastr.error('Failed to add student!', 'Error');
          }
        },
      });
    } else {
      // Mark all form controls as touched to show validation errors
      this.studentForm.markAllAsTouched();
      this.toastr.error('Please fill out the form correctly!');
    }
  }

  onCancel(): void {
    this.closeDialog();
  }

  private closeDialog(reload: boolean = false): void {
    this.dialogRef.close({ reload }); // Pass result object
  }
}
