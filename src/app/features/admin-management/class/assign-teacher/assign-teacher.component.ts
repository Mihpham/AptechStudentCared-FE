import { Component, OnInit } from '@angular/core';
import { ClassService } from './../../../../core/services/admin/class.service';
import { ClassResponse } from '../../model/class/class-response.model';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AssignEditComponent } from '../assign-edit/assign-edit.component';
import { AssignTeacherRequest } from '../../model/class/assign-teacher.model';
import { ToastrService } from 'ngx-toastr';

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
    private dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router
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
      },
      (error) => {
        console.error('Error get class information :', error);
      }
    );
  }

  getCourseDetails(semester: string): { subject: string, teacher: string }[] {
    const subjects = this.classDetails?.course.semesters[semester] || [];
    return subjects.map(subject => ({
      subject: subject,
      teacher: this.classDetails?.subjectTeacherMap[subject] || 'Not available'
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
  
    this.classService.assignTeacher(this.classDetails?.id || 0, request).subscribe({
      next: (response: string) => {        
        if (this.classDetails?.id) {
          this.getClassDetails(this.classDetails.id);
        }
      },
      error: (error: any) => {
        console.error('Error assigning teacher:', error);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['admin/class']); 
  }
}
