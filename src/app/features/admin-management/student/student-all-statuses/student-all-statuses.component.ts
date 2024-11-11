import {
  Component,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute, Router } from '@angular/router';
import { saveAs } from 'file-saver';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/auth/auth.service';
import { StudentService } from 'src/app/core/services/admin/student.service';
import Swal from 'sweetalert2';
import * as XLSX from 'xlsx';
import { PaginatedStudentResponse } from '../../model/pagination-response';
import { StudentResponse } from '../../model/student-response.model.';
import { StudentRequest } from '../../model/studentRequest.model';
import { ImportStudentDialogComponent } from '../import-student-dialog/import-student-dialog.component';
import { StudentAddComponent } from '../student-add/student-add.component';
import { StudentUpdateDialogComponent } from '../student-update-dialog/student-update-dialog.component';

@Component({
  selector: 'app-student-all-statuses',
  templateUrl: './student-all-statuses.component.html',
  styleUrls: ['./student-all-statuses.component.scss'],
})
export class StudentAllStatusesComponent implements OnInit {
  students: StudentResponse[] = [];
  selectedStudent: StudentRequest | undefined;
  totalStudents: number = 0;
  className: string | null = null;
  statusCounts = signal({ studying: 0, delay: 0, dropped: 0, graduated: 0 });
  selectedFile: File | null = null;
  isImportVisible: boolean = false;
  currentUserRole!: string | null;
  currentPage = signal(1);
  itemsPerPage = signal(10);
  totalPages = signal(0);
  searchTerm: { rollNumber: string; fullName: string; email: string; status: string } = {
    rollNumber: '',
    fullName: '',
    email: '',
    status: ''
  };

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
    private authService: AuthService,
    private studentService: StudentService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentUserRole = this.authService.getRole();
    this.route.queryParams.subscribe((params) => {
      this.className = params['className'] || null;
    });
    this.loadStudent();
    this.loadStatusCounts();
  }

  loadStudent(): void {
    const page = this.currentPage();
    const size = this.itemsPerPage();
    this.studentService.getAllStudents(page, size).subscribe((data: PaginatedStudentResponse) => {
      console.log('Data received from API:', data);
      this.totalStudents = data.totalElements;
      this.totalPages.set(data.totalPages);
      this.dataSource.data = data.content;
    });
  }
  loadStatusCounts(): void {
    const page = this.currentPage();
    const size = this.itemsPerPage();
  
    this.studentService.getStudentsByStatus('STUDYING', page, size).subscribe(
      (data: PaginatedStudentResponse) => {
        this.statusCounts.set({ ...this.statusCounts(), studying: data.totalElements });
      },
      (error) => {
        console.error('Error fetching STUDYING count:', error);
        this.toastr.error('Failed to load STUDYING students');
      }
    );
  
    this.studentService.getStudentsByStatus('DELAY', page, size).subscribe(
      (data: PaginatedStudentResponse) => {
        this.statusCounts.set({ ...this.statusCounts(), delay: data.totalElements });
      },
      (error) => {
        console.error('Error fetching DELAY count:', error);
        this.toastr.error('Failed to load DELAY students');
      }
    );
  
    this.studentService.getStudentsByStatus('DROPPED', page, size).subscribe(
      (data: PaginatedStudentResponse) => {
        this.statusCounts.set({ ...this.statusCounts(), dropped: data.totalElements });
      },
      (error) => {
        console.error('Error fetching DROPPED count:', error);
        this.toastr.error('Failed to load DROPPED students');
      }
    );
  
    this.studentService.getStudentsByStatus('GRADUATED', page, size).subscribe(
      (data: PaginatedStudentResponse) => {
        this.statusCounts.set({ ...this.statusCounts(), graduated: data.totalElements });
      },
      (error) => {
        console.error('Error fetching GRADUATED count:', error);
        this.toastr.error('Failed to load GRADUATED students');
      }
    );
  }
  

  applyFilter(): void {
    const page = this.currentPage();
    const size = this.itemsPerPage();
    
    const queryParams: any = {};
  
    if (this.searchTerm.rollNumber.trim()) {
      queryParams.rollNumber = this.searchTerm.rollNumber.trim();
    }
  
    if (this.searchTerm.fullName.trim()) {
      queryParams.fullName = this.searchTerm.fullName.trim();
    }
  
    if (this.searchTerm.email.trim()) {
      queryParams.email = this.searchTerm.email.trim();
      
    }
    
    queryParams.page = page;
    queryParams.size = size;
  
    this.studentService.searchStudents(queryParams).subscribe(
      (data: PaginatedStudentResponse) => {
        console.log('Data received from search API:', data);
        this.totalStudents = data.totalElements;
        this.totalPages.set(data.totalPages);
        this.dataSource.data = data.content;
      },
      error => {
        console.error('Error during search:', error);
        this.toastr.error('Error occurred while searching students');
      }
    );
  }

  onItemsPerPageChange(newItemsPerPage: number): void {
    this.itemsPerPage.set(newItemsPerPage);
    this.currentPage.set(1);
    this.loadStudent();
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages()) {
      this.currentPage.set(pageNumber);
      this.loadStudent();
    }
  }

  goToNextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadStudent();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadStudent();
    }
  }

  goToFirstPage(): void {
    this.currentPage.set(1);
    this.loadStudent();
  }

  goToLastPage(): void {
    this.currentPage.set(this.totalPages());
    this.loadStudent();
  }

  onImport(): void {
    const dialogRef = this.dialog.open(ImportStudentDialogComponent, {
      width: '500px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.reload) {
        this.loadStudent();
      }
    });
  }

  onRowClick(event: MouseEvent, student: StudentRequest): void {
    this.currentUserRole === 'ROLE_ADMIN'
      ? this.router.navigate(['/admin/student/details', student.userId])
      : this.router.navigate(['/sro/student/details', student.userId]);
  }

  onStudentAdded() {
    this.loadStudent();
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

  onUpdate(student: StudentResponse, event: Event): void {
    event.stopPropagation();
    const dialogRef = this.dialog.open(StudentUpdateDialogComponent, {
      width: '650px',
      data: student,
    });

    dialogRef
      .afterClosed()
      .subscribe((updatedStudent: StudentResponse | undefined) => {
        if (updatedStudent) {
          const index = this.students.findIndex(
            (s) => s.userId === updatedStudent.userId
          );
          if (index !== -1) {
            this.students[index] = updatedStudent;
            this.dataSource.data = [...this.students];
          } else {
            this.loadStudent();
            this.loadStatusCounts();
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
    event.stopPropagation();
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
