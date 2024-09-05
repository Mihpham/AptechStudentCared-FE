import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { SubjectService } from '../service/subject.service';
import { SubjectResponse } from '../model/subject-response.model';
import { SubjectAddComponent } from '../subject-add/subject-add.component';
import { MatDialog } from '@angular/material/dialog';
import { ChangeDetectorRef } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { SubjectUpdateComponent } from '../subject-update/subject-update.component';
import { ConfirmDeleteSubjectComponent } from '../confirm-delete-subject/confirm-delete-subject.component';
import { Router } from '@angular/router';


@Component({
  selector: 'app-subject-list',
  templateUrl: './subject-list.component.html',
  styleUrls: ['./subject-list.component.scss']
})
export class SubjectListComponent implements OnInit {
  displayedColumns: string[] = ['subjectName', 'subjectCode', 'totalHours', 'actions'];
  dataSource = new MatTableDataSource<SubjectResponse>();
  searchTerm: string = '';

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  totalSubjects: number = 0;

  constructor(private router: Router,
    private subjectService: SubjectService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,) { }

  ngOnInit(): void {
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe(
      (data: SubjectResponse[]) => {
        // Chuyển đổi thuộc tính createdAt từ chuỗi thành đối tượng Date nếu cần
        data.forEach(subject => {
          if (typeof subject.createdAt === 'string') {
            subject.createdAt = new Date(subject.createdAt);
          }
        });
        
        // Sắp xếp dữ liệu theo thuộc tính createdAt (giảm dần)
        data.sort((a, b) => (b.createdAt.getTime() - a.createdAt.getTime()));
        
        console.log('Loaded subjects:', data);
        this.dataSource.data = data;
        this.totalSubjects = data.length;
        this.dataSource.paginator = this.paginator;
        this.applyFilter(this.searchTerm); // Apply the filter after loading data
      },
      (error) => {
        console.error('Error fetching subjects', error);
      }
    );
  }
  

  applyFilter(filterValue: string): void {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  onAdd(): void {
    const dialogRef = this.dialog.open(SubjectAddComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.subjectService.addSubject(result).subscribe(() => {
          this.loadSubjects(); // Cập nhật lại danh sách sau khi thêm thành công
        });
      }
    });

  }

  onUpdate(subject: SubjectResponse): void {
    const dialogRef = this.dialog.open(SubjectUpdateComponent, {
      width: '400px',
      data: subject
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.reload) {
        this.loadSubjects(); // Reload data if needed
      }
    });
  }

  onDelete(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDeleteSubjectComponent, {
      width: '300px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Gọi API để xóa
        this.subjectService.deleteSubject(id).subscribe(
          () => {
            this.toastr.success('Xóa thành công');
            this.loadSubjects();
          },
          error => {
            console.error('Error deleting subject:', error);
            this.toastr.error('Xóa không thành công');
          }
        );
      }
    });
  }



  triggerFileInput(): void {
    // Handle file import action
  }

  onExport(): void {
    // Handle export action
  }

}
