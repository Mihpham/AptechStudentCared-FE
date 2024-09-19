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
import { StudentAddComponent } from '../student-add/student-add.component';
import { StudentUpdateDialogComponent } from '../student-update-dialog/student-update-dialog.component';
import { StudentRequest } from '../../model/studentRequest.model';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { StudentResponse } from '../../model/student-response.model.';
import Swal from 'sweetalert2';
import { StudentService } from 'src/app/core/services/admin/student.service';
import { HttpEventType, HttpResponse } from '@angular/common/http';
import { ImportStudentDialogComponent } from '../import-student-dialog/import-student-dialog.component';

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
  className: string | null = null; // Thay đổi kiểu thành string | null
  statusCounts = signal({ studying: 0, delay: 0, dropped: 0, graduated: 0 });
  selectedFile: File | null = null;
  isImportVisible: boolean = false;

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
    private studentService: StudentService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.className = params['className'] || null; // Nhận tên lớp từ query params
      this.loadStudent(); // Tải sinh viên khi component khởi tạo
    });
  }

  loadStudent(): void {
    this.studentService.getAllStudents().subscribe(
      (data) => {
        console.log('Data received from API:', data);
        if (this.className) {
          this.students = data.filter(
            (student) => student.className === this.className
          ); // Lọc sinh viên dựa trên tên lớp nếu có
        } else {
          this.students = data; // Hiển thị tất cả sinh viên nếu không có lớp
        }
        this.dataSource.data = this.students;
        this.totalStudents = this.students.length;
        this.updateStatusCounts(); // Cập nhật số lượng khi tải sinh viên
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
        data.email.toLowerCase().includes(filterLowerCase) ||
        data.status.toLowerCase().includes(filterLowerCase) ||
        data.phoneNumber.toLowerCase().includes(filterLowerCase) ||
        data.rollNumber.toLowerCase().includes(filterLowerCase)
      );
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }


  onImport(): void {
    const dialogRef = this.dialog.open(ImportStudentDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.reload) {
        this.loadStudent(); // Reload student data after import
      }
    });
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
            this.updateStatusCounts(); // Cập nhật số lượng sau khi chỉnh sửa
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
            this.updateStatusCounts(); // Cập nhật số lượng sau khi xóa

            Swal.fire('Deleted!', 'Student has been deleted.', 'success');
            this.toastr.success('Student has been deleted.');
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
