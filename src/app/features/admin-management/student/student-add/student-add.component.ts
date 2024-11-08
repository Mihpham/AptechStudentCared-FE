import {
  Component,
  OnInit,
  AfterViewInit,
  HostListener,
  ElementRef,
  ChangeDetectorRef,
  Output,
  EventEmitter,
  Inject,
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { catchError, finalize, throwError } from 'rxjs';
import { StudentRequest } from '../../model/studentRequest.model';
import { CourseResponse } from '../../model/course/course-response.model';
import { StudentService } from 'src/app/core/services/admin/student.service';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { CourseService } from 'src/app/core/services/admin/course.service';
import { ClassRequest } from '../../model/class/class-request.model';
import { ClassResponse } from '../../model/class/class-response.model';
@Component({
  selector: 'app-student-add',
  templateUrl: './student-add.component.html',
  styleUrls: ['./student-add.component.scss'],
  providers: [StudentService],
})
export class StudentAddComponent implements AfterViewInit, OnInit {
  studentForm: FormGroup;
  selectedCourses: string[] = [];
  availableClasses: ClassResponse[] = [];
  availableCourses: CourseResponse[] = [];
  dropdownOpen = false;
  courseDropdownOpen = false;
  selectedClass: string | undefined;
  selectedCourse: any;
  provinces: any[] = [];
  districts: any[] = []; 
  communes: any[] = [];
  loadingClasses = false;

  isDropdownOpen = false;
  private dropdownElement: HTMLElement | null = null;
  students: StudentRequest[] = [];
  @Output() studentAdded = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private studentService: StudentService,
    private classService: ClassService,
    private coursesService: CourseService,
    private toastr: ToastrService,
    private el: ElementRef,
    private changeDetectorRef: ChangeDetectorRef,
    public dialogRef: MatDialogRef<StudentAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: StudentRequest
  ) {
    this.studentForm = this.fb.group({
      image: ['avatar-default.webp'],
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['', Validators.required],
      className: ['', Validators.required],
      dob: ['', [Validators.required, this.dateValidator]],
      phoneNumber: [
        '',
        [Validators.required, Validators.pattern(/^\+?[0-9]\d{1,10}$/)],
      ],
      parentFullName: ['', [Validators.required, Validators.minLength(2)]],
      studentRelation: ['', Validators.required],
      parentPhone: ['', [Validators.required]],
      parentGender: ['', Validators.required],
      courses: this.fb.control([]),
      province: [''], // Add this
      district: [''], // Add this
      commune: [''],
    });
  }

  ngOnInit(): void {
    this.loadAvailableClasses();
    this.loadAvailableCourses();
    this.loadGenderParent();
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
    this.loadingClasses = true;
  
    const page = 0;  
    const size = 10; 
  
    this.classService.findAllClasses(page, size)
      .pipe(
        catchError((err) => {
          this.toastr.error('Failed to load classes');
          return throwError(() => err);
        }),
        finalize(() => (this.loadingClasses = false))
      )
      .subscribe({
        next: (response) => {  
          if (Array.isArray(response.content)) {
            this.availableClasses = response.content; 
          } else {
            console.error('Expected an array of classes but received:', response);
          }
        },
      });
  }
  
  loadAvailableCourses() {
    this.coursesService
      .getAllCourse()
      .pipe(
        catchError((err) => {
          this.toastr.error('Failed to load courses');
          return throwError(() => err);
        }),
        finalize(() => (this.loadingClasses = false))
      )
      .subscribe({
        next: (courses) => (this.availableCourses = courses),
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
    const birthDate = new Date(control.value);
    const today = new Date();

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (
      monthDiff < 0 ||
      (monthDiff === 0 && today.getDate() < birthDate.getDate())
    ) {
      age--;
    }

    if (age < 18) {
      return { invalidAge: 'Student must be at least 18 years old.' };
    }

    if (birthDate > today) {
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
      const formValues = this.studentForm.value;

      // Combine the full address using names
      const fullAddress = `${formValues.commune} , ${formValues.district}, ${formValues.province}`;

      const student: StudentRequest = {
        ...formValues,
        address: fullAddress, // Use the combined address
      };

      this.studentService.addStudent(student).subscribe({
        next: (addedStudent) => {
          this.toastr.success('Student added successfully');
          this.studentAdded.emit();

          // Thêm sinh viên mới vào đầu danh sách
          this.students.unshift(addedStudent); // `students` là danh sách sinh viên hiển thị

          // Cuộn đến đầu trang hoặc tới phần tử mới
          this.scrollToNewlyAddedStudent();

          this.changeDetectorRef.detectChanges();
          this.closeDialog(true);
        },
        error: (error) => {
          if (
            error.message.includes(
              'Full name must contain at least first name and last name.'
            )
          ) {
            this.toastr.error(
              'Full name must contain at least first name and last name.'
            );
          } else {
            this.toastr.error('Failed to add student!', 'Error');
          }
        },
      });
    } else {
      this.studentForm.markAllAsTouched();
      this.toastr.error('Please fill out the form correctly!');
    }
  }

  scrollToNewlyAddedStudent() {
    setTimeout(() => {
      const newStudentElement = document.getElementById('student-0'); // Giả định sinh viên mới có ID 'student-0'
      if (newStudentElement) {
        newStudentElement.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    }, 0);
  }

  onCancel(): void {
    this.closeDialog();
  }

  private closeDialog(reload: boolean = false): void {
    this.dialogRef.close({ reload }); // Pass result object
  }

  onLocationChange(location: {
    province: string;
    district: string;
    commune: string;
  }): void {
    this.studentForm.get('province')?.setValue(location.province);
    this.studentForm.get('district')?.setValue(location.district); // Set name, not code
    this.studentForm.get('commune')?.setValue(location.commune);
  }
}
