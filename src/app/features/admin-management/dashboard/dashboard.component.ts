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
import * as XLSX from 'xlsx';
@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  classes: string[] = [];
  subjectsByClass: { [key: string]: string[] } = {};
  selectedClass: string = '';// Single selection for class
  selectedSubject: string | null = null; // Single selection for subject
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
  isImportMode: boolean = false;
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
 
    // this.loadTeacher();
    // this.loadSro();

    this.currentUserRole = this.authService.getRole();
    const reports = this.reportService.getAllReports();
    console.log("reports" ,reports)
    this.populateClassAndSubjectLists(reports);
    if (reports && reports.length > 0) {
      const lastReport = reports[reports.length - 1];
      this.selectedClass = lastReport.className;
      this.selectedSubject = lastReport.subject;
      this.filterReports();
    }
    
  }
  
  onFileChange(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input && input.files && input.files[0]) {
      const file = input.files[0];
      const reader = new FileReader();
      reader.onload = (e: any) => {
        const data = e.target.result;
        const workbook = XLSX.read(data, { type: 'binary' });
        
        // Gọi phương thức để xử lý workbook
        this.reportService.processWorkbook(workbook);
        
        // Cập nhật danh sách báo cáo và lọc báo cáo sau khi xử lý
        const reports = this.reportService.getAllReports();
        this.populateClassAndSubjectLists(reports);
        if (reports.length > 0) {
          const lastReport = reports[reports.length - 1];
          this.selectedClass = lastReport.className;
          this.selectedSubject = lastReport.subject;
          this.filterReports();
        }
      };
      reader.readAsBinaryString(file);
    }
  }

  populateClassAndSubjectLists(reports: ReportData[]): void {
    const classSet = new Set<string>();
    this.subjectsByClass = {}; // Reset subjectsByClass

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
  activateImportMode() {
    this.isImportMode = true;
  }

  deactivateImportMode() {
    this.isImportMode = false;
  }
  toggleImportMode() {
    this.isImportMode = true;
  }
  filterReports(): void {
    if (this.selectedClass && this.selectedSubject) {
      this.filteredReport = this.reportService.getReportByClassAndSubject(
        this.selectedClass,
        this.selectedSubject
      ) || null;
    }
  }

  clearFilter(): void {
    this.selectedClass = '';
    this.selectedSubject = '';
    this.filteredReport = null;
  }

  // loadClasses(): void {
  //   this.classService.findAllClasses().subscribe({
  //     next: (data) => {
  //       this.classess = data;
  //       this.totalClasses = this.classess.length;
  //     },
  //     error: (error) => {
  //       this.toastr.error('Failed to load classes!', 'Error');
  //     },
  //   });
  // }

  // loadStudent(): void {
  //   const pageIndex = 0;
  //   const pageSize = 10;

  //   this.studentService.getAllStudents(pageIndex, pageSize).subscribe(
  //     (data) => {
  //       this.students = data;
  //       this.totalStudents = this.students.length;
  //     },
  //     (error) => {
  //       this.toastr.error('Failed to load students', 'Error');
  //     }
  //   );
  // }

  // loadTeacher(): void {
  //   this.teacherService.getAllTeachers().subscribe(
  //     (data) => {
  //       this.teachers = data;
  //       this.totalTeacher = this.teachers.length;
  //     },
  //     (error) => {
  //       this.toastr.error('Failed to load teachers', 'Error');
  //     }
  //   );
  // }

  // loadSro(): void {
  //   this.sroService.getAllSros().subscribe(
  //     (data) => {
  //       this.sros = data;
  //       this.totalSros = this.sros.length;
  //     },
  //     (error) => {
  //       this.toastr.error('Failed to load SROs', 'Error');
  //     }
  //   );
  // }

  

  onClassChange(): void {
    this.selectedSubject = null; // Reset subject when class changes
    this.filteredReport = null; // Clear filtered report
    this.showDetailedView = false; // Reset view flags
    this.showViewDiscussionsNeeded = false;
    this.showViewDiscussionsNeededDone = false;
    this.filterReports(); // Filter reports based on the new class
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

   
}
