import { Component, OnInit, ViewChild, AfterViewInit  } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { TeacherResponse } from '../model/teacher/teacher-response.model';// Assuming you have a model for TeacherResponse
import { TeacherService } from 'src/app/core/services/admin/teacher.service'; // Assuming a TeacherService to fetch data

@Component({
  selector: 'app-teacher',
  templateUrl: './teacher.component.html',
  styleUrls: ['./teacher.component.scss']
})
export class TeacherComponent implements OnInit{
  dataSource: MatTableDataSource<TeacherResponse> = new MatTableDataSource();
  displayedColumns: string[] = ['avatar', 'fullName', 'gender', 'dob', 'phone', 'className', 'status', 'actions'];
  searchTerm: string = '';
  totalTeachers: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(private teacherService: TeacherService, private dialog: MatDialog) {}

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
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  // Method to handle adding a new teacher
  onAdd() {
    // // Open dialog for adding a teacher
    // const dialogRef = this.dialog.open(TeacherFormComponent, {
    //   width: '500px',
    //   data: { isNew: true }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.loadTeachers(); // Reload teachers after adding
    //   }
    // });
  }

  // Method to handle updating a teacher
  onUpdate(teacher: TeacherResponse, event: Event) {
    // event.stopPropagation(); // Prevent click from propagating

    // // Open dialog for updating teacher
    // const dialogRef = this.dialog.open(TeacherFormComponent, {
    //   width: '500px',
    //   data: { isNew: false, teacher }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.loadTeachers(); // Reload teachers after updating
    //   }
    // });
  }

  // Method to handle deleting a teacher
  onDelete(id: number, event: Event) {
    event.stopPropagation(); // Prevent click from propagating
    if (confirm('Are you sure you want to delete this teacher?')) {
      this.teacherService.deleteTeacher(id).subscribe({
        next: () => {
          this.loadTeachers(); // Reload teachers after deletion
        },
        error: (err) => {
          console.error('Error deleting teacher:', err);
        }
      });
    }
  }
}
