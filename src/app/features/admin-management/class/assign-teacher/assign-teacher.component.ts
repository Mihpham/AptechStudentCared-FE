import { Component, OnInit } from '@angular/core';
import { ClassService } from './../../../../core/services/admin/class.service';
import { ClassResponse } from '../../model/class/class-response.model';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AssignEditComponent } from '../assign-edit/assign-edit.component';
import { AssignTeacherRequest } from '../../model/class/assign-teacher.model';

@Component({
  selector: 'app-assign-teacher',
  templateUrl: './assign-teacher.component.html',
  styleUrls: ['./assign-teacher.component.scss']
})
export class AssignTeacherComponent implements OnInit {
  classDetails: ClassResponse | null = null;
  semesters = ['Sem1', 'Sem2', 'Sem3', 'Sem4'];

  constructor(
    private classService: ClassService,
    private route: ActivatedRoute,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const classId = +params['id'];
      this.getClassDetails(classId);
    });
  }

  getClassDetails(classId: number): void {
    this.classService.findClassById(classId).subscribe(
      (data: ClassResponse) => {
        this.classDetails = data;
        console.log('Thông tin lớp:', data);
      },
      (error) => {
        console.error('Lỗi khi lấy thông tin lớp:', error);
      }
    );
  }

  getCourseDetails(semester: string): { subject: string, teacher: string }[] {
    const subjects = this.classDetails?.course.semesters[semester] || [];
    return subjects.map(subject => ({
        subject: subject,
        teacher: this.classDetails?.subjectTeacherMap[subject] || 'Chưa có'
    }));
}


  openEditDialog(subject: string, teacherName: string): void {
    const dialogRef = this.dialog.open(AssignEditComponent, {
      data: { subject, teacherName }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.assignTeacherToSubject(result.subject, result.teacherName);
      }
    });
  }

  assignTeacherToSubject(subject: string, teacherName: string): void {
    const request: AssignTeacherRequest = {
      subjectCode: subject,
      teacherName: teacherName
    };

    this.classService.assignTeacher(request).subscribe({
      next: (response: string) => { // Chỉ định kiểu cho response
        console.log('Gán giáo viên thành công:', response);
      },
      error: (error: any) => { // Chỉ định kiểu cho error
        console.error('Lỗi khi gán giáo viên:', error);
      }
    });
  }
}
