import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { tap } from 'rxjs';
import { AdminService } from 'src/app/core/services/admin.service';
import { CourseRequest } from '../model/course/course-request.model';
import { CourseResponse } from '../model/course/course-response.model';

import { CourseAddComponent } from './course-add/course-add.component';

import Swal from 'sweetalert2';
import { CourseDetailDialogComponent } from './course-detail-dialog/course-detail-dialog.component';
import { CourseUpdateDialogComponent } from './course-update-dialog/course-update-dialog.component';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})

export class CourseComponent implements OnInit, AfterViewInit {
  courseWorksHtml = '<p>course works!</p>';
  courses: CourseRequest[] = [];
  totalCourses: number = 0;


displayedColumns: string[] = [
  'courseId',
  'courseName',
  'courseCode',
  'classSchedule',
  'actions'
];
dataSource: MatTableDataSource<CourseResponse> =
  new MatTableDataSource<CourseResponse>();

@ViewChild(MatPaginator) paginator!: MatPaginator;
@ViewChild('fileInput') fileInput: any;


constructor(
  public dialog: MatDialog,
  private courseService: AdminService,
  private toastr: ToastrService,
  private cdr: ChangeDetectorRef,
) { }


ngOnInit(): void {
  this.loadCourse();
}

loadCourse(): void {
  this.courseService
    .getAllCourse()
    .pipe(tap((data) => console.log('Data loaded:', data)))
    .subscribe(
      (data: CourseResponse[]) => {
        this.courses = data;
        this.dataSource.data = [...this.courses];
        this.totalCourses = this.courses.length;
        if (this.paginator) {
          this.paginator.pageIndex = 0;
        }
        this.cdr.markForCheck(); // Trigger change detection cycle
      },
      (error) => {
        this.toastr.error('Failed to load courses', 'Error');
        console.error('Error fetching courses', error);
      }
    );
}


ngAfterViewInit(): void {
  this.dataSource.paginator = this.paginator;
}

onRowClick(event: MouseEvent, course: CourseRequest): void {
  if(!(event.target as HTMLElement).closest('button')) {
  this.dialog.open(CourseDetailDialogComponent, {
    width: '650px',
    data: course,
  });
}
  }

onAdd(): void {
  const dialogRef = this.dialog.open(CourseAddComponent, {
    width: '550px',
  });

  dialogRef
      .afterClosed()
    .subscribe((newCourse: CourseRequest | undefined) => {
      if (newCourse) {
        this.loadCourse();
        this.cdr.markForCheck(); // Trigger change detection cycle
        this.paginator.pageIndex = 0; // Update paginator
      }
    });
}

onUpdate(event: MouseEvent, course: CourseResponse): void {
  console.log('Couse ID: ', course.id); 
  const dialogRef = this.dialog.open(CourseUpdateDialogComponent, {
    width: '550px',
    data: course,
  });

  dialogRef.afterClosed()
    .subscribe((updatedCourse: CourseResponse | undefined) => {
      if (updatedCourse) {
        const index = this.courses.findIndex(
          (s) => s.id === updatedCourse.id
        );
        if (index !== -1) {
          this.courses[index] = updatedCourse;
          this.dataSource.data = [...this.courses];
          this.cdr.markForCheck(); // Trigger change detection cycle
          this.paginator.pageIndex = 0; // Update paginator
        } else {
          this.loadCourse(); // Reload courses list if not found
        }
      }
    });
}


onDelete(course: CourseResponse): void {
  console.log('CourseId:', course.id);
  Swal.fire({
    width: 350,
    title: 'Are you sure you want to delete this student?',
    text: 'This action cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#3085d6',
    cancelButtonColor: '#d33',
    confirmButtonText: 'Yes, delete it!',
  }).then((result) => {
    if (result.isConfirmed) {
      this.courseService.deleteCourse(course.id).subscribe({
        next: () => {
          this.toastr.success('Course deleted successfully', 'Success');
          this.loadCourse(); // Reload course list after delete
          this.cdr.markForCheck(); // Trigger change detection cycle
          this.paginator.pageIndex = 0; // Update paginator
        },
        error: (err) => {
          console.error('Error deleting student:', err);
          const errorMessage =
            err.error && err.error.message
              ? err.error.message
              : 'Failed to delete student';
          this.toastr.error(errorMessage);
        },
      });
    }
  });
}
}
