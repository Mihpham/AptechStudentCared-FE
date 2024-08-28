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
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

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
  @ViewChild('fileInput') fileInput: any;

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

  // src/app/features/admin-management/student/student-all-statuses/student-all-statuses.component.ts
  triggerFileInput(): void {
    console.log('Triggering file input');
    const fileInput: HTMLInputElement | null = this.fileInput?.nativeElement;
    if (fileInput) {
      fileInput.click();
    }
  }
  
  onFileChange(event: Event): void {
    console.log('File input changed');
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      console.log('File selected:', input.files[0].name);
      const file = input.files[0];
      const reader = new FileReader();
      
      reader.onload = (e: ProgressEvent<FileReader>) => {
        if (e.target && e.target.result) {
          console.log('File loaded');
          const binaryStr = e.target.result as string;
          const wb = XLSX.read(binaryStr, { type: 'binary' });
          const ws = wb.Sheets[wb.SheetNames[0]];
          const data = XLSX.utils.sheet_to_json(ws, { header: 1 });
          console.log('Data read from file:', data);
          this.processImportedData(data);
        }
      };
  
      reader.readAsBinaryString(file);
    }
  }
  

  processImportedData(data: any[]): void {
    // Skip the header row
    const rows = data.slice(1);
  
    // Map CSV rows to StudentRequest objects
    const students: StudentRequest[] = rows.map(row => ({
      avatar: row[0] || '',
      rollNumber: row[1] || '',
      fullName: row[2] || '',
      password: row[3] || '', // Assuming you need to add default value
      gender: row[4] || '', // Assuming you need to add default value
      className: row[5] || '',
      dob: row[6] || '', // Assuming you need to add default value
      phoneNumber: row[7] || '',
      email: row[8] || '',
      address: row[9] || '',
      courses: new Set<string>((row[9] || '').split(',').map((course: string) => course.trim())), // Explicitly type `course` as `string`
      status: (row[10] || '').toString(), // Ensure status is a string
      parentFullName: row[11] || '',
      studentRelation: row[12] || '',
      parentPhone: row[13] || '',
      parentGender: row[14] || ''
    }));
  
    // Update the dataSource with the new students
    this.dataSource.data = students;
  }
  
  







  // Placeholder method for exporting students
  onExport(): void {
    // Create a worksheet from the data
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);

    // Create a new workbook and append the worksheet
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');

    // Generate a CSV file
    const wbout: Uint8Array = XLSX.write(wb, { bookType: 'csv', type: 'array' });

    // Create a Blob from the CSV data and save it
    const blob = new Blob([wbout], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'students.csv');
  }


  // Delete a student
  onDelete(student: StudentRequest): void {
    console.log('Delete clicked:', student);
    // Implement delete logic here
    // Example: Confirm deletion, call the service to delete the student, and refresh the list
  }
}
