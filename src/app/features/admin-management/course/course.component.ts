import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { CourseRequest } from '../model/course/course-request.model';
import { CourseResponse } from '../model/course/course-response.model';
import { Router } from '@angular/router';
import { CourseAddComponent } from './course-add/course-add.component';

import Swal from 'sweetalert2';
import { CourseDetailDialogComponent } from './course-detail-dialog/course-detail-dialog.component';
import { CourseUpdateDialogComponent } from './course-update-dialog/course-update-dialog.component';
import { CourseService } from 'src/app/core/services/admin/course.service';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})

export class CourseComponent implements OnInit, AfterViewInit {
  courses: CourseResponse[] = [];
  totalCourses: number = 0;
  searchTerm: string = '';

  displayedColumns: string[] = [
    'courseName',
    'courseCode',
    'courseCompTime',
    'actions'
  ];
  dataSource: MatTableDataSource<CourseResponse> =
    new MatTableDataSource<CourseResponse>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('fileInput') fileInput: any;


  constructor(
    public dialog: MatDialog,
    private courseService: CourseService,
    private toastr: ToastrService,
    private cdr: ChangeDetectorRef,
    private router: Router,
  ) { }


  ngOnInit(): void {
    this.loadCourse();
  }

  loadCourse(): void {
    this.courseService.getAllCourse().subscribe(
      (data: CourseResponse[]) => {
        this.courses = data.sort((a, b) => b.id - a.id); // This is of type CourseResponse[]
        this.dataSource.data = [...this.courses];
        this.totalCourses = this.courses.length;
        this.applyFilter(this.searchTerm);
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

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  onRowClick(courseId : number): void {
    this.courseService.getCourseById(courseId).subscribe((course: CourseResponse) => {
      this.dialog.open(CourseDetailDialogComponent, {
        data: course,
        width: '500px' // Đặt chiều rộng tối đa của dialog
      });
    });
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(CourseAddComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.reload) {
        this.loadCourse(); // Reload data if needed
      }
    });
  }

  onUpdate(event: MouseEvent, course: CourseResponse): void {
    event.stopPropagation();
    console.log('Couse ID: ', course.id);
    const dialogRef = this.dialog.open(CourseUpdateDialogComponent, {
      width: '550px',
      data: course,
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.reload) {
        this.loadCourse(); // Reload data if needed
      }
    });
  }


  onDelete(event: MouseEvent, course: CourseResponse): void {
    event.stopPropagation();
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
        console.log(course);
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
            this.toastr.error(errorMessage); console.log('Response:', err.error); // log the response body
          },
        });
      }
    });
  }

  triggerFileInput(): void {
    // Handle file import action
  }

  onExport(): void {
    // Handle export action
  }
}
