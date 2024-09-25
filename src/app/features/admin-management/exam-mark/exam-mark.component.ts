import { Component, OnInit } from '@angular/core';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { ClassResponse } from '../model/class/class-response.model';
import { Student } from '../model/exam-mark/student.model';
import { HttpClient } from '@angular/common/http';
import { CourseResponse } from '../model/course/course-response.model';
import { Subject } from '../model/exam-mark/subject.model';
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
  subjects: string[] = []; // Danh sách mã môn học (Subject[])
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
    // Giới hạn điểm lý thuyết
    if (this.tempScores[student.rollNumber].theoretical > 20) {
      this.tempScores[student.rollNumber].theoretical = 20;
    }

    // Giới hạn điểm thực hành
    if (this.tempScores[student.rollNumber].practical > 20) {
      this.tempScores[student.rollNumber].practical = 20;
    }

    // Đánh dấu rằng có sự thay đổi để cho phép nút lưu
    student.hasChanges = true;
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


  // Tính toán kết quả dựa trên điểm LT và TH
  calculateResult(student: Student): string {
    const theoreticalScore = this.getTheoreticalScore(student.subjects, this.selectedSubject || '');
    const practicalScore = this.getPracticalScore(student.subjects, this.selectedSubject || '');

    // Tạo một mảng chứa điểm lý thuyết và thực hành
    const scores = [theoreticalScore, practicalScore];

    // Kiểm tra các trường hợp khác nhau
    if (scores.every(score => score < 8)) {
      return 'Fail'; // Cả 2 môn đều dưới 8 điểm
    } else if (scores.every(score => score >= 8 && score <= 11)) {
      return 'Pass'; // Cả 2 môn từ 8 đến 11 điểm
    } else if (scores.every(score => score >= 12 && score <= 14)) {
      return 'Credit'; // Cả 2 môn từ 12 đến 14 điểm
    } else if (scores.every(score => score >= 15)) {
      return 'Distinction'; // Cả 2 môn từ 15 trở lên
    } else {
      // Nếu không thuộc trường hợp nào ở trên, kiểm tra điểm thấp hơn
      const minScore = Math.min(...scores);
      if (minScore < 8) {
        return 'Fail'; // Một trong hai điểm dưới 8
      } else if (minScore >= 8 && minScore <= 11) {
        return 'Pass'; // Điểm thấp hơn từ 8 đến 11
      } else if (minScore >= 12 && minScore <= 14) {
        return 'Credit'; // Điểm thấp hơn từ 12 đến 14
      } else {
        return 'Distinction'; // Điểm thấp hơn từ 15 trở lên
      }
    }
  }

  getResultClass(result: string): string {
    switch (result) {
      case 'Fail':
        return 'text-red-600'; // Màu đỏ
      case 'Pass':
        return 'text-yellow-500'; // Màu cam
      case 'Credit':
        return 'text-green-500'; // Màu xanh lá
      case 'Distinction':
        return 'text-blue-500'; // Màu xanh lam
      default:
        return ''; // Không có lớp
    }
  }


  // Lưu thay đổi khi bấm nút Save
  saveChanges(student: Student) {
    const updatedScore = this.tempScores[student.rollNumber];
    const scoreData = {
      rollNumber: student.rollNumber,
      subjectCode: this.selectedSubject,
      theoreticalScore: updatedScore.theoretical,
      practicalScore: updatedScore.practical
    };

    if (this.selectedClass !== null) {
      this.examMarkService.updateStudentExamScore(this.selectedClass, scoreData).subscribe({
        next: (response) => {
          student.hasChanges = false; // Đặt lại cờ sau khi lưu thành công
          this.toastr.success('Update mark success!', 'Success');
        },
        error: (error) => {
          this.toastr.error('An error occurred while updating mark.', 'Fail');
        }
      });
    } else {
      // Handle case where `selectedClass` is `null`
      this.toastr.warning('Please select a class first.', 'Warning');
    }

  }

  // Các phương thức lấy điểm số
  getTheoreticalScore(subjects: Subject[], subjectCode: string): number {
    const subject = subjects.find(sub => sub.subjectCode === subjectCode);
    return subject ? subject.theoreticalScore ?? 0 : 0; // Fallback to 0 if `theoreticalScore` is null
  }

  getPracticalScore(subjects: Subject[], subjectCode: string): number {
    const subject = subjects.find(sub => sub.subjectCode === subjectCode);
    return subject ? subject.practicalScore ?? 0 : 0; // Fallback to 0 if `practicalScore` is null
  }
}
