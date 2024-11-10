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
// import { Component } from '@angular/core';
import * as XLSX from 'xlsx';
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

  sheetNames: string[] = [];
  selectedSheetData: any[] = [];   
  workbook: XLSX.WorkBook | undefined;
  columnSums: number[] = [];  
  acc: string | null = null;
  startRow: number = 0;
  endRow: number = 0;
  startCol: number = 0;
  columnNames = [
    "Chuyên cần Muộn Cần trao đổi", "Chuyên cần Muộn Đã trao đổi", 
    "Chuyên cần Nghỉ không phép Cần trao đổi ", 
    "Chuyên cần Nghỉ không phép Đã trao đổi", 
    "DSE Ý thức Cần trao đổi", "DSE Ý thức Đã trao đổi", 
    "DSE Năng lực Cần trao đổi", "DSE Năng lực Đã trao đổi", 
    "BTVN Nộp muộn Cần trao đổi", "BTVN Nộp muộn Đã trao đổi", 
    "BTVN Không nộp Cần trao đổi", "BTVN Không nộp Đã trao đổi", 
    "Thi lại Cần trao đổi", "Thi lại Đã trao đổi", 
    "Học lại Cần trao đổi", "Học lại Đã trao đổi", 
    "Trao đổi với phụ huynh Cần trao đổi", "Trao đổi với phụ huynh Đã trao đổi", 
    "Trao đổi với AH Cần trao đổi", "Trao đổi với AH Đã trao đổi"
  ];
  FCSubject : string | null = null;
  Sro : string | null = null;
  Class : string | null = null;
  SS : number = 0;


  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        this.workbook = XLSX.read(data, { type: 'array' });
        this.sheetNames = this.workbook.SheetNames;
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };

      reader.readAsArrayBuffer(file);
    }
  }

  onSheetSelect(event: Event | string) {
    let sheetName: string;

    if (typeof event === 'string') {
      sheetName = event;
    } else {
      const selectElement = event.target as HTMLSelectElement;
      sheetName = selectElement.value;
    }

    if (this.workbook && sheetName) {
      const sheet = this.workbook.Sheets[sheetName];
      const sheetData: any[][] = XLSX.utils.sheet_to_json(sheet, { header: 1 });

      const merges = sheet['!merges'];
      const maxCol = 24;
      this.columnSums = new Array(maxCol).fill(0); 

      let lastMergedValue: any = null;
      let lastStartRow: number = -1;  
      let lastEndRow: number = -1;   

      if (merges && merges.length > 0) {
        merges.forEach((merge) => {
          this.startRow = merge.s.r;
          this.endRow = merge.e.r;
          this.startCol = merge.s.c;

          if (this.startCol === 0) { 
            const mergedValue = sheetData[this.startRow][this.startCol];
            
            lastMergedValue = mergedValue;
            lastStartRow = this.startRow;
            lastEndRow = this.endRow;
            this.FCSubject = mergedValue;
            console.log(`Giá trị của ô gộp từ dòng ${this.startRow} đến dòng ${this.endRow}:`, mergedValue);
          }
        });
        if (lastStartRow !== -1 && lastEndRow !== -1) {
          console.log('Tính tổng cho các cột trong phạm vi ô gộp cuối cùng:');

          for (let row = lastStartRow; row <= lastEndRow; row++) {
            const rowData = sheetData[row].slice(0, maxCol);

            rowData.forEach((cell, colIndex) => {
              if (typeof cell === 'number') {
                this.columnSums[colIndex] += cell; 
              }
            });
            
          }
          console.log('Tổng các cột trong phạm vi ô gộp cuối cùng:', this.columnSums);
        console.log('Tổng các cột trong phạm vi ô gộp cuối cùng:');
        this.columnSums.forEach((sum, index) => {
          console.log(`${this.columnNames[index]}: ${sum}`);
        });
        }
      }
      this.readColumnData(sheetData, 1);
    }

    
  }

  readColumnData(sheetData: any[], columnIndex: number): void {
    if (sheetData.length > 1) {
      this.Class = sheetData[0][columnIndex];
      this.Sro = sheetData[1][columnIndex]; 
  
      
    } else {
      console.error('hehe');
    }
  }





  constructor(
    private classService: ClassService,
    private studentService: StudentService,
    private teacherService: TeacherService,
    private sroService: SroService,
    private toastr: ToastrService,
    private authService: AuthService) { }


  ngOnInit(): void {
    this.loadClasses();
    this.loadStudent();
    this.loadTeacher();
    this.loadSro();
    this.currentUserRole = this.authService.getRole();

  }

  loadClasses(): void {
    const pageIndex = 1;  
    const pageSize = 10; 
    this.classService.findAllClasses(pageIndex, pageSize).subscribe(
      (data) => {
        console.log('API Response for Classes:', data);  
        this.classes = data.content || [];  
        this.totalClasses = data.totalElements || 0;
        console.log('Total Classes:', this.totalClasses);
      },
      error: (error) => {
        this.toastr.error('Failed to load classes!', 'Error');
      },
    });
  }

  loadStudent(): void {
    const pageIndex = 1; 
    const pageSize = 10; 
    
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
