import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { StudentDetailDialogComponent } from '../student-detail-dialog/student-detail-dialog.component';
import { StudentAddComponent } from '../student-add/student-add.component';
import { StudentUpdateDialogComponent } from '../student-update-dialog/student-update-dialog.component';
import { StudentRequest } from '../../model/student-request.model';
import { AdminService } from 'src/app/core/services/admin.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { ChangeDetectorRef } from '@angular/core';
import { StudentResponse } from '../../model/student-response.model.';
import Swal from 'sweetalert2';
import { tap } from 'rxjs';

@Component({
  selector: 'app-student-all-statuses',
  templateUrl: './student-all-statuses.component.html',
  styleUrls: ['./student-all-statuses.component.scss'],
})
export class StudentAllStatusesComponent implements OnInit, AfterViewInit {
  students: StudentResponse[] = [];
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
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadStudent();
  }

  getAvatarUrl(avatarName: string | undefined): string {
    return `/assets/images/${avatarName}`;
  }

  loadStudent(): void {
    this.studentService
      .getAllStudents()
      .pipe(tap((data) => console.log('Data loaded:', data)))
      .subscribe(
        (data: StudentResponse[]) => {
          this.students = data;
          this.dataSource.data = [...this.students];
          this.totalStudents = this.students.length;
          if (this.paginator) {
            this.paginator.pageIndex = 0;
          }
          this.cdr.markForCheck(); // Trigger change detection cycle
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
    this.dataSource.paginator = this.paginator;
  }

  onRowClick(event: MouseEvent, student: StudentRequest): void {
    if (!(event.target as HTMLElement).closest('button')) {
      this.dialog.open(StudentDetailDialogComponent, {
        width: '650px',
        data: student,
      });
    }
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(StudentAddComponent, {
      width: '550px',
    });

    dialogRef
      .afterClosed()
      .subscribe((newStudent: StudentRequest | undefined) => {
        if (newStudent) {
          this.loadStudent();
          this.cdr.markForCheck(); // Trigger change detection cycle
          this.paginator.pageIndex = 0; // Update paginator
        }
      });
  }

  
onUpdate(event: MouseEvent, student: StudentResponse): void {
  const dialogRef = this.dialog.open(StudentUpdateDialogComponent, {
    width: '550px',
    data: student,
  });

  dialogRef.afterClosed().subscribe((updatedStudent: StudentResponse | undefined) => {
    if (updatedStudent) {
      const index = this.students.findIndex(
        (s) => s.userId === updatedStudent.userId
      );
      if (index !== -1) {
        this.students[index] = updatedStudent;
        this.dataSource.data = [...this.students];
        this.cdr.markForCheck(); // Trigger change detection cycle
        this.paginator.pageIndex = 0; // Update paginator
      } else {
        this.loadStudent(); // Reload students list if not found
      }
    }
  });
}

  onImport(): void {
    this.triggerFileInput();
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

  onDelete(userId: number): void {
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
        this.studentService.deleteStudent(userId).subscribe({
          next: () => {
            this.toastr.success('Student deleted successfully', 'Success');
            this.loadStudent(); // Tải lại danh sách học sinh sau khi xóa
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
