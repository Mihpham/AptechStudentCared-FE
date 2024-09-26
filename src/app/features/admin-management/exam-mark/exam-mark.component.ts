import { Component, OnInit } from '@angular/core';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { ClassResponse } from '../model/class/class-response.model';
import { Student } from '../model/exam-mark/student.model'; // Đã thêm `ExamScore`
import { ExamScore } from '../model/exam-mark/exam-score.model';
import { HttpClient } from '@angular/common/http';
import { CourseResponse } from '../model/course/course-response.model';
import { ExamMarkService } from 'src/app/core/services/admin/exam-mark.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-exam-mark',
  templateUrl: './exam-mark.component.html',
  styleUrls: ['./exam-mark.component.scss']
})
export class ExamMarkComponent implements OnInit {
  classes: ClassResponse[] = []; // Danh sách các lớp
  selectedClass: number | null = null; // Lớp học được chọn
  subjects: string[] = []; // Danh sách mã môn học (Subject[] hoặc listExamScore.subjectCode)
  selectedSubject: string | null = null; // Môn học được chọn (nullable)
  students: Student[] = []; // Danh sách sinh viên trong lớp
  showTable: boolean = false;
  tempScores: { [key: string]: { theoretical: number; practical: number } } = {};

  displayedColumns: string[] = ['avatar', 'fullName', 'module', 'className', 'theoreticalScore', 'practicalScore', 'result', 'action'];

  constructor(private classService: ClassService,
    private http: HttpClient,
    private examMarkService: ExamMarkService,
    private toastr: ToastrService
  ) { }

  ngOnInit(): void {
    this.loadClassNames(); // Tải danh sách lớp khi khởi động component
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

  onClassChange(event: Event) {
    const classId = Number((event.target as HTMLSelectElement).value);
    this.selectedClass = classId;
    this.getCourseByClass(classId);
    this.selectedSubject = null;
    this.students = [];
    this.showTable = false;
  }

  getCourseByClass(classId: number) {
    this.classService.findAllSubjectByClassId(classId).subscribe(classResponse => {
      const course: CourseResponse = classResponse;
      this.subjects = [];

      Object.keys(course.semesters).forEach(key => {
        const semesterSubjects = course.semesters[key];
        if (semesterSubjects) {
          this.subjects.push(...semesterSubjects);
        }
      });
    });
  }

  onSubjectChange(event: Event) {
    const subjectCode = (event.target as HTMLSelectElement).value;
    this.selectedSubject = subjectCode;

    if (this.selectedClass && this.selectedSubject) {
      this.showTable = true;
      this.getExamScoresByClass(this.selectedClass);
    }
  }

  getExamScoresByClass(classId: number): void {
    this.http.get<Student[]>(`http://localhost:1010/api/exam-score/${classId}`).subscribe(
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
    this.students.forEach(student => {
      if (this.selectedSubject) {
        const examScore = this.getExamScore(student.listExamScore, this.selectedSubject);
        if (examScore) {
          // Sử dụng rollNumber từ ExamScore thay vì Student
          this.tempScores[examScore.rollNumber] = {
            theoretical: examScore.theoreticalScore ?? 0,
            practical: examScore.practicalScore ?? 0
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

  getExamScore(listExamScore: ExamScore[], subjectCode: string): ExamScore | undefined {
    return listExamScore.find(examScore => examScore.subjectCode === subjectCode);
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
    const examScore = this.getExamScore(student.listExamScore, this.selectedSubject || '');
    if (!examScore) return 'Fail';

    const scores = [examScore.theoreticalScore, examScore.practicalScore];

    if (scores.every(score => score < 8)) {
      return 'Fail';
    } else if (scores.every(score => score >= 8 && score <= 11)) {
      return 'Pass';
    } else if (scores.every(score => score >= 12 && score <= 14)) {
      return 'Credit';
    } else if (scores.every(score => score >= 15)) {
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
      practicalScore: updatedScore.practical
    };

    if (this.selectedClass !== null) {
      this.examMarkService.updateStudentExamScore(this.selectedClass, scoreData).subscribe({
        next: () => {
          student.hasChanges = false;
          this.toastr.success('Update mark success!', 'Success');
        },
        error: () => {
          this.toastr.error('An error occurred while updating mark.', 'Fail');
        }
      });
    } else {
      this.toastr.warning('Please select a class first.', 'Warning');
    }
  }

}
