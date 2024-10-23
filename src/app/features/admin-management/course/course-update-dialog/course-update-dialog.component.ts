import { AfterViewInit, Component, ElementRef, HostListener, OnDestroy, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { catchError, throwError } from 'rxjs';
import { SubjectService } from 'src/app/core/services/admin/subject.service';
import { CourseResponse } from '../../model/course/course-response.model';
import { CourseService } from 'src/app/core/services/admin/course.service';

@Component({
  selector: 'app-course-update-dialog',
  templateUrl: './course-update-dialog.component.html',
  styleUrls: ['./course-update-dialog.component.scss']
})
export class CourseUpdateDialogComponent implements OnInit, AfterViewInit, OnDestroy {
  courseForm!: FormGroup;
  semesters = ['Sem1', 'Sem2', 'Sem3', 'Sem4'];
  availableSubjects: string[] = [];
  selectedSubjectsBySemester: { [key: string]: string[] } = {};
  isDropdownOpen: { [key: string]: boolean } = {};
  private dropdownElement: HTMLElement | null = null;
  courseId!: number;

  constructor(
    private fb: FormBuilder,
    private courseService: CourseService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<CourseUpdateDialogComponent>,
    private el: ElementRef,
    private subjectService: SubjectService,
    @Inject(MAT_DIALOG_DATA) public data: CourseResponse
  ) { }

  ngOnInit(): void {
    this.initializeForm(this.data);
    this.loadSubjects();
    this.loadCourse();
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

  initializeForm(course: CourseResponse): void {
    this.courseId = this.data.id;
    this.courseForm = this.fb.group({
      courseName: [course.courseName, Validators.required],
      courseCode: [course.courseCode, Validators.required],
      courseCompTime: [course.courseCompTime, Validators.required],
      semesters: this.fb.group({
        Sem1: this.fb.array([]),
        Sem2: this.fb.array([]),
        Sem3: this.fb.array([]),
        Sem4: this.fb.array([])
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
      this.availableSubjects = subjects.map(subject => subject.subjectCode);
    });
  }

  loadCourse(): void {
    if (!this.data.id) {
      console.error('Course ID is missing.');
      return;
    }

    this.courseService.getCourseById(this.data.id).pipe(
      catchError(error => {
        console.error('Error loading course:', error);
        this.toastr.error('Failed to load course');
        return throwError(error);
      })
    ).subscribe(course => {
      if (course) {
        this.courseForm.patchValue({
          courseName: course.courseName,
          courseCode: course.courseCode,
          courseCompTime: course.courseCompTime
        });
        this.setSemesters(course.semesters as { [key: string]: string[] });
      }
    });
  }

  setSemesters(semesters: { [key: string]: string[] }): void {
    this.semesters.forEach(semester => {
      const formArray = this.courseForm.get(['semesters', semester]) as FormArray;
      formArray.clear(); // Xóa tất cả các điều khiển hiện tại
      (semesters[semester] || []).forEach(subject => {
        formArray.push(this.fb.control(subject));
      });
      this.selectedSubjectsBySemester[semester] = semesters[semester] || [];
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
  
    formArray.clear(); // Xóa tất cả các điều khiển hiện tại
    this.selectedSubjectsBySemester[semester].forEach(subject => {
      formArray.push(this.fb.control(subject));
    });
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
      // Tạo bản sao của giá trị form
      const formValue = { ...this.courseForm.value };
  
      // Đảm bảo tất cả các kỳ đều có dữ liệu, ngay cả khi chúng trống
      this.semesters.forEach(semester => {
        if (!formValue.semesters[semester]) {
          formValue.semesters[semester] = [];
        }
      });
  
      // Xóa các kỳ không có môn học
      Object.keys(formValue.semesters).forEach(semester => {
        if (formValue.semesters[semester].length === 0) {
          delete formValue.semesters[semester];
        }
      });
  
      console.log('Course Form Value:', formValue); // In ra giá trị để kiểm tra
  
      this.courseService.updateCourse(this.data.id, formValue).subscribe({
        next: (response) => {
          this.toastr.success('Course updated successfully');
          this.dialogRef.close({ reload: true }); // Đóng hộp thoại và yêu cầu tải lại dữ liệu
        },
        error: (err) => {
          console.error('Error:', err);
          this.toastr.error('Failed to update course');
          this.dialogRef.close(); // Đóng hộp thoại khi có lỗi
        }
      });
    } else {
      this.toastr.error('Please fill out the form correctly!');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
