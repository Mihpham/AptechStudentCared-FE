// src/app/features/admin-management/student/student-all-statuses/student-all-statuses.component.ts

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { StudentDetailDialogComponent } from '../student-detail-dialog/student-detail-dialog.component';
import { StudentAddComponent } from '../student-add/student-add.component';
import { StudentRequest } from '../../model/studentRequest.model';
import { AdminService } from 'src/app/core/services/admin.service';
import { StudentUpdateDialogComponent } from '../student-update-dialog/student-update-dialog.component';

@Component({
  selector: 'app-student-all-statuses',
  templateUrl: './student-all-statuses.component.html',
  styleUrls: ['./student-all-statuses.component.scss']
})
export class StudentAllStatusesComponent implements OnInit, AfterViewInit {

  students: StudentRequest[] = []; // Array to hold student data
  totalStudents: number = 0;
  searchTerm: string = '';

  displayedColumns: string[] = ['rollNumber', 'fullName', 'className', 'email', 'phone', 'status', 'actions'];
  dataSource: MatTableDataSource<StudentRequest> = new MatTableDataSource<StudentRequest>();

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Paginator for the table

  constructor(
    public dialog: MatDialog, // MatDialog service for opening dialogs
    private studentService: AdminService // AdminService for student operations
  ) { }

  ngOnInit(): void {
    this.loadStudent(); // Load student data when the component initializes
  }

  // Load all students from the service
  loadStudent(): void {
    this.studentService.getAllStudents().subscribe(
      (data: StudentRequest[]) => {
        this.students = data || [];
        this.dataSource.data = this.students;
        this.totalStudents = this.students.length; // Tính tổng số học sinh

      },
      (error) => {
        console.error('Error fetching students', error); // Log errors if fetching fails
      }
    );
  }

  applyFilter(filterValue: string): void {
    this.dataSource.filterPredicate = (data: StudentRequest, filter: string) => {
      const filterLowerCase = filter.toLowerCase();
      return data.fullName.toLowerCase().includes(filterLowerCase) ||
        data.className.toLowerCase().includes(filterLowerCase) ||
        data.email.toLowerCase().includes(filterLowerCase);
    };

    this.dataSource.filter = filterValue.trim().toLowerCase();
    this.totalStudents = this.dataSource.filteredData.length; // Update totalStudents based on filtered data

    // For debugging: Log data source lengths
    console.log('Filtered Data Length:', this.dataSource.filteredData.length);
    console.log('Total Students Length:', this.dataSource.data.length);
  }



  // Set the paginator for the table after the view initializes
  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  // Open the student detail dialog when a row is clicked
  onRowClick(event: MouseEvent, student: StudentRequest): void {
    // Check if the click event is not triggered by an action button
    if (!(event.target as HTMLElement).closest('button')) {
      this.dialog.open(StudentDetailDialogComponent, {
        width: '550px',
        data: student
      });
    }
  }

  // Open the add/edit student dialog
  onAdd(): void {
    const dialogRef = this.dialog.open(StudentAddComponent, {
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStudent(); // Refresh the list after a student is added or edited
      }
    });
  }
  onUpdate(event: MouseEvent, student: StudentRequest): void {
    this.dialog.open(StudentUpdateDialogComponent, {
      width: '550px',
      data: student // Pass the selected student data to the dialog
    });
  }
  // Placeholder method for importing students
  onImport(): void {
    console.log('Import clicked');
    // Implement import logic here
  }

  // Placeholder method for exporting students
  onExport(): void {
    console.log('Export clicked');
    // Implement export logic here
  }

  // Delete a student
  onDelete(student: StudentRequest): void {
    console.log('Delete clicked:', student);
    // Implement delete logic here
    // Example: Confirm deletion, call the service to delete the student, and refresh the list
  }
}
