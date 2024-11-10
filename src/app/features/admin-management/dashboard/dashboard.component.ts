import { Component, OnInit } from '@angular/core';
import { ReportService } from 'src/app/core/services/admin/report.service';
import { ReportData } from '../model/report/report.model';
import { ClassResponse } from '../model/class/class-response.model';
import { TeacherResponse } from '../model/teacher/teacher-response.model';
import { SroResponse } from '../model/sro/sro.model';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { StudentService } from 'src/app/core/services/admin/student.service';
import { TeacherService } from 'src/app/core/services/admin/teacher.service';
import { SroService } from 'src/app/core/services/admin/sro.service';
import { ToastrService } from 'ngx-toastr';
import { AuthService } from 'src/app/core/auth/auth.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { StudentResponse } from '../model/student-response.model.';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  classes: string[] = [];
  subjectsByClass: { [key: string]: string[] } = {};
  selectedClass: string[] = []; // Adjusted to be a single selection or an array as per need
  selectedSubject: string = '';
  filteredReport: ReportData | null = null;
  showDetailedView: boolean = false;
  showViewDiscussionsNeeded: boolean = false;
  showViewDiscussionsNeededDone: boolean = false;
  classess: ClassResponse[] = [];
  teachers: TeacherResponse[] = [];
  students: StudentResponse[] = [];
  sros: SroResponse[] = [];
  totalStudents: number = 0;
  totalClasses: number = 0;
  totalTeacher: number = 0;
  totalSros: number = 0;
  currentUserRole!: string | null;

  exchangeTotals: any = {
    'Chuyên cần': {
      'Đi muộn': { 'Đã trao đổi': 0, 'Cần trao đổi': 0 },
      Nghỉ: { 'Đã trao đổi': 0, 'Cần trao đổi': 0 },
    },
    DSE: {
      'Ý thức': { 'Đã trao đổi': 0, 'Cần trao đổi': 0 },
      'Năng lực': { 'Đã trao đổi': 0, 'Cần trao đổi': 0 },
    },
    BTVN: {
      'Nộp muộn': { 'Đã trao đổi': 0, 'Cần trao đổi': 0 },
      'Không nộp': { 'Đã trao đổi': 0, 'Cần trao đổi': 0 },
    },
    'Thi lại và Học lại': {
      'Thi lại': { 'Đã trao đổi': 0, 'Cần trao đổi': 0 },
      'Học lại': { 'Đã trao đổi': 0, 'Cần trao đổi': 0 },
    },
    'Giao tiếp và trao đổi': {
      'Trao đổi với phụ huynh': { 'Đã trao đổi': 0, 'Cần trao đổi': 0 },
      'Trao đổi với AH': { 'Đã trao đổi': 0, 'Cần trao đổi': 0 },
    },
  };
  constructor(
    private reportService: ReportService,
    private classService: ClassService,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private sroService: SroService,
    private toastr: ToastrService,
    private authService: AuthService
  ) {}

  
  ngOnInit(): void {
 
    this.loadTeacher();
    this.loadSro();
    this.currentUserRole = this.authService.getRole();
    const reports = this.reportService.getAllReports();
    this.populateClassAndSubjectLists(reports);
    if (reports && reports.length > 0) {
      const lastReport = reports[reports.length - 1];
      this.selectedClass = [lastReport.className]; // Wrap `className` in an array
      this.selectedSubject = lastReport.subject;
      this.filterReports(); // Load report data for the selected class and subject
    }
  }

  loadClasses(): void {
    this.classService.findAllClasses().subscribe({
      next: (data) => {
        this.classess = data;
        this.totalClasses = this.classess.length;
      },
      error: (error) => {
        this.toastr.error('Failed to load classes!', 'Error');
      },
    });
  }

  loadStudent(): void {
    const pageIndex = 0;
    const pageSize = 10;

    this.studentService.getAllStudents(pageIndex, pageSize).subscribe(
      (data) => {
        this.students = data;
        this.totalStudents = this.students.length;
      },
      (error) => {
        this.toastr.error('Failed to load students', 'Error');
      }
    );
  }

  loadTeacher(): void {
    this.teacherService.getAllTeachers().subscribe(
      (data) => {
        this.teachers = data;
        this.totalTeacher = this.teachers.length;
      },
      (error) => {
        this.toastr.error('Failed to load teachers', 'Error');
      }
    );
  }

  loadSro(): void {
    this.sroService.getAllSros().subscribe(
      (data) => {
        this.sros = data;
        this.totalSros = this.sros.length;
      },
      (error) => {
        this.toastr.error('Failed to load SROs', 'Error');
      }
    );
  }

  populateClassAndSubjectLists(reports: ReportData[]): void {
    const classSet = new Set<string>();
    reports.forEach((report) => {
      classSet.add(report.className);
      if (!this.subjectsByClass[report.className]) {
        this.subjectsByClass[report.className] = [];
      }
      if (!this.subjectsByClass[report.className].includes(report.subject)) {
        this.subjectsByClass[report.className].push(report.subject);
      }
    });
    this.classes = Array.from(classSet);
  }

  onClassChange(): void {
    this.selectedSubject = '';
    this.filteredReport = null;
    this.showDetailedView = false;
    this.showViewDiscussionsNeeded = false;
    this.showViewDiscussionsNeededDone = false;
  }

  filterReports(): void {
    if (this.selectedClass && this.selectedSubject) {
      this.filteredReport =
        this.reportService.getReportByClassAndSubject(
          this.selectedClass[0], // First item if selectedClass is an array
          this.selectedSubject
        ) || null;
    }
  }

  toggleDetailedView(): void {
    this.showDetailedView = !this.showDetailedView;
  }

  toggleshowViewDiscussionsNeeded(): void {
    this.showViewDiscussionsNeeded = !this.showViewDiscussionsNeeded;
  }

  toggleshowViewDiscussionsNeededDone(): void {
    this.showViewDiscussionsNeededDone = !this.showViewDiscussionsNeededDone;
  }

  clearFilter(): void {
    this.selectedClass = [];
    this.selectedSubject = '';
    this.filteredReport = null;
    this.showDetailedView = false;
    this.showViewDiscussionsNeeded = false;
    this.showViewDiscussionsNeededDone = false;
  }
}
