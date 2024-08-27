// src/app/features/admin-management/student/student-all-statuses/student-all-statuses.component.ts

import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { Student } from '../model/student.model';
import { StudentAddDialogComponent } from '../student-add-dialog/student-add-dialog.component';
import { StudentUpdateDialogComponent } from '../student-update-dialog/student-update-dialog.component';
import { StudentDetailDialogComponent } from '../student-detail-dialog/student-detail-dialog.component';

@Component({
  selector: 'app-student-all-statuses',
  templateUrl: './student-all-statuses.component.html',
  styleUrls: ['./student-all-statuses.component.scss']
})
export class StudentAllStatusesComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['avatar', 'rollNumber', 'fullName', 'class', 'email', 'phoneNumber', 'status', 'actions'];
  dataSource: MatTableDataSource<Student> = new MatTableDataSource<Student>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  students: Student[] = [
    // Sample data
    { avatar: 'https://i.pravatar.cc/150?img=1', rollNumber: 'S12345', fullName: 'John Doe', class: '10A', gender: 'Male', email: 'john.doe@example.com', phoneNumber: '123-456-7890', course: 'Math', address: 'Hanoi', status: 'Studying', guardian: {
      fullName: 'Jane Doe',
      gender: 'Female',
      phoneNumber: '123-456-7891',
      relationship: 'Mother'
    } },
  ];

  constructor(public dialog: MatDialog) { }

  ngOnInit(): void {
    this.dataSource.data = this.students;
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  openAddStudentDialog(): void {
    const dialogRef = this.dialog.open(StudentAddDialogComponent, {
      width: '600px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.students.push(result);
        this.dataSource.data = this.students;
      }
    });
  }

  onRowClick(event: MouseEvent, student: Student): void {
    // Check if the click event is not triggered by an action button
    if (!(event.target as HTMLElement).closest('button')) {
      this.dialog.open(StudentDetailDialogComponent, {
        width: '550px',
        data: student
      });
    }
  }

  onEdit(event: MouseEvent, student: Student): void {
    event.stopPropagation(); // Prevent triggering onRowClick
    const dialogRef = this.dialog.open(StudentUpdateDialogComponent, {
      width: '600px',
      data: student
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Update the student information in the array
        const index = this.students.findIndex(s => s.rollNumber === result.rollNumber);
        if (index > -1) {
          this.students[index] = result;
          this.dataSource.data = [...this.students]; // Refresh the dataSource
        }
      }
    });
  }

  onDelete(student: Student): void {
    console.log('Delete clicked:', student);
    // Confirm and delete the student
  }
}
