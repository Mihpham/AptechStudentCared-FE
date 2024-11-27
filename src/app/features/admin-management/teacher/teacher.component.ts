import { Component, OnInit, ViewChild, AfterViewInit  } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { TeacherResponse } from '../model/teacher/teacher-response.model';// Assuming you have a model for TeacherResponse
import { TeacherService } from 'src/app/core/services/admin/teacher.service'; // Assuming a TeacherService to fetch data
import { TeacherAddComponent } from './teacher-add/teacher-add.component';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import { TeacherUpdateComponent } from './teacher-update/teacher-update.component';
import { TeacherDetailComponent } from './teacher-detail/teacher-detail.component';

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit{
  dataSource: MatTableDataSource<TeacherResponse> = new MatTableDataSource();
  displayedColumns: string[] = ['avatar', 'fullName', 'gender', 'dob', 'phone', 'status', 'actions'];
  searchTerm: string = '';
  totalTeachers: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private teacherService: TeacherService, private dialog: MatDialog, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadTeachers();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }


  // Method to load teachers from API
  loadTeachers() {
    this.teacherService.getAllTeachers().subscribe({
      next: (teachers: TeacherResponse[]) => {
        teachers.sort((a, b) => b.id - a.id);
        this.dataSource = new MatTableDataSource(teachers);
        this.totalTeachers = this.dataSource.data.length;
        this.dataSource.paginator = this.paginator;
      },
      error: (err) => {
        console.error('Error fetching teachers:', err);
      }
    });
  }

  // Method to apply search filter
  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onRowClick(event: MouseEvent, teacher: TeacherResponse, ): void {
    this.dialog.open(TeacherDetailComponent, {
      data: teacher,
      width: '550px', // Adjust as needed
    });
  }

  // Method to handle adding a new teacher
  onAdd() {
    // Open dialog for adding a teacher
    const dialogRef = this.dialog.open(TeacherAddComponent, {
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.reload) {
        this.loadTeachers(); // Reload data if needed
      }
    });
  }

  // Method to handle updating a teacher
  onUpdate(teacher: TeacherResponse, event: Event) {
    event.stopPropagation(); // Prevent click from propagating

    // Open dialog for updating teacher
    const dialogRef = this.dialog.open(TeacherUpdateComponent, {
      width: '500px',
      data: teacher
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.reload) {
        this.loadTeachers(); // Reload data if needed
      }
    });
  }

  // Method to handle deleting a teacher
  onDelete(id: number, event: Event): void {
    event.stopPropagation(); // Prevent the row click event from firing

    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
    }).then((result) => {
      if (result.isConfirmed) {
        this.teacherService.deleteTeacher(id).subscribe({
          next: () => {
            console.log(`Teacher with ID ${id} deleted`);

            this.dataSource.data = this.dataSource.data.filter(
              (teacher) => teacher.id !== id
            );
            this.dataSource.data = this.dataSource.data;
            this.totalTeachers = this.dataSource.data.length;
            this.toastr.success('Student has been deleted.');

          },
          error: (err) => {
            console.error('Error deleting teacher:', err);
            const errorMessage =
              err.error && err.error.message
                ? err.error.message
                : 'Failed to delete teacher';
            Swal.fire('Error', errorMessage, 'error');
          },
        });
      }
    });
  }
}
