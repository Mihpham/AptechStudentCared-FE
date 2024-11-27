import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { CourseService } from 'src/app/core/services/admin/course.service';
import { SubjectService } from 'src/app/core/services/admin/subject.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-course-add',
  templateUrl: './course-add.component.html',
  styleUrls: ['./course-add.component.scss'],
})
export class CourseAddComponent implements AfterViewInit, OnDestroy, OnInit {
  courseForm!: FormGroup;
  semesters = ['sem1', 'sem2', 'sem3', 'sem4'];
  availableSubjects: string[] = [];
  selectedSubjectsBySemester: { [key: string]: string[] } = {};
  isDropdownOpen: { [key: string]: boolean } = {};
  private dropdownElement: HTMLElement | null = null;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<CourseAddComponent>,
    private el: ElementRef,
    private subjectService: SubjectService,
  ) { }

  ngOnInit(): void {
    this.initializeForm();
    this.loadSubjects();
  }

  ngAfterViewInit() {
    this.dropdownElement = this.el.nativeElement.querySelector('.relative');
  }

  ngOnDestroy() {
    // Clean up any listeners if necessary
  }

  @HostListener('document:click', ['$event'])
  onClick(event: MouseEvent) {
    Object.keys(this.isDropdownOpen).forEach(semester => {
      if (this.dropdownElement && !this.dropdownElement.contains(event.target as Node)) {
        this.isDropdownOpen[semester] = false;
      }
    });
  }

  initializeForm(): void {
    this.courseForm = this.fb.group({
      courseName: ['', Validators.required],
      courseCode: ['', Validators.required],
      courseCompTime: ['', Validators.required],
      semesters: this.fb.group({
        sem1: this.fb.array([]),
        sem2: this.fb.array([]),
        sem3: this.fb.array([]),
        sem4: this.fb.array([])
      })
    });
  }
  
  
  loadSubjects(): void {
    this.subjectService.getAllSubjects().pipe(
      catchError(error => {
        console.error('Error loading subjects:', error);
        this.toastr.error('Failed to load subjects');
        return throwError(error);
      })
    ).subscribe(subjects => {
      this.availableSubjects = subjects.map(subject => subject.subjectName);



    });
  }


  toggleDropdown(semester: string): void {
    this.isDropdownOpen[semester] = !this.isDropdownOpen[semester];
  }

  onCheckboxClick(event: MouseEvent, semester: string, subject: string): void {
    event.stopPropagation(); // Prevent click from affecting the dropdown toggle
    this.onSubjectToggle(semester, subject);
  }

  onSubjectToggle(semester: string, subject: string): void {
    setTimeout(() => {
      const formArray = this.courseForm.get(['semesters', semester]) as FormArray;
  
      if (!formArray) {
        console.error(`FormArray for ${semester} does not exist.`);
        return;
      }
  
      const selectedSubjects = this.selectedSubjectsBySemester[semester] || [];
      if (selectedSubjects.includes(subject)) {
        this.selectedSubjectsBySemester[semester] = selectedSubjects.filter(s => s !== subject);
      } else {
        this.selectedSubjectsBySemester[semester] = [...selectedSubjects, subject];
      }
  
      // Đảm bảo FormArray được cập nhật đúng cách
      formArray.clear(); // Xóa tất cả các điều khiển hiện tại
      this.selectedSubjectsBySemester[semester].forEach(subject => {
        formArray.push(this.fb.control(subject));
      });
    }, 0);
  }
  
  
  isSubjectSelected(semester: string, subject: string): boolean {
    const selectedSubjects = this.selectedSubjectsBySemester[semester] || [];
    return selectedSubjects.includes(subject);
  }

  getSelectedSubjects(semester: string): string[] {
    return this.selectedSubjectsBySemester[semester] || [];
  }

  getFilteredSubjects(semester: string): string[] {
    const selectedSubjects = new Set<string>();
    this.semesters.forEach(sem => {
      if (sem !== semester) {
        const subjects = this.selectedSubjectsBySemester[sem] || [];
        subjects.forEach(subject => selectedSubjects.add(subject));
      }
    });
    return this.availableSubjects.filter(subject => !selectedSubjects.has(subject));
  }

  onSubmit() {
    if (this.courseForm.valid) {
      const course = this.courseForm.value;
      console.log('Course Form Value:', course);
    
      this.courseService.addCourse(course).subscribe({
        next: (response: any) => {
          console.log('Response:', response);
          this.toastr.success('Course added successfully');
          this.courseForm.reset();
          this.dialogRef.close({ reload: true });
        },
        error: (err) => {
          console.error('Error:', err);
  
          // Xử lý thông báo lỗi từ backend
          let errorMessage = 'Failed to add course';
  
          if (err.error && typeof err.error === 'object') {
            if (err.error.message) {
              errorMessage = err.error.message;
            } else {
              console.log('Error details from backend:', err.error);
            }
          }
  
          this.toastr.error(errorMessage);
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
