import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, forkJoin, of } from 'rxjs';
import { AuthService } from 'src/app/core/auth/auth.service';
import { DayOfWeek } from 'src/app/core/enum/DayOfWeek';
import { ClassService } from 'src/app/core/services/admin/class.service';
import Swal from 'sweetalert2';
import { ClassResponse } from '../model/class/class-response.model';
import { PaginatedClassResponse } from '../model/class/pagination-class-response';
import { FilterDialogComponent } from './filter-dialog/filter-dialog.component';

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
  classCounts: { semester: string; count: number }[] = [];
  searchTerm: { className: string } = {
    className: '',
  };

  statusCounts = signal({ studying: 0, finished: 0, cancel: 0, scheduled: 0 });

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
    this.loadStatusCounts();
    this.loadClassCounts();
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
    const page = this.currentPage();
    const size = this.itemsPerPage();

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
  applyFilter(): void {
    const page = this.currentPage();
    const size = this.itemsPerPage();

    const queryParams: any = {};

    if (this.searchTerm.className.trim()) {
      queryParams.className = this.searchTerm.className.trim();
    }

    queryParams.page = page;
    queryParams.size = size;

    // Call the service to search classes based on the query parameters
    this.classService.searchClass(queryParams).subscribe(
      (data: PaginatedClassResponse) => {
        // Assuming the response is PaginatedClassResponse
        console.log('Data received from search API:', data);

        // Update pagination
        this.totalPages.set(data.totalPages);

        // Set the filtered classes to the response content
        this.filteredClasses.set(data.content);

        // Optionally, update paginated classes based on filter (you can modify this if needed)
        this.paginatedClasses.set(data.content);
      },
      (error) => {
        console.error('Error during search:', error);
        this.toastr.error('Error occurred while searching classes');
      }
    );
  }

  loadClassCounts(): void {
    this.classService.getClassCountBySemester().subscribe(
      (data) => {
        // Convert the object to an array
        this.classCounts = Object.keys(data).map((key) => ({
          semester: key, // The semester name (Sem1, Sem2, ...)
          count: data[key], // The count for that semester
        }));
        console.log(this.classCounts); // For debugging
      },
      (error) => {
        this.toastr.error('Failed to load class counts by semester.', 'Error');
      }
    );
  }
  getBgColor(semester: string): string {
    switch (semester) {
      case 'Sem1':
        return 'bg-green-100'; // Green color for SEM1
      case 'Sem2':
        return 'bg-yellow-100'; // Yellow color for SEM2
      case 'Sem3':
        return 'bg-yellow-200'; // Light Yellow for SEM3
      case 'Sem4':
        return 'bg-cyan-100'; // Cyan color for SEM4
      default:
        return 'bg-gray-100'; // Default color if no match
    }
  }

  loadStatusCounts(): void {
    const page = this.currentPage();
    const size = this.itemsPerPage();

    this.classService.getClassByStatus('STUDYING', page, size).subscribe(
      (data: ClassResponse) => {
        this.statusCounts.set({
          ...this.statusCounts(),
          studying: data.totalElements,
        });
      },
      (error) => {
        console.error('Error fetching STUDYING count:', error);
        this.toastr.error('Failed to load STUDYING students');
      }
    );

    this.classService.getClassByStatus('DELAY', page, size).subscribe(
      (data: ClassResponse) => {
        this.statusCounts.set({
          ...this.statusCounts(),
          finished: data.totalElements,
        });
      },
      (error) => {
        console.error('Error fetching DELAY count:', error);
        this.toastr.error('Failed to load DELAY students');
      }
    );

    this.classService.getClassByStatus('DROPPED', page, size).subscribe(
      (data: ClassResponse) => {
        this.statusCounts.set({
          ...this.statusCounts(),
          cancel: data.totalElements,
        });
      },
      (error) => {
        console.error('Error fetching DROPPED count:', error);
        this.toastr.error('Failed to load DROPPED students');
      }
    );

    this.classService.getClassByStatus('GRADUATED', page, size).subscribe(
      (data: ClassResponse) => {
        this.statusCounts.set({
          ...this.statusCounts(),
          scheduled: data.totalElements,
        });
      },
      (error) => {
        console.error('Error fetching GRADUATED count:', error);
        this.toastr.error('Failed to load GRADUATED students');
      }
    );
  }

  updateStatusCounts(): void {
    const page = this.currentPage();
    const size = this.itemsPerPage();

    // Initialize the counts for status
    const counts = { studying: 0, finished: 0, cancel: 0, scheduled: 0 };

    const fetchStatusCount = (status: string) => {
      return this.classService.getClassByStatus(status, page, size).pipe(
        catchError((error) => {
          console.error(`Error fetching ${status} count:`, error);
          this.toastr.error(`Failed to load ${status} students`);
          return of({ totalElements: 0 });
        })
      );
    };

    forkJoin([
      fetchStatusCount('STUDYING'),
      fetchStatusCount('FINISHED'),
      fetchStatusCount('CANCEL'),
      fetchStatusCount('SCHEDULED'),
    ]).subscribe(
      ([studyingData, finishedData, cancelData, scheduledData]) => {
        counts.studying = studyingData.totalElements;
        counts.finished = finishedData.totalElements;
        counts.cancel = cancelData.totalElements;
        counts.scheduled = scheduledData.totalElements;

        this.statusCounts.set(counts);
      },
      (error) => {
        console.error('Error fetching status counts:', error);
        this.toastr.error('Failed to load class counts');
      }
    );
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
            this.loadClasses();
            this.loadStatusCounts();
            Swal.fire('Deleted!', 'Class has been deleted.', 'success');
          },
          error: (error) => {
            console.error('Error details:', error.message);
            Swal.fire('Error!', 'Failed to delete class because the class has students ....', 'error');
          },
        });
      }
    });
  }
}
