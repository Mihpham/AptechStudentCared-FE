import { Component, signal } from '@angular/core';
import { StudentResponse } from '../../model/student-response.model.';
import { StudentService } from 'src/app/core/services/admin/student.service';
import { PaginatedStudentResponse } from '../../model/pagination-response';

@Component({
  selector: 'app-graduated',
  templateUrl: './graduated.component.html',
  styleUrls: ['./graduated.component.scss']
})
export class GraduatedComponent {
  students: StudentResponse[] = [];
  filteredStudents: StudentResponse[] = [];
  selectedStatus: string = 'GRADUATED'; // Default status
  totalStudents: number = 0;
  currentPage = signal(1);
  itemsPerPage = signal(10);
  totalPages = signal(0);
  totalItems = signal(0);


  constructor(private studentService: StudentService) { }

  ngOnInit(): void {
    this.getStudentsByStatus(this.selectedStatus, this.currentPage(), this.itemsPerPage());
  }

  getStudentsByStatus(status: string, pageIndex: number, pageSize: number): void {
    this.studentService.getStudentsByStatus(status, pageIndex, pageSize).subscribe(
      (data: PaginatedStudentResponse) => {
        this.students = data.content; 
        this.filteredStudents = this.students; 
        this.totalStudents=data.totalElements;
        this.totalItems.set(data.totalElements); 
        this.totalPages.set(data.totalPages); 
      },
      (error) => {
        console.error('Error fetching students by status', error);
      }
    );
  }

   onItemsPerPageChange(newItemsPerPage: number): void {
    this.itemsPerPage.set(newItemsPerPage);
    this.currentPage.set(1); // Reset to first page on page size change
    this.getStudentsByStatus(this.selectedStatus, this.currentPage(), this.itemsPerPage());
  }

  onFilterChange(event: any): void {
    const keyword = event.target.value.toLowerCase();
    this.filteredStudents = this.students.filter(student =>
      student.fullName.toLowerCase().includes(keyword) ||
      student.email.toLowerCase().includes(keyword) ||
      student.rollNumber.toLowerCase().includes(keyword) ||
      student.className.toLowerCase().includes(keyword)
    );
    this.totalItems.set(this.filteredStudents.length); // Update total items after filtering
  }

  // Navigate to the selected page
  goToPage(pageNumber: number): void {
    if (pageNumber >= 1 && pageNumber <= this.totalPages()) {
      this.currentPage.set(pageNumber);
      this.getStudentsByStatus(this.selectedStatus, this.currentPage(), this.itemsPerPage());
    }
  }

  // Navigate to the next page
  goToNextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
      this.getStudentsByStatus(this.selectedStatus, this.currentPage(), this.itemsPerPage());
    }
  }

  // Navigate to the previous page
  goToPreviousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
      this.getStudentsByStatus(this.selectedStatus, this.currentPage(), this.itemsPerPage());
    }
  }

  // Navigate to the first page
  goToFirstPage(): void {
    this.currentPage.set(1);
    this.getStudentsByStatus(this.selectedStatus, this.currentPage(), this.itemsPerPage());
  }

  // Navigate to the last page
  goToLastPage(): void {
    this.currentPage.set(this.totalPages());
    this.getStudentsByStatus(this.selectedStatus, this.currentPage(), this.itemsPerPage());
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
