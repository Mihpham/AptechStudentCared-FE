import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';
import Swal from 'sweetalert2';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { ClassRequest } from '../model/class/class-request.model';
import { ClassResponse } from '../model/class/class-response.model';
import { DayOfWeek } from 'src/app/core/enum/DayOfWeek';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss'],
})
export class ClassComponent implements OnInit {
  classes: WritableSignal<ClassResponse[]> = signal([]);
  paginatedClasses: WritableSignal<ClassResponse[]> = signal([]);
  filteredClasses: WritableSignal<ClassResponse[]> = signal([]);
  isActive: WritableSignal<boolean> = signal(false);
  currentUserRole!: string | null;

  statusCounts = signal({ studying: 0, finished: 0, cancel: 0, scheduled: 0 });
  semesterCounts = signal({ Sem1: 0, Sem2: 0, Sem3: 0, Sem4: 0 });

  currentPage = signal(1);
  itemsPerPage = signal(10); 
  totalPages = signal(0);

  constructor(
    private classService: ClassService,
    private authService: AuthService,
    private toastr: ToastrService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.currentUserRole = this.authService.getRole();
    this.loadClasses();
  }

  getDaysAsNumbers(days: DayOfWeek[]): string {
    const dayMap: { [key in DayOfWeek]: number } = {
      [DayOfWeek.MONDAY]: 2,
      [DayOfWeek.TUESDAY]: 3,
      [DayOfWeek.WEDNESDAY]: 4,
      [DayOfWeek.THURSDAY]: 5,
      [DayOfWeek.FRIDAY]: 6,
      [DayOfWeek.SATURDAY]: 7,
      [DayOfWeek.SUNDAY]: 8,
    };
    return days.map((day) => dayMap[day]).join(', ');
  }

  loadClasses(): void {
    const page = this.currentPage() - 1;
    const size = this.itemsPerPage();
  
    console.log('Requesting page:', page + 1, 'with size:', size);
  
    this.classService.findAllClasses(page, size).subscribe({
      next: (data) => {
        console.log('API response:', data);
  
        this.classes.set(data.content);
        this.paginatedClasses.set(data.content);
  
        this.totalPages.set(data.totalPages);
  
        this.updateStatusCounts();
      },
      error: (error) => {
        this.toastr.error('Failed to load classes!', 'Error');
        console.error('Load classes failed', error);
      },
    });
  }
  
  applyFilters(filters?: {
    className: string;
    admissionDate: string;
    status: string;
  }): void {
    const classNameFilter = filters?.className || '';
    const admissionDateFilter = filters?.admissionDate || '';
    const statusFilter = filters?.status || 'ALL';

    const filtered = this.classes().filter((classItem) => {
      const matchesClassName = classNameFilter
        ? classItem.className
            .toLowerCase()
            .includes(classNameFilter.toLowerCase())
        : true;

      const matchesStatus =
        statusFilter !== 'ALL' ? classItem.status === statusFilter : true;

      return matchesClassName && matchesStatus;
    });

    console.log('Filtered classes:', filtered);
    this.filteredClasses.set(filtered);
  }

  updateStatusCounts(): void {
    const currentClasses = this.classes();
    const counts = { studying: 0, finished: 0, cancel: 0, scheduled: 0 };
    const semesterCounts = { Sem1: 0, Sem2: 0, Sem3: 0, Sem4: 0 };

    currentClasses.forEach((classItem) => {
      if (classItem.status === 'STUDYING') counts.studying++;
      if (classItem.status === 'FINISHED') counts.finished++;
      if (classItem.status === 'CANCEL') counts.cancel++;
      if (classItem.status === 'SCHEDULED') counts.scheduled++;

      // Cập nhật số lớp học cho từng học kỳ
      semesterCounts[classItem.sem as keyof typeof semesterCounts] =
        (semesterCounts[classItem.sem as keyof typeof semesterCounts] || 0) + 1;
    });

    // Cập nhật số liệu trạng thái và học kỳ
    this.statusCounts.set(counts);
    this.semesterCounts.set(semesterCounts);
  }

  onItemsPerPageChange(newItemsPerPage: number): void {
    this.itemsPerPage.set(newItemsPerPage); 
    this.currentPage.set(1); 
    this.loadClasses(); 
  }

  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages()) {
      this.currentPage.set(pageNumber);
      this.loadClasses(); 
    }
  }

  goToNextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      this.loadClasses(); 
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.loadClasses(); 
    }
  }

  goToFirstPage(): void {
    this.currentPage.set(1);
    this.loadClasses(); 
  }

  goToLastPage(): void {
    this.currentPage.set(this.totalPages());
    this.loadClasses(); 
  }

  openFilterDialog(): void {
    const dialogRef = this.dialog.open(FilterDialogComponent);

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log(result);
        this.applyFilters(result); 
      }
    });
  }

  deleteClass(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: "You won't be able to revert this!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.classService.deleteClass(id).subscribe({
          next: () => {
            const updatedClasses = this.classes().filter(
              (classItem) => classItem.id !== id
            );
            this.classes.set(updatedClasses);
            this.applyFilters(); 
            this.updateStatusCounts();
            Swal.fire('Deleted!', 'Class has been deleted.', 'success');
          },
          error: (error) => {
            console.error('Error details:', error.message);
            Swal.fire('Error!', 'Failed to delete class.', 'error');
          },
        });
      }
    });
  }
}
