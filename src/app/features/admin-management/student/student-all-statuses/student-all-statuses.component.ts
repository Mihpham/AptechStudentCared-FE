import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { StudentDetailDialogComponent } from '../student-detail-dialog/student-detail-dialog.component';
import { MatDialog } from '@angular/material/dialog';

// Import the Student interface
import { Student } from '../model/student.model';

@Component({
  selector: 'app-student-all-statuses',
  templateUrl: './student-all-statuses.component.html',
  styleUrls: ['./student-all-statuses.component.scss']
})
export class StudentAllStatusesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['avatar', 'rollNumber', 'fullName', 'class', 'email', 'phoneNumber', 'status', 'actions'];
  dataSource: MatTableDataSource<Student> = new MatTableDataSource<Student>();

  @ViewChild(MatPaginator) paginator!: MatPaginator; // Use non-null assertion operator

  // Sample data
  students: Student[] = [
    { avatar: 'https://i.pravatar.cc/150?img=1', rollNumber: 'S12345', fullName: 'John Doe', class: '10A', gender: 'male', email: 'john.doe@example.com', phoneNumber: '123-456-7890', status: 'Studying',guardian: {
      fullName: 'Jane Doe',
      gender: 'Female',
      phoneNumber: '123-456-7891',
      relationship: 'Mother'
    } },
    { avatar: 'https://i.pravatar.cc/150?img=1', rollNumber: 'S12345', fullName: 'John Doe', class: '10A', gender: 'male', email: 'john.doe@example.com', phoneNumber: '123-456-7890', status: 'Studying',guardian: {
      fullName: 'Jane Doe',
      gender: 'Female',
      phoneNumber: '123-456-7891',
      relationship: 'Mother'
    } },
    { avatar: 'https://i.pravatar.cc/150?img=1', rollNumber: 'S12345', fullName: 'John Doe', class: '10A', gender: 'male', email: 'john.doe@example.com', phoneNumber: '123-456-7890', status: 'Dropout',guardian: {
      fullName: 'Jane Doe',
      gender: 'Female',
      phoneNumber: '123-456-7891',
      relationship: 'Mother'
    } },
    { avatar: 'https://i.pravatar.cc/150?img=1', rollNumber: 'S12345', fullName: 'John Doe', class: '10A', gender: 'male', email: 'john.doe@example.com', phoneNumber: '123-456-7890', status: 'Graduated',guardian: {
      fullName: 'Jane Doe',
      gender: 'Female',
      phoneNumber: '123-456-7891',
      relationship: 'Mother'
    } },
    { avatar: 'https://i.pravatar.cc/150?img=1', rollNumber: 'S12345', fullName: 'John Doe', class: '10A', gender: 'male', email: 'john.doe@example.com', phoneNumber: '123-456-7890', status: 'Delay',guardian: {
      fullName: 'Jane Doe',
      gender: 'Female',
      phoneNumber: '123-456-7891',
      relationship: 'Mother'
    } },
    { avatar: 'https://i.pravatar.cc/150?img=1', rollNumber: 'S12345', fullName: 'John Doe', class: '10A', gender: 'male', email: 'john.doe@example.com', phoneNumber: '123-456-7890', status: 'Studying',guardian: {
      fullName: 'Jane Doe',
      gender: 'Female',
      phoneNumber: '123-456-7891',
      relationship: 'Mother'
    } },
    { avatar: 'https://i.pravatar.cc/150?img=1', rollNumber: 'S12345', fullName: 'John Doe', class: '10A', gender: 'male', email: 'john.doe@example.com', phoneNumber: '123-456-7890', status: 'Delay',guardian: {
      fullName: 'Jane Doe',
      gender: 'Female',
      phoneNumber: '123-456-7891',
      relationship: 'Mother'
    } },
    { avatar: 'https://i.pravatar.cc/150?img=1', rollNumber: 'S12345', fullName: 'John Doe', class: '10A', gender: 'male', email: 'john.doe@example.com', phoneNumber: '123-456-7890', status: 'Studying',guardian: {
      fullName: 'Jane Doe',
      gender: 'Female',
      phoneNumber: '123-456-7891',
      relationship: 'Mother'
    } }
  ];
  constructor(public dialog: MatDialog) { }
  ngOnInit(): void {
    this.dataSource.data = this.students;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  onRowClick(student: Student): void {
    this.dialog.open(StudentDetailDialogComponent, {
      width: '550px',
      data: student
    });
  }

  onEdit(student: Student): void {
    console.log('Edit clicked:', student);
    // Navigate to edit page or open edit dialog
  }

  onDelete(student: Student): void {
    console.log('Delete clicked:', student);
    // Confirm and delete the student
  }
}
