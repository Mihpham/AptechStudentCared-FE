import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { StudentDetailDialogComponent } from '../student-detail-dialog/student-detail-dialog.component';
import { StudentAddComponent } from '../student-add/student-add.component';
import { StudentUpdateDialogComponent } from '../student-update-dialog/student-update-dialog.component';
import { StudentRequest } from '../../model/studentRequest.model';
import { AdminService } from 'src/app/core/services/admin.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { StudentResponse } from '../../model/studentResponse.model';

@Component({
  selector: 'app-student-all-statuses',
  templateUrl: './student-all-statuses.component.html',
  styleUrls: ['./student-all-statuses.component.scss'],
})
export class StudentAllStatusesComponent implements OnInit, AfterViewInit {
  students: StudentRequest[] = [];
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
  dataSource: MatTableDataSource<StudentRequest> =
    new MatTableDataSource<StudentRequest>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('fileInput') fileInput: any;

  constructor(
    public dialog: MatDialog,
    private studentService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadStudent();
  }

  getAvatarUrl(avatarName: string | undefined): string {
    return `/assets/images/${avatarName}`;
  }

  mapResponseToRequest(response: StudentResponse): StudentRequest {
    return {
      userId: response.userId, // Ensure this is a number
      image: response.image ?? '',
      rollNumber: response.rollNumber ?? '',
      fullName: response.fullName ?? '',
      password: '', // Set to default or handle appropriately
      gender: '',   // Set default or map gender if available
      className: response.className ?? '',
      dob: '',      // Set dob if applicable
      phoneNumber: response.phoneNumber ?? '',
      email: response.email ?? '',
      address: response.address ?? '',
      courses: response.courses ?? [], // Ensure courses is an array
      status: response.status ?? '',
      parentFullName: response.parentFullName ?? '',
      studentRelation: response.studentRelation ?? '',
      parentPhone: response.parentPhone ?? '',
      parentGender: response.parentGender ?? '',
    };
  }
  

  loadStudent(): void {
    this.studentService.getAllStudents().subscribe(
      (data: StudentResponse[]) => {
        this.students = data.map(this.mapResponseToRequest); 
        this.dataSource.data = [...this.students]; 
        this.totalStudents = this.students.length;
        if (this.paginator) {
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
      data: StudentRequest,
      filter: string
    ) => {
      const filterLowerCase = filter.toLowerCase();
      return (
        data.fullName.toLowerCase().includes(filterLowerCase) ||
        data.className.toLowerCase().includes(filterLowerCase) ||
        data.email.toLowerCase().includes(filterLowerCase)
      );
    };
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.paginator.page.subscribe(() => {
      this.loadStudent(); // Tải lại dữ liệu khi phân trang thay đổi
    });
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
          this.loadStudent(); // Tải lại danh sách học sinh sau khi thêm
          this.students.push(newStudent);
          this.dataSource.data = [...this.students];
        }
      });
  }

  onUpdate(event: MouseEvent, student: StudentRequest): void {
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
    if (confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(userId).subscribe({
        next: () => {
          this.students = this.students.filter(
            (student) => student.userId !== userId
          );
          this.toastr.success('Student deleted successfully');
          this.loadStudent(); // Reload the list of students after deletion
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
