import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, signal } from '@angular/core';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { StudentAddComponent } from '../../student/student-add/student-add.component';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/core/services/admin/student.service';
import { StudentUpdateDialogComponent } from '../../student/student-update-dialog/student-update-dialog.component';
import { AuthService } from 'src/app/core/auth/auth.service';
import { StudentResponse } from '../../model/student-response.model.';

@Component({
  selector: 'app-class-detail',
  templateUrl: './class-detail.component.html',
})
export class ClassDetailComponent implements OnInit {
  classId: number | null = null;
  currentUserRole!: string | null;
  currentPage = signal(1); // Track the current page
  itemsPerPage = signal(10); // Track items per page
  totalPages = signal(0); // Track the total number of pages
  totalItems = signal(0); // Track the total number of items
  totalStudent: number = 0;
  classDetails: any;
  students: StudentResponse[] = [];

  constructor(
    private route: ActivatedRoute,
    private classService: ClassService,
    private studentService: StudentService,
    private authService: AuthService,
    private router: Router,
    public dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.currentUserRole = this.authService.getRole();
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      this.classId = id ? +id : null;
      if (this.classId) {
        this.loadClassDetails(this.classId); // Load class details on component initialization
      } else {
        console.error('Class ID is undefined or invalid.');
      }
    });
  }

  // Fetch class details with pagination
  loadClassDetails(classId: number): void {
    const page = this.currentPage(); // Get current page
    const size = this.itemsPerPage(); // Get items per page
    
    this.classService.findClassById(classId, page, size).subscribe(
      (data) => {
        this.classDetails = data;
        console.log(this.classDetails);
        
        console.log(this.classDetails.content[0]?.center);
        
        this.students = data.students;
        this.totalStudent = data.totalElements; // total number of students
        this.totalItems.set(data.totalElements); // total number of items
        this.totalPages.set(Math.ceil(data.totalElements / size)); // total number of pages
      },
      (error) => {
        console.error('Error fetching class details:', error);
      }
    );
  }

  // Change the number of items per page and reset to page 1
  onItemsPerPageChange(newItemsPerPage: number): void {
    this.itemsPerPage.set(newItemsPerPage); // Update items per page
    this.currentPage.set(1); // Reset to page 1
    if (this.classId) {
      this.loadClassDetails(this.classId); // Reload class details with new page size
    }
  }

  // Pagination methods
  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages()) {
      this.currentPage.set(pageNumber); // Set current page
      if (this.classId) {
        this.loadClassDetails(this.classId); // Reload the class details for the new page
      }
    }
  }

  goToNextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1); // Go to next page
      if (this.classId) {
        this.loadClassDetails(this.classId);
      }
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1); // Go to previous page
      if (this.classId) {
        this.loadClassDetails(this.classId);
      }
    }
  }

  goToFirstPage(): void {
    this.currentPage.set(1); // Go to the first page
    if (this.classId) {
      this.loadClassDetails(this.classId);
    }
  }

  goToLastPage(): void {
    this.currentPage.set(this.totalPages()); // Go to the last page
    if (this.classId) {
      this.loadClassDetails(this.classId);
    }
  }

  // Add student button
  onAdd(): void {
    const dialogRef = this.dialog.open(StudentAddComponent, {
      width: '650px',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.reload) {
        this.loadClassDetails(this.classId!); // Reload data if student added
      }
    });
  }

  // Navigating to student details
  goToStudentDetail(studentId: number): void {
    this.router.navigate(['/student-detail', studentId]);
  }

  // Update student information
  onUpdate(student: StudentResponse, event: Event): void {
    event.stopPropagation(); // Prevent row click event

    const dialogRef = this.dialog.open(StudentUpdateDialogComponent, {
      width: '650px',
      data: student, // Pass the StudentResponse object to the dialog
    });

    dialogRef
      .afterClosed()
      .subscribe((updatedStudent: StudentResponse | undefined) => {
        if (updatedStudent) {
          const index = this.students.findIndex(
            (s) => s.userId === updatedStudent.userId
          );
          this.loadClassDetails(this.classId!); // Reload student data after update
        }
      });
  }

  getAvatarUrl(avatarName: string | undefined): string {
    return `/assets/images/${avatarName}`;
  }

  getExamMarkLink() {
    return this.currentUserRole === 'ROLE_ADMIN'
      ? ['/admin/exam/exam-mark-all-subject', this.classDetails.id]
      : ['/sro/exam/exam-mark-all-subject', this.classDetails.id];
  }

  // Delete student logic
  deleteStudent(studentId?: number): void {
    if (studentId && confirm('Are you sure you want to delete this student?')) {
      this.studentService.deleteStudent(studentId).subscribe({
        next: () => {
          this.toastr.success('Student deleted successfully');
          this.loadClassDetails(this.classId!); // Reload student data after deletion
        },
        error: (err) => {
          this.toastr.error('Failed to delete student');
          console.error(err);
        },
      });
    }
  }
}
