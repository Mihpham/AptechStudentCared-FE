import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { SubjectAddComponent } from '../subject-add/subject-add.component';
import { MatDialog } from '@angular/material/dialog'; // Import MatDialog
import { SubjectUpdateComponent } from '../subject-update/subject-update.component';

interface Subject {
  subjectName: string;
  subjectCode: string;
  subjectHour: number;
  id: string;
}

@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.scss']
})
export class SubjectListComponent implements OnInit {
  displayedColumns: string[] = ['subjectName', 'subjectCode', 'subjectHour', 'actions'];
  dataSource: MatTableDataSource<Subject> = new MatTableDataSource<Subject>([]); // Khởi tạo với mảng rỗng
  totalSubjects: number = 0;
  searchTerm: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  // Dữ liệu cố định
  private subjects: Subject[] = [
    { id: '1', subjectName: 'Mathematics', subjectCode: 'MATH101', subjectHour: 60 },
    { id: '2', subjectName: 'Physics', subjectCode: 'PHYS101', subjectHour: 45 },
    { id: '3', subjectName: 'Chemistry', subjectCode: 'CHEM101', subjectHour: 50 },
    { id: '4', subjectName: 'Biology', subjectCode: 'BIOL101', subjectHour: 55 },
    { id: '5', subjectName: 'History', subjectCode: 'HIST101', subjectHour: 40 },
    { id: '1', subjectName: 'Mathematics', subjectCode: 'MATH101', subjectHour: 60 },
    { id: '2', subjectName: 'Physics', subjectCode: 'PHYS101', subjectHour: 45 },
    { id: '3', subjectName: 'Chemistry', subjectCode: 'CHEM101', subjectHour: 50 },
    { id: '4', subjectName: 'Biology', subjectCode: 'BIOL101', subjectHour: 55 },
    { id: '5', subjectName: 'History', subjectCode: 'HIST101', subjectHour: 40 }
  ];

  constructor(private dialog: MatDialog) { }

  ngOnInit(): void {
    this.loadSubjects();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  loadSubjects(): void {
    console.log('Loaded subjects:', this.subjects);
    this.dataSource.data = this.subjects; // Cập nhật dữ liệu của dataSource
    if (this.paginator) {
      this.dataSource.paginator = this.paginator; // Cập nhật paginator sau khi dữ liệu được gán
    }
    this.totalSubjects = this.subjects.length;
  }


  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(SubjectAddComponent, {
      width: '400px',
    });
  }

  onUpdate(subjectData: Subject): void {
    const dialogRef = this.dialog.open(SubjectUpdateComponent, {
      width: '400px',
      data: subjectData // Pass data to the dialog
    });
  }

  onDelete(id: string): void {
    // Logic để xóa môn học
    if (confirm('Are you sure you want to delete this subject?')) {
      this.subjects = this.subjects.filter(subject => subject.id !== id);
      this.loadSubjects();
    }
  }

  onExport(): void {
    // Logic để xuất dữ liệu
  }

  triggerFileInput(): void {
    // Logic để import dữ liệu từ file
  }
}
