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
    'Cần trao đổi',
    'Đã trao đổi',
    'Cần trao đổi ',
    ' Đã trao đổi',
    'Cần trao đổi',
    'Đã trao đổi',
    'Cần trao đổi',
    'Đã trao đổi',
    'Cần trao đổi',
    'Đã trao đổi',
    'Cần trao đổi',
    'Đã trao đổi',
    'Cần trao đổi',
    'Đã trao đổi',
    'Cần trao đổi',
    'Đã trao đổi',
    'Cần trao đổi',
    'Đã trao đổi',
    'Cần trao đổi',
    'Đã trao đổi',
  ];
  FCSubject: string | null = null;
  Sro: string | null = null;
  Class: string | null = null;
  SS: number = 0;
  isImportMode: boolean = false;

  constructor(
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
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();

      reader.onload = (e: any) => {
        const data = new Uint8Array(e.target.result);
        this.workbook = XLSX.read(data, { type: 'array' });
        this.sheetNames = this.workbook.SheetNames;

        // Automatically select the first sheet and load its data
        if (this.sheetNames.length > 0) {
          this.onSheetSelect(this.sheetNames[0]);
        }
      };

      reader.onerror = (error) => {
        console.error('Error reading file:', error);
      };

      reader.readAsArrayBuffer(file);
    }
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

      // Store subjects for each class
      const subjectsPerClass: { [key: string]: string[] } = {};

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

            // Here, we assume the class name is in the second column (index 1)
            const className = sheetData[this.startRow][1]; // Adjust this index as needed
            if (!subjectsPerClass[className]) {
              subjectsPerClass[className] = [];
            }
            subjectsPerClass[className].push(mergedValue);

            console.log(
              `Giá trị của ô gộp từ dòng ${this.startRow} đến dòng ${this.endRow}:`,
              mergedValue
            );
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

          console.log(
            'Tổng các cột trong phạm vi ô gộp cuối cùng:',
            this.columnSums
          );
          console.log('Tổng các cột trong phạm vi ô gộp cuối cùng:');
          this.columnSums.forEach((sum, index) => {
            console.log(`${this.columnNames[index]}: ${sum}`);
          });
        }
      }

      // Now handle subjects per class
      console.log('Subjects per class:', subjectsPerClass);
      this.readColumnData(sheetData, 1);
    }
  }

  readColumnData(sheetData: any[], columnIndex: number): void {
    const totalStudents = sheetData
      .slice(1) // Skip header
      .map((row) => row[columnIndex])
      .filter((value) => typeof value === 'number')
      .reduce((acc, num) => acc + num, 0);

    this.SS = totalStudents; // Store the sum in the component's SS property

    if (sheetData.length > 1) {
      this.Class = sheetData[0][columnIndex];
      this.Sro = sheetData[1][columnIndex];
    } else {
      console.error('hehe');
    }
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
