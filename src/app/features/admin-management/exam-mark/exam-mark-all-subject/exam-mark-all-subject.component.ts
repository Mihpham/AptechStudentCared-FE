import { Component } from '@angular/core';
import { CourseResponse } from '../../model/course/course-response.model';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { ActivatedRoute } from '@angular/router';
import { ClassResponse } from '../../model/class/class-response.model';
import { Student } from '../../model/exam-mark/student.model';
import { HttpClient } from '@angular/common/http';
import { ExamScore } from '../../model/exam-mark/exam-score.model'; // Import ExamScore interface
import * as XLSX from 'xlsx'; // Import thư viện XLSX
import { saveAs } from 'file-saver'; // Import thư viện FileSaver
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-exam-mark-all-subject',
  templateUrl: './exam-mark-all-subject.component.html',
  styleUrls: ['./exam-mark-all-subject.component.scss'],
})
export class ExamMarkAllSubjectComponent {
  subjects: string[] = [];
  classId: number | null = null;
  classDetails: ClassResponse | null = null;
  terms: { id: number; name: string }[] = [];
  selectedTerm: number | null = null;
  students: Student[] = [];
  selectedSubject: string | null = null; // Thêm biến này để lưu subject đã chọn
  currentUserRole!: string | null;

  constructor(
    private classService: ClassService,
    private authService: AuthService,
    private http: HttpClient,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.currentUserRole = this.authService.getRole();

    this.terms = [
      { id: 1, name: 'Semester 1' },
      { id: 2, name: 'Semester 2' },
      { id: 3, name: 'Semester 3' },
      { id: 4, name: 'Semester 4' },
    ];

    // Đặt mặc định là kỳ 1
    this.selectedTerm = 1;

    // Lấy classId từ route
    this.route.params.subscribe((params) => {
      this.classId = +params['classId'];

      console.log('classId:', this.classId); // Kiểm tra giá trị classId

      if (this.classId !== null && !isNaN(this.classId)) {
        this.getClassById(this.classId);
      } else {
        console.error('No valid classId provided in the URL.');
      }
    });
  }

  getClassById(classId: number): void {
    this.classService.findClassById(classId).subscribe(
      (classResponse: ClassResponse) => {
        this.classDetails = classResponse;
        this.getCourseByClass(classId); // Lấy danh sách môn học ngay sau khi có thông tin lớp
        this.getExamScoresByClass(classId); // Gọi phương thức để lấy điểm ngay sau khi có thông tin lớp
      },
      (error) => {
        console.error('Error fetching class details:', error);
      }
    );
  }

  getExamScoresByClass(classId: number): void {
    this.http
      .get<Student[]>(`http://localhost:1010/api/exam-score/${classId}`)
      .subscribe(
        (data: Student[]) => {
          this.students = data;
          console.log('Students fetched:', this.students);
          this.logScores(); // Gọi phương thức để in điểm ra console
        },
        (error) => {
          console.error('Error fetching students', error);
        }
      );
  }

 

  // Lấy danh sách môn học theo lớp
  getCourseByClass(classId: number): void {
    this.classService.findAllSubjectByClassId(classId).subscribe(
      (classResponse) => {
        const course: CourseResponse = classResponse;
        this.subjects = [];

        // Khởi tạo subjects với tất cả các môn học
        Object.keys(course.semesters).forEach((key) => {
          const semesterSubjects = course.semesters[key];
          if (semesterSubjects) {
            this.subjects.push(...semesterSubjects);
          }
        });

        // Gọi filterMarks để lấy điểm cho kỳ mặc định (kỳ 1)
        this.filterMarks();
      },
      (error) => {
        console.error('Error fetching subjects:', error);
      }
    );
  }

  // Lọc môn học theo kỳ đã chọn
  filterMarks(): void {
    if (this.selectedTerm) {
      this.classService.findAllSubjectByClassId(this.classId!).subscribe(
        (classResponse) => {
          const course: CourseResponse = classResponse;
          const selectedSemesterKey = `Sem${this.selectedTerm}`;
          const selectedSemesterSubjects =
            course.semesters[selectedSemesterKey];

          this.subjects = selectedSemesterSubjects || [];
          this.getExamScoresByClass(this.classId!); // Lấy điểm cho kỳ đã chọn
        },
        (error) => {
          console.error('Error fetching subjects:', error);
        }
      );
    }
  }

  // Phương thức in điểm của học sinh ra console
  logScores(): void {
    this.students.forEach((student) => {
      console.log(`Học sinh: ${student.className} - ${student.image}`); // In thông tin học sinh
      student.listExamScore.forEach((score: ExamScore) => {
        console.log(`Tên Học Sinh: ${score.studentName}`);
        console.log(`Môn Học: ${score.subjectCode}`);
        console.log(`Điểm Lý Thuyết: ${score.theoreticalScore}`);
        console.log(`Điểm Thực Hành: ${score.practicalScore}`);
        console.log('-----------------------');
      });
    });
  }

  // Hàm xuất dữ liệu điểm thi thành file CSV
  onExport(): void {
    const dataToExport = this.students
      .map((student) => {
        return student.listExamScore.map((score) => {
          return {
            'Roll Number': score.rollNumber,
            'Full Name': score.studentName,
            'Class Name': student.className,
            Subject: score.subjectCode,
            'Theoretical Score': score.theoreticalScore,
            'Practical Score': score.practicalScore,
          };
        });
      })
      .flat(); // Nén mảng

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
}
