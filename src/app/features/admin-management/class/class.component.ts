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
  statusCounts = signal({ studying: 0, finished: 0, cancel: 0, scheduled: 0 });
  paginatedClasses: WritableSignal<Class[]> = signal([]); // Classes for the current page
  currentPage = 1;
  itemsPerPage = 5;
  totalPages = 1;
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
        this.updateStatusCounts(); // Call this after data is set
      },
      error: (error) => {
        this.toastr.error('Failed to load classes!', 'Error');
        console.error('Load classes failed', error);
      }
    });
  }

  calculatePagination(): void {
    const totalClasses = this.classes().length;
    this.totalPages = Math.ceil(totalClasses / this.itemsPerPage);
    this.updatePaginatedClasses();
  }

  updatePaginatedClasses(): void {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedClasses.set(this.classes().slice(startIndex, endIndex));
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedClasses();
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedClasses();
    }
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

  deleteClass(id: number): void {
    if (confirm('Are you sure you want to delete this class?')) {
      this.classService.deleteClass(id).subscribe({
        next: (response) => {
          console.log('Response:', response); // Log response for debugging
          const updatedClasses = this.classes().filter(classItem => classItem.id !== id);
          this.classes.set(updatedClasses);
          this.updateStatusCounts(); 
          this.toastr.success('Class deleted successfully!', 'Success');
        },
        error: (error) => {
          console.error('Error details:', error.message);
          console.log('Error object:', error); // Log the full error object for debugging
          this.toastr.error('Failed to delete class!', 'Error');
        }
      });
    }
  }
}
