import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { Class } from '../model/class.model';
import { AdminService } from 'src/app/core/services/admin.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {
  classes: WritableSignal<Class[]> = signal([]); // Initialize as writable signal
  paginatedClasses: WritableSignal<Class[]> = signal([]); // Classes for the current page
  statusCounts = signal({ studying: 0, finished: 0, cancel: 0, scheduled: 0 });

  // Pagination variables
  currentPage = signal(1);
  itemsPerPage = signal(5); // Default items per page is 5
  totalPages = signal(0);

  constructor(
    private classService: AdminService,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadClasses(); 
  }

  loadClasses(): void {
    this.classService.findAllClasses().subscribe({
      next: (data) => {
        this.classes.set(data); // Update the writable signal with new data
        this.updateStatusCounts();
        this.updatePagination();
      },
      error: (error) => {
        this.toastr.error('Failed to load classes!', 'Error');
        console.error('Load classes failed', error);
      }
    });
  }

  updateStatusCounts(): void {
    const currentClasses = this.classes();
    const counts = { studying: 0, finished: 0, cancel: 0, scheduled: 0 };

    currentClasses.forEach(classItem => {
      if (classItem.status === 'STUDYING') counts.studying++;
      if (classItem.status === 'FINISHED') counts.finished++;
      if (classItem.status === 'CANCEL') counts.cancel++;
      if (classItem.status === 'SCHEDULED') counts.scheduled++;
    });

    this.statusCounts.set(counts);
  }

  updatePagination(): void {
    const classes = this.classes();
    const startIndex = (this.currentPage() - 1) * this.itemsPerPage();
    const endIndex = startIndex + this.itemsPerPage();
    this.paginatedClasses.set(classes.slice(startIndex, endIndex));
    this.totalPages.set(Math.ceil(classes.length / this.itemsPerPage()));
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
    if (confirm('Are you sure you want to delete this class?')) {
      this.classService.deleteClass(id).subscribe({
        next: (response) => {
          const updatedClasses = this.classes().filter(classItem => classItem.id !== id);
          this.classes.set(updatedClasses);
          this.updateStatusCounts(); 
          this.updatePagination();
          this.toastr.success('Class deleted successfully!', 'Success');
        },
        error: (error) => {
          console.error('Error details:', error.message);
          console.log('Error object:', error);
          this.toastr.error('Failed to delete class!', 'Error');
        }
      });
    }
  }
}
