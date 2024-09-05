import { AfterViewInit, ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { CourseRequest } from '../model/course/course-request.model';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { AdminService } from 'src/app/core/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { CourseResponse } from '../model/course/course-response.model';
import { tap } from 'rxjs';
import { CourseDetailDialogComponent } from './course-detail-dialog/course-detail-dialog.component';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.scss']
})
export class CourseComponent implements OnInit, AfterViewInit{
  courseWorksHtml = '<p>course works!</p>';
  courses: CourseRequest[] = [];
  totalCourses: number = 0;

  displayedColumns: string[] =[
    'courseName',
    'courseCode',
    'classSchedule'
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
  ){}


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
        if(this.paginator) {
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
    this.dataSource.filterPredicate = (
      data: CourseResponse,
      filter: string
    ) => {
      const filterLowerCase = filter.toLowerCase();
      return(
        data.courseName.toLowerCase().includes(filterLowerCase) ||
        data.courseCode.toLowerCase().includes(filterLowerCase) ||
        data.classSchedule.toLowerCase().includes(filterLowerCase)       
      );
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
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
}
