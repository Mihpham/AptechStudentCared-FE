import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import Swal from 'sweetalert2';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { ClassRequest } from '../model/class/class-request.model';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {
  classes: WritableSignal<ClassRequest[]> = signal([]);
  paginatedClasses: WritableSignal<ClassRequest[]> = signal([]);
  filteredClasses: WritableSignal<ClassRequest[]> = signal([]);

  statusCounts = signal({ studying: 0, finished: 0, cancel: 0, scheduled: 0 });

  currentPage = signal(1);
  itemsPerPage = signal(5);
  totalPages = signal(0);

  constructor(
    private classService: ClassService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.classService.findAllClasses().subscribe({
      next: (data) => {
        this.classes.set(data);
        this.applyFilters(); 
        this.updateStatusCounts();
      },
      error: (error) => {
        this.toastr.error('Failed to load classes!', 'Error');
        console.error('Load classes failed', error);
      }
    });
  }

  onRowClick(event: Event, classItem: any): void {
    event.stopPropagation(); // Ngăn chặn sự kiện click không bị lan ra ngoài
    this.router.navigate(['/admin/student/all'], { queryParams: { className: classItem.className } });
  }

  openFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent);

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        console.log(result);
        this.applyFilters(result);
      }
    });
  }

  applyFilters(filters?: { className: string, admissionDate: string, status: string }): void {
    const classNameFilter = filters?.className || '';
    const admissionDateFilter = filters?.admissionDate || '';
    const statusFilter = filters?.status || 'ALL';

    const filtered = this.classes().filter(classItem => {
      const matchesClassName = classNameFilter
        ? classItem.className.toLowerCase().includes(classNameFilter.toLowerCase())
        : true;
      console.log('Matches class name:', matchesClassName);
    
      const matchesStatus = statusFilter !== 'ALL'
        ? classItem.status === statusFilter
        : true;
      console.log('Matches status:', matchesStatus);
    
      return matchesClassName && matchesStatus;
    });
    
    console.log('Filtered classes:', filtered); // Kiểm tra danh sách lớp đã lọc
    this.filteredClasses.set(filtered);
    this.updatePagination(); // Cập nhật phân trang sau khi lọc
  }

  updateStatusCounts(): void {
    const currentClasses = this.filteredClasses();
    const counts = { studying: 0, finished: 0, cancel: 0, scheduled: 0 };

    currentClasses.forEach(classItem => {
      if (classItem.status === 'STUDYING') counts.studying++;
      if (classItem.status === 'FINISHED') counts.finished++;
      if (classItem.status === 'CANCEL') counts.cancel++;
      if (classItem.status === 'SCHEDULED') counts.scheduled++;
    });

    this.statusCounts.set(counts);
  }

  goToStudentDetail(studentId: number): void {
    if (!studentId) {
      console.error('Invalid student ID');
      return;
    }
    this.router.navigate(['/student-detail', studentId]);
  }
  

  updatePagination(): void {
    const classes = this.filteredClasses();
    
    // Fix signal access by calling it like a function
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    
    // Update the paginated classes
    this.paginatedClasses.set(classes.slice(startIndex, endIndex));
    
    // Update total pages
    this.totalPages.set(Math.ceil(classes.length / this.itemsPerPage()));
  }
  
  onItemsPerPageChange(value: number): void {
    this.itemsPerPage.set(value);
    this.updatePagination();
  }
  

  goToFirstPage(): void {
    this.currentPage.set(1);
    this.updatePagination();
  }

  goToPreviousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.updatePagination();
    }
  }

  goToNextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      this.updatePagination();
    }
  }

  goToLastPage(): void {
    this.currentPage.set(this.totalPages());
    this.updatePagination();
  }

  deleteClass(id: number): void {
    // Show confirmation dialog with SweetAlert2
    Swal.fire({
      title: 'Are you sure?',
      text: 'You won\'t be able to revert this!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!'
    }).then((result) => {
      if (result.isConfirmed) {
        // Proceed with deletion
        this.classService.deleteClass(id).subscribe({
          next: () => {
            // Update the list of classes by filtering out the deleted class
            const updatedClasses = this.classes().filter(classItem => classItem.id !== id);
            this.classes.set(updatedClasses);
  
            // Apply any filters that might be set
            this.applyFilters();
  
            // Update status counts if applicable
            this.updateStatusCounts();
  
            // Show success message with SweetAlert2
            Swal.fire(
              'Deleted!',
              'Class has been deleted.',
              'success'
            );
          },
          error: (error) => {
            // Log error details and show error message with SweetAlert2
            console.error('Error details:', error.message);
            Swal.fire(
              'Error!',
              'Failed to delete class.',
              'error'
            );
          }
        });
      }
    });
  }
  
}
