import { Component, OnInit } from '@angular/core';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { ClassResponse } from '../model/class/class-response.model';
import { Student } from '../model/exam-mark/student.model';
import { HttpClient } from '@angular/common/http';
import { CourseResponse } from '../model/course/course-response.model';
import { Subject } from '../model/exam-mark/subject.model';

@Component({
  selector: 'app-exam-mark',
  templateUrl: './exam-mark.component.html',
  styleUrls: ['./exam-mark.component.scss']
})
export class ExamMarkComponent implements OnInit {
  classes: ClassResponse[] = []; // Danh sách các lớp
  selectedClass: number | null = null; // Lớp học được chọn
  subjects: string[] = []; // Danh sách mã môn học (Subject[])
  selectedSubject: string | null = null; // Môn học được chọn (nullable)
  students: Student[] = []; // Danh sách sinh viên trong lớp
  showTable: boolean = false;
  tempScores: { [key: string]: { theoretical: number; practical: number } } = {};

  displayedColumns: string[] = ['avatar', 'fullName', 'module', 'className', 'theoreticalScore', 'practicalScore', 'result', 'action'];

  constructor(private classService: ClassService, private http: HttpClient) { }

  ngOnInit(): void {
    this.loadClassNames(); // Tải danh sách lớp khi khởi động component
  }

  // Phương thức để load danh sách tên các lớp học
  loadClassNames(): void {
    this.classService.findAllClasses().subscribe(
      (classes: ClassResponse[]) => {
        this.classes = classes; // Lưu trực tiếp danh sách lớp
      },
      (error) => {
        console.error('Lỗi khi lấy danh sách lớp:', error);
      }
    );
  }

  // Phương thức khi lớp học được chọn
  onClassChange(event: Event) {
    const classId = Number((event.target as HTMLSelectElement).value);
    this.selectedClass = classId; // Lưu lớp đã chọn
    this.getCourseByClass(classId); // Lấy thông tin khóa học và môn học
    this.selectedSubject = null; // Reset môn học đã chọn
    this.students = []; // Reset danh sách sinh viên khi thay đổi lớp
    this.showTable = false; // Ẩn bảng
  }

  getCourseByClass(classId: number) {
    this.classService.findClassById(classId).subscribe(classResponse => {
      const course: CourseResponse = classResponse.course; // Lấy khóa học từ phản hồi
      this.subjects = []; // Reset danh sách môn học

      // Lấy tất cả các môn học từ các kỳ
      Object.values(course.semesters).forEach(semesterSubjects => {
        if (semesterSubjects) {
          this.subjects.push(...semesterSubjects); // Thêm các môn học vào danh sách
        }
      });
    });
  }

  onSubjectChange(event: Event) {
    const subjectCode = (event.target as HTMLSelectElement).value;
    this.selectedSubject = subjectCode;

    // Kiểm tra xem cả lớp và môn học đã được chọn chưa
    if (this.selectedClass && this.selectedSubject) {
      this.showTable = true; // Hiển thị bảng
      this.getExamScoresByClass(this.selectedClass); // Lấy điểm theo lớp và môn học
    }
  }

  getExamScoresByClass(classId: number): void {
    this.http.get<Student[]>(`http://localhost:1010/api/exam-score/${classId}`).subscribe(
      (data: Student[]) => {
        this.students = data;
        this.initializeTempScores(); // Khởi tạo điểm số tạm thời cho sinh viên
      },
      (error) => {
        console.error('Error fetching students', error);
      }
    );
  }

  // Khởi tạo điểm số tạm thời cho sinh viên
  initializeTempScores() {
    this.students.forEach(student => {
      if (this.selectedSubject) {
        this.tempScores[student.rollNumber] = {
          theoretical: this.getTheoreticalScore(student.subjects, this.selectedSubject),
          practical: this.getPracticalScore(student.subjects, this.selectedSubject),
        };
      }
    });
  }

  // Cập nhật điểm số
  onScoreChange(student: Student) {
    const scores = this.tempScores[student.rollNumber];
    if (scores) {
      const subject = student.subjects.find(sub => sub.subjectCode === this.selectedSubject);
      if (subject) {
        subject.theoreticalScore = scores.theoretical; // Cập nhật điểm LT
        subject.practicalScore = scores.practical; // Cập nhật điểm TH
        student.hasChanges = true; // Đánh dấu có thay đổi
      }
    }
  }

  // Tính toán kết quả dựa trên điểm LT và TH
  calculateResult(student: Student): string {
    const theoreticalScore = this.getTheoreticalScore(student.subjects, this.selectedSubject || '');
    const practicalScore = this.getPracticalScore(student.subjects, this.selectedSubject || '');

    const totalScore = theoreticalScore + practicalScore;

    return totalScore >= 50 ? 'Pass' : 'Fail'; // Giả sử 50 là điểm qua
  }

  // Lưu thay đổi khi bấm nút Save
  saveChanges(student: Student): void {
    // Thực hiện logic lưu lại thay đổi của sinh viên (có thể là gọi API)
    console.log('Lưu thay đổi cho sinh viên:', student);
    student.hasChanges = false; // Sau khi lưu, đánh dấu lại là không có thay đổi
  }

  // Các phương thức lấy điểm số
  getTheoreticalScore(subjects: Subject[], subjectCode: string): number {
    const subject = subjects.find(sub => sub.subjectCode === subjectCode);
    return subject ? subject.theoreticalScore ?? 0 : 0; // Điểm LT
  }

  getPracticalScore(subjects: Subject[], subjectCode: string): number {
    const subject = subjects.find(sub => sub.subjectCode === subjectCode);
    return subject ? subject.practicalScore ?? 0 : 0; // Điểm TH
  }
}
