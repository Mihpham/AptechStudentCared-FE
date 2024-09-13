import { Component } from '@angular/core';
import { StudentResponse } from '../../model/student-response.model.';
import { StudentService } from 'src/app/core/services/admin/student.service';

@Component({
  selector: 'app-dropout',
  templateUrl: './dropout.component.html',
  styleUrls: ['./dropout.component.scss']
})
export class DropoutComponent {
  students: StudentResponse[] = [];
  filteredStudents: StudentResponse[] = [];
  selectedStatus: string = 'DROPPED'; // Default status
  page: number = 1; // Current page number
  pageSize: number = 5; // Default page size (number of items per page)
  totalItems: number = 0; // Total number of items for pagination
  totalStudents: number = 0;

  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.getStudentsByStatus(this.selectedStatus);
  }

  // Fetch students by their status
  getStudentsByStatus(status: string): void {
    this.studentService.getStudentsByStatus(status).subscribe(
      (data: StudentResponse[]) => {
        this.students = data;
        this.totalStudents = this.students.length;
        this.filteredStudents = data;
        this.totalItems = this.filteredStudents.length; // Update total number of items
      },
      (error) => {
        console.error('Error fetching students by status', error);
      }
    );
  }

  // Change the page size (items per page)
  onPageSizeChange(newPageSize: number): void {
    this.pageSize = newPageSize;
    this.page = 1; // Reset to the first page when page size changes
  }

  // Handle filtering by keyword
  onFilterChange(event: any): void {
    const keyword = event.target.value.toLowerCase();
    this.filteredStudents = this.students.filter(student =>
      student.fullName.toLowerCase().includes(keyword) ||
      student.email.toLowerCase().includes(keyword)||
      student.rollNumber.toLowerCase().includes(keyword)||
      student.className.toLowerCase().includes(keyword)

    );
    this.totalItems = this.filteredStudents.length; // Update the total number of items after filtering
  }

  
  // Navigate to the first page
  goToFirstPage(): void {
    this.page = 1;
  }

  // Navigate to the previous page
  goToPreviousPage(): void {
    if (this.page > 1) {
      this.page--;
    }
  }

  // Navigate to the next page
  goToNextPage(): void {
    if (this.page < this.totalPages()) {
      this.page++;
    }
  }

  // Navigate to the last page
  goToLastPage(): void {
    this.page = this.totalPages();
  }

  // Calculate the total number of pages
  totalPages(): number {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  // Get the current page
  currentPage(): number {
    return this.page;
  }

  // Export the filtered student data to CSV
  exportToCSV(): void {
    const csvData = this.filteredStudents.map(student => ({
      'Roll Number': student.rollNumber,
      'Full Name': student.fullName,
      'Email': student.email,
      'Class': student.className,
      'Course': student.courses,
      'Status': student.status
    }));

    // Convert to CSV format
    const csvContent = "data:text/csv;charset=utf-8,"
      + csvData.map(e => Object.values(e).join(",")).join("\n");

    // Create a download link for the CSV file
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "students.csv");
    document.body.appendChild(link); // Required for Firefox
    link.click();
    document.body.removeChild(link); // Cleanup
  }
}
