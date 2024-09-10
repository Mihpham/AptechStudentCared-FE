import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table'; // No need to remove this since it's used for data handling, not UI
import { MatPaginator } from '@angular/material/paginator'; // This can be replaced with custom pagination if desired
import { MatDialog } from '@angular/material/dialog'; // You can keep Angular Material Dialog if you still want to use it
import { StudentDetailDialogComponent } from '../student-detail/student-detail-dialog.component';
import { StudentAddComponent } from '../student-add/student-add.component';
import { StudentUpdateDialogComponent } from '../student-update-dialog/student-update-dialog.component';
import { StudentRequest } from '../../model/studentRequest.model';
import { AdminService } from 'src/app/core/services/admin.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { StudentResponse } from '../../model/student-response.model.';

@Component({
  selector: 'app-student-all-statuses',
  templateUrl: './student-all-statuses.component.html',
  styleUrls: ['./student-all-statuses.component.scss'],
})
export class StudentAllStatusesComponent implements OnInit, AfterViewInit {
  students: StudentResponse[] = [];
  selectedStudent: StudentRequest | undefined;
  totalStudents: number = 0;
  searchTerm: string = '';

  displayedColumns: string[] = [
    'avatar',
    'rollNumber',
    'fullName',
    'className',
    'email',
    'phone',
    'status',
    'actions',
  ];
  dataSource: MatTableDataSource<StudentResponse> =
    new MatTableDataSource<StudentResponse>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('fileInput') fileInput: any;

  constructor(
    public dialog: MatDialog,
    private studentService: AdminService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadStudent(); // Load students when component initializes
  }

  getAvatarUrl(avatarName: string | undefined): string {
    return `/assets/images/${avatarName}`;
  }

  loadStudent(): void {
    this.studentService.getAllStudents().subscribe(
      (data) => {
        console.log('Data received from API:', data);
        this.students = data;
        this.dataSource.data = this.students;
        this.totalStudents = this.students.length;
        if (this.paginator) {
          this.dataSource.paginator = this.paginator;
          this.paginator.pageIndex = 0;
        }
      },
      (error) => {
        this.toastr.error('Failed to load students', 'Error');
        console.error('Error fetching students', error);
      }
    );
  }
  

  applyFilter(filterValue: string): void {
    this.dataSource.filterPredicate = (
      data: StudentResponse,
      filter: string
    ) => {
      const filterLowerCase = filter.toLowerCase();
      return (
        data.fullName.toLowerCase().includes(filterLowerCase) ||
        data.className?.toLowerCase().includes(filterLowerCase) ||
        data.email.toLowerCase().includes(filterLowerCase)
      );
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
  }

  onRowClick(event: MouseEvent, student: StudentRequest): void {
    this.router.navigate(['/admin/student/details', student.userId]);
  } 

  onStudentAdded() {
    this.loadStudent(); // Tải lại danh sách sinh viên khi nhận được sự kiện
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(StudentAddComponent, {
      width: '550px',
    });
        dialogRef.afterClosed().subscribe(result => {
          if (result && result.reload) {
            this.loadStudent(); // Reload data if needed
          }
        });
  }

  onUpdate(student: StudentRequest, event: Event): void {
    event.stopPropagation(); // To prevent the row click event from triggering
    const dialogRef = this.dialog.open(StudentUpdateDialogComponent, {
      width: '550px',
      data: student,
    });

    dialogRef
      .afterClosed()
      .subscribe((updatedStudent: StudentRequest | undefined) => {
        if (updatedStudent) {
          const index = this.students.findIndex(
            (s) => s.userId === updatedStudent.userId
          );
          if (index !== -1) {
            this.students[index] = updatedStudent;
            this.dataSource.data = [...this.students];
          } else {
            this.loadStudent();
          }
        }
      });
  }

  triggerFileInput(): void {
    const fileInput: HTMLInputElement | null = this.fileInput?.nativeElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onExport(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    const wbout: Uint8Array = XLSX.write(wb, {
      bookType: 'csv',
      type: 'array',
    });
    const blob = new Blob([wbout], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'students.csv');
  }

  onDelete(userId: number, event: Event): void {
    event.stopPropagation(); // Prevent the row click event from firing
    if (confirm('Are you sure you want to delete this student?')) {
        this.studentService.deleteStudent(userId).subscribe({
            next: () => {
                console.log(`Student with ID ${userId} deleted`);

                this.students = this.students.filter(
                    (student) => student.userId !== userId
                );
                this.dataSource.data = this.students;
                this.totalStudents = this.students.length;

                this.toastr.success('Student deleted successfully');
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
}

}
