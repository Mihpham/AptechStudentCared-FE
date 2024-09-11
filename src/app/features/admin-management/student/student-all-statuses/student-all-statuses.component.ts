import {
  Component,
  OnInit,
  ViewChild,
  AfterViewInit,
  signal,
} from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
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
import Swal from 'sweetalert2';

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
  statusCounts = signal({ studying: 0, delay: 0, dropped: 0, graduated: 0 });

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
        this.updateStatusCounts(); // Update counts when loading students
        this.dataSource.paginator = this.paginator;
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

  updateStatusCounts(): void {
    const counts = { studying: 0, delay: 0, dropped: 0, graduated: 0 };

    this.students.forEach((student) => {
      if (student.status === 'STUDYING') counts.studying++;
      if (student.status === 'DELAY') counts.delay++;
      if (student.status === 'DROPPED') counts.dropped++;
      if (student.status === 'GRADUATED') counts.graduated++;
    });

    this.statusCounts.set(counts);
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  onRowClick(event: MouseEvent, student: StudentRequest): void {
    this.router.navigate(['/admin/student/details', student.userId]);
  }

  onStudentAdded() {
    this.loadStudent(); // Tải lại danh sách sinh viên khi nhận được sự kiện
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(StudentAddComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.reload) {
        this.loadStudent(); // Reload data if needed
      }
    });
  }

  onUpdate(student: StudentRequest, event: Event): void {
    event.stopPropagation(); // To prevent the row click event from triggering
    const dialogRef = this.dialog.open(StudentUpdateDialogComponent, {
      width: '650px',
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
            this.updateStatusCounts(); // Update counts after editing
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
        this.studentService.deleteStudent(userId).subscribe({
          next: () => {
            console.log(`Student with ID ${userId} deleted`);

            this.students = this.students.filter(
              (student) => student.userId !== userId
            );
            this.dataSource.data = this.students;
            this.totalStudents = this.students.length;
            this.updateStatusCounts(); // Update counts after deletion

            Swal.fire('Deleted!', 'Student has been deleted.', 'success');
          },
          error: (err) => {
            console.error('Error deleting student:', err);
            const errorMessage =
              err.error && err.error.message
                ? err.error.message
                : 'Failed to delete student';
            Swal.fire('Error', errorMessage, 'error');
          },
        });
      }
    });
  }
}
