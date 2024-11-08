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
    const pageIndex = 0;  // Thay đổi giá trị này nếu có paginator
    const pageSize = 10;  // Thay đổi giá trị này nếu có paginator
    this.classService.findAllClasses(pageIndex,pageSize).subscribe(
      (data) => {
        this.classes = data; // Assign the received data to the classes array
        this.totalClasses = this.classes.length; // Get the total count from the populated array
      },
       (error) => {
        this.toastr.error('Failed to load classes!', 'Error');
      },
    );
  }

  loadStudent(): void {
    // Lấy giá trị trang hiện tại và kích thước trang từ paginator (nếu có)
    const pageIndex = 0;  // Thay đổi giá trị này nếu có paginator
    const pageSize = 10;  // Thay đổi giá trị này nếu có paginator
    
    // Gọi API với các tham số phân trang
    this.studentService.getAllStudents(pageIndex, pageSize).subscribe(
      (data) => {
        this.students = data;  // Gán dữ liệu nhận được vào mảng students
        this.totalStudents = this.students.length; // Lấy tổng số sinh viên từ mảng
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
