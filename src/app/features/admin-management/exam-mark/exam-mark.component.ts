import { Component, OnInit } from '@angular/core';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { ClassResponse } from '../model/class/class-response.model';
import { Student } from '../model/exam-mark/student.model'; // Đã thêm `ExamScore`
import { ExamScore } from '../model/exam-mark/exam-score.model';
import { HttpClient } from '@angular/common/http';
import { CourseResponse } from '../model/course/course-response.model';
import { ExamMarkService } from 'src/app/core/services/admin/exam-mark.service';
import { ToastrService } from 'ngx-toastr';
import { ImportExamMarkDialogComponent } from './import-exam-mark-dialog/import-exam-mark-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import * as XLSX from 'xlsx'; // Thư viện để xuất file CSV
import { saveAs } from 'file-saver'; // Thư viện để lưu file
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-exam-mark',
  templateUrl: './exam-mark.component.html',
  styleUrls: ['./exam-mark.component.scss'],
})
export class ExamMarkComponent implements OnInit {
  classes: ClassResponse[] = []; // Danh sách các lớp
  // selectedClass: number | null = null; // Lớp học được chọn
  subjects: string[] = []; // Danh sách mã môn học (Subject[] hoặc listExamScore.subjectCode)
  selectedSubject: string | null = null; // Môn học được chọn (nullable)
  students: Student[] = []; // Danh sách sinh viên trong lớp
  showTable: boolean = false;
  tempScores: { [key: string]: { theoretical: number; practical: number } } =
    {};
  classID: number | null = null;
  selectedClass: ClassResponse | null = null; // Lớp học được chọn (full object)

  displayedColumns: string[] = [
    'avatar',
    'fullName',
    'module',
    'className',
    'theoreticalScore',
    'practicalScore',
    'result',
    'action',
  ];

  constructor(
    private classService: ClassService,
    private http: HttpClient,
    private examMarkService: ExamMarkService,
    private toastr: ToastrService,
    private dialog: MatDialog,
    private route: ActivatedRoute // Sử dụng MatDialog cho import
  ) {}

  ngOnInit(): void {
    // Get the classID from the URL
    this.route.params.subscribe((params) => {
      this.classID = params['classID'];
      if (!this.classID) {
        console.error('No classID provided in the URL.');
      } else {
        console.log('Class ID:', this.classID);
        this.loadClassNames(); // Load classes to populate the select options
        this.getCourseByClass(this.classID);
        this.loadClassDetails(this.classID);
        // Fetch subjects for the class
      }
    });
  }

  loadClassDetails(classID: number): void {
    this.classService.findClassById(classID).subscribe(
      (classDetails: ClassResponse) => {
        this.selectedClass = classDetails; // Assign the full class object to selectedClass
      },
      (error) => {
        console.error('Error fetching class details:', error);
      }
    );
  }

  // Hàm mở dialog để import điểm
  onImport(): void {
    console.log('Opening import dialog...');

    const dialogRef = this.dialog.open(ImportExamMarkDialogComponent, {
      width: '500px',
      data: {
        selectedClass: this.selectedClass, // Truyền lớp học đã chọn
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log('Dialog closed with result:', result);
      if (result && result.reload) {
        this.loadClassNames(); // Reload student data after import
        // Kiểm tra xem selectedClass có phải là null không
        if (this.classID !== null) {
          this.getExamScoresByClass(this.classID); // Tải lại điểm cho lớp đã chọn
        } else {
          console.warn('No class selected, cannot reload exam scores.');
        }
      }
    });
  }

  // Hàm xuất dữ liệu điểm thi thành file CSV
  onExport(): void {
    const dataToExport = this.students.map((student) => {
      const examScore = this.getExamScore(
        student.listExamScore,
        this.selectedSubject || ''
      );

      return {
        'Roll Number': student.listExamScore[0].rollNumber,
        'Full Name': student.listExamScore[0].studentName,
        'Class Name': student.listExamScore[0].className,
        Subject: this.selectedSubject,
        'Theoretical Score': examScore?.theoreticalScore || 0,
        'Practical Score': examScore?.practicalScore || 0,
        Result: this.calculateResult(student),
      };
    });

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Students');
    const wbout: Uint8Array = XLSX.write(wb, {
      bookType: 'csv',
      type: 'array',
    });
    const blob = new Blob([wbout], { type: 'text/csv;charset=utf-8' });
    saveAs(blob, 'students.csv');
  }

  loadClassNames(): void {
    this.classService.findAllClasses().subscribe(
      (classes: ClassResponse[]) => {
        this.classes = classes;
      },
      (error) => {
        console.error('Lỗi khi lấy danh sách lớp:', error);
      }
    );
  }

  // Fetch subjects for the class from the URL
  getCourseByClass(classId: number) {
    this.classService.findAllSubjectByClassId(classId).subscribe(classResponse => {
      const course: CourseResponse = classResponse;
      this.subjects = [];
  
      // Lấy danh sách các môn học của kỳ 1 và các kỳ khác nếu cần
      Object.keys(course.semesters).forEach(key => {
        const semesterSubjects = course.semesters[key];
        if (semesterSubjects) {
          this.subjects.push(...semesterSubjects);
        }
      });
  
      // Chọn môn học đầu tiên của kỳ 1 làm mặc định
      if (this.subjects.length > 0) {
        this.selectedSubject = this.subjects[0];
        this.onSubjectChange(); // Gọi phương thức để tải dữ liệu điểm thi của môn mặc định
      }
    });
  }

  onSubjectChange() {
    if (this.classID && this.selectedSubject) {
      this.showTable = true;
      this.getExamScoresByClass(this.classID);
    }
  }
  
  // onSubjectChange(event: Event) {
  //   const subjectCode = (event.target as HTMLSelectElement).value;
  //   this.selectedSubject = subjectCode;

  //   if (this.classID && this.selectedSubject) {
  //     this.showTable = true;
  //     this.getExamScoresByClass(this.classID);
  //   }
  // }

  getExamScoresByClass(classId: number): void {
    this.http
      .get<Student[]>(`http://localhost:1010/api/exam-score/${classId}`)
      .subscribe(
        (data: Student[]) => {
          this.students = data;
          this.initializeTempScores();
        },
        (error) => {
          console.error('Error fetching students', error);
        }
      );
  }

  initializeTempScores() {
    this.students.forEach((student) => {
      if (this.selectedSubject) {
        const examScore = this.getExamScore(
          student.listExamScore,
          this.selectedSubject
        );
        if (examScore) {
          // Sử dụng rollNumber từ ExamScore thay vì Student
          this.tempScores[examScore.rollNumber] = {
            theoretical: examScore.theoreticalScore ?? 0,
            practical: examScore.practicalScore ?? 0,
          };
        }
      }
    });
  }

  onlyNumberKey(event: KeyboardEvent) {
    const input = event.key;
    // Cho phép nhập số từ 0 đến 9
    if (!/^\d$/.test(input) && input !== 'Backspace') {
      event.preventDefault(); // Ngăn không cho nhập ký tự khác
    }

    // Nếu đã nhập 2 ký tự rồi thì không cho nhập thêm
    const currentInputValue = (event.target as HTMLInputElement).value;
    if (currentInputValue.length >= 2 && input !== 'Backspace') {
      event.preventDefault();
    }
  }

  getExamScore(
    listExamScore: ExamScore[],
    subjectCode: string
  ): ExamScore | undefined {
    return listExamScore.find(
      (examScore) => examScore.subjectCode === subjectCode
    );
  }

  onScoreChange(student: Student, examScore: ExamScore) {
    if (this.tempScores[examScore.rollNumber].theoretical > 20) {
      this.tempScores[examScore.rollNumber].theoretical = 20;
    }

    if (this.tempScores[examScore.rollNumber].practical > 20) {
      this.tempScores[examScore.rollNumber].practical = 20;
    }

    student.hasChanges = true; // Đánh dấu sự thay đổi
  }

  calculateResult(student: Student): string {
    const examScore = this.getExamScore(
      student.listExamScore,
      this.selectedSubject || ''
    );
    if (!examScore) return 'Fail';

    const scores = [examScore.theoreticalScore, examScore.practicalScore];

    if (scores.every((score) => score < 8)) {
      return 'Fail';
    } else if (scores.every((score) => score >= 8 && score <= 11)) {
      return 'Pass';
    } else if (scores.every((score) => score >= 12 && score <= 14)) {
      return 'Credit';
    } else if (scores.every((score) => score >= 15)) {
      return 'Distinction';
    } else {
      const minScore = Math.min(...scores);
      if (minScore < 8) return 'Fail';
      if (minScore >= 8 && minScore <= 11) return 'Pass';
      if (minScore >= 12 && minScore <= 14) return 'Credit';
      return 'Distinction';
    }
  }

  getResultClass(result: string): string {
    switch (result) {
      case 'Fail':
        return 'text-red-600';
      case 'Pass':
        return 'text-yellow-500';
      case 'Credit':
        return 'text-green-500';
      case 'Distinction':
        return 'text-blue-500';
      default:
        return '';
    }
  }

  saveChanges(student: Student, examScore: ExamScore) {
    const updatedScore = this.tempScores[examScore.rollNumber];
    const scoreData = {
      rollNumber: examScore.rollNumber, // Sử dụng rollNumber từ ExamScore
      studentName: examScore.studentName,
      subjectCode: this.selectedSubject,
      theoreticalScore: updatedScore.theoretical,
      practicalScore: updatedScore.practical,
    };

    if (this.classID !== null) {
      this.examMarkService
        .updateStudentExamScore(this.classID, scoreData)
        .subscribe({
          next: () => {
            student.hasChanges = false;
            this.toastr.success('Update mark success!', 'Success');
          },
          error: () => {
            this.toastr.error('An error occurred while updating mark.', 'Fail');
          },
        });
    } else {
      this.toastr.warning('Please select a class first.', 'Warning');
    }
  }
}
