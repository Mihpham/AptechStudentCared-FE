import { Component, OnInit } from '@angular/core';
import { ClassResponse } from '../model/class/class-response.model';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/core/services/admin/student.service';
import { TeacherService } from 'src/app/core/services/admin/teacher.service';
import { StudentResponse } from '../model/student-response.model.';
import { TeacherResponse } from '../model/teacher/teacher-response.model';
import { SroResponse } from '../model/sro/sro.model';
import { SroService } from 'src/app/core/services/admin/sro.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { PaginatedStudentResponse } from '../model/pagination-response';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  classes: ClassResponse[] = [];
  teachers: TeacherResponse[] = [];
  students: StudentResponse[] = [];
  sros: SroResponse[] = [];
  totalStudents: number = 0;
  totalClasses: number = 0;
  totalTeacher: number = 0;
  totalSros: number = 0;
  currentUserRole!: string | null;
  constructor(
    private classService: ClassService,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private sroService: SroService,
    private toastr: ToastrService,
    private authService: AuthService  ) {}

  
  ngOnInit(): void {
    this.loadClasses();
    this.loadStudent();
    this.loadTeacher();
    this.loadSro();
    this.currentUserRole = this.authService.getRole();

  }

  loadClasses(): void {
    const pageIndex = 0;  
    const pageSize = 10; 
    this.classService.findAllClasses(pageIndex, pageSize).subscribe(
      (data) => {
        console.log('API Response for Classes:', data);  
        this.classes = data.content || [];  
        this.totalClasses = data.totalElements || 0;
        console.log('Total Classes:', this.totalClasses);
      },
      (error) => {
        this.toastr.error('Failed to load classes!', 'Error');
        console.error('Load classes failed', error); 
      },
    );
  }

  loadStudent(): void {
    const pageIndex = 0; 
    const pageSize = 10; 
    
    this.studentService.getAllStudents(pageIndex, pageSize).subscribe(
      (data: PaginatedStudentResponse) => {
        this.students = data.content;  
        this.totalStudents = data.totalElements;  
      },
      (error) => {
        this.toastr.error('Failed to load students', 'Error');
      }
    );
  }
  
  loadTeacher(): void {
    this.teacherService.getAllTeachers().subscribe(
      (data) => {
        this.teachers = data; // Assign the received data to the teachers array
        this.totalTeacher = this.teachers.length; // Get the total count from the populated array
      },
      (error) => {
        this.toastr.error('Failed to load teachers', 'Error');
      }
    );
  }

  loadSro(): void {
    this.sroService.getAllSros().subscribe(
      (data) => {
        this.sros = data; // Assign the received data to the SROs array
        this.totalSros = this.sros.length; // Get the total count from the populated array
      },
      (error) => {
        this.toastr.error('Failed to load SROs', 'Error'); // Fixed the error message
      }
    );
  }
}
