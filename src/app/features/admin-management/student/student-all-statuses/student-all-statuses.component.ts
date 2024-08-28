import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { StudentDetailDialogComponent } from '../student-detail-dialog/student-detail-dialog.component';
import { StudentAddComponent } from '../student-add/student-add.component';
import { StudentUpdateDialogComponent } from '../student-update-dialog/student-update-dialog.component';
import { StudentRequest } from '../../model/studentRequest.model';
import { AdminService } from 'src/app/core/services/admin.service';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

@Component({
  selector: 'app-student-all-statuses',
  templateUrl: './student-all-statuses.component.html',
  styleUrls: ['./student-all-statuses.component.scss']
})
export class StudentAllStatusesComponent implements OnInit, AfterViewInit {
  students: StudentRequest[] = [];
  totalStudents: number = 0;
  searchTerm: string = '';

  displayedColumns: string[] = ['avatar', 'rollNumber', 'fullName', 'className', 'email', 'phone', 'status', 'actions'];
  dataSource: MatTableDataSource<StudentRequest> = new MatTableDataSource<StudentRequest>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild('fileInput') fileInput: any;

  constructor(
    public dialog: MatDialog,
    private studentService: AdminService
  ) { }

  ngOnInit(): void {
    this.loadStudent();
  }

  getAvatarUrl(avatarName: string | undefined): string {
    return `/assets/images/${avatarName}`;
  }

  loadStudent(): void {
    this.studentService.getAllStudents().subscribe(
      (data: StudentRequest[]) => {
        this.students = data || [];
        this.dataSource.data = this.students;
        this.totalStudents = this.students.length;
      },
      (error) => {
        console.error('Error fetching students', error);
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

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  onRowClick(event: MouseEvent, student: StudentRequest): void {
    if (!(event.target as HTMLElement).closest('button')) {
      this.dialog.open(StudentDetailDialogComponent, {
        width: '650px',
        data: student
      });
    }
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(StudentAddComponent, {
      width: '550px',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.loadStudent();
      }
    });
  }

  onUpdate(event: MouseEvent, student: StudentRequest): void {
    this.dialog.open(StudentUpdateDialogComponent, {
      width: '550px',
      data: student
    });
  }

  onImport(): void {
    this.triggerFileInput();
  }

  triggerFileInput(): void {
    const fileInput: HTMLInputElement | null = this.fileInput?.nativeElement;
    if (fileInput) {
      fileInput.click();
    }
  }

  onExport(): void {
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(this.dataSource.data);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    const wbout: Uint8Array = XLSX.write(wb, { bookType: 'csv', type: 'array' });
    const blob = new Blob([wbout], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'students.csv');
  }

  onDelete(student: StudentRequest): void {
    console.log('Delete clicked:', student);
    // Implement delete logic here
  }
}
