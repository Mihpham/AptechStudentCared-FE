import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { StudentResponse } from '../../admin-management/model/student-response.model.';
import { CourseResponse } from '../../admin-management/model/course/course-response.model';
import { ClassResponse } from '../../admin-management/model/class/class-response.model';
import { Student } from '../../admin-management/model/exam-mark/student.model';
import { HttpClient } from '@angular/common/http';
import { ExamScore } from '../../admin-management/model/exam-mark/exam-score.model';
import { UserProfile } from 'src/app/shared/models/user-profile.model';
import { UserProfileService } from 'src/app/core/services/profile.service';

@Component({
  selector: 'app-exam-mark-student',
  templateUrl: './exam-mark-student.component.html',
  styleUrls: ['./exam-mark-student.component.scss']
})
export class ExamMarkStudentComponent implements OnInit {
  subjects: string[] = [];  
  classId: number | null = null;  
  classDetails: ClassResponse | null = null;  
  terms: { id: number; name: string }[] = [];
  selectedTerm: number | null = null;
  students: Student[] = [];  
  selectedSubject: string | null = null; // Thêm biến này để lưu subject đã chọn

  constructor(private classService: ClassService, private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.terms = [
      { id: 1, name: 'Semester 1' },
      { id: 2, name: 'Semester 2' },
      { id: 3, name: 'Semester 3' },
      { id: 4, name: 'Semester 4' },
    ];

    // Đặt mặc định là kỳ 1
    this.selectedTerm = 1;

    // Lấy classId từ route
    this.route.paramMap.subscribe(params => {
      const classIDParam = params.get('classId');
      this.classId = classIDParam ? Number(classIDParam) : null;

      if (this.classId) {
        this.getClassById(this.classId);
      } else {
        console.error('No classId provided in the URL.');
      }
    });
  }

  getExamScoresByClass(classId: number): void {
    this.http.get<Student[]>(`http://localhost:1010/api/exam-score/${classId}`).subscribe(
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

  getClassById(classId: number): void {
    this.classService.findClassById(classId).subscribe(
      (classResponse: ClassResponse) => {
        this.classDetails = classResponse;  
        this.getCourseByClass(classId); // Lấy danh sách môn học ngay sau khi có thông tin lớp
        this.getExamScoresByClass(classId); // Gọi phương thức để lấy điểm ngay sau khi có thông tin lớp
      },
      error => {
        console.error('Error fetching class details:', error);
      }
    );
  }

  // Lấy danh sách môn học theo lớp
  getCourseByClass(classId: number): void {
    this.classService.findAllSubjectByClassId(classId).subscribe(classResponse => {
      const course: CourseResponse = classResponse;
      this.subjects = [];  

      // Khởi tạo subjects với tất cả các môn học
      Object.keys(course.semesters).forEach(key => {
        const semesterSubjects = course.semesters[key];
        if (semesterSubjects) {
          this.subjects.push(...semesterSubjects);
        }
      });

      // Gọi filterMarks để lấy điểm cho kỳ mặc định (kỳ 1)
      this.filterMarks();
    },
    error => {
      console.error('Error fetching subjects:', error);
    });
  }

  // Lọc môn học theo kỳ đã chọn
  filterMarks(): void {
    if (this.selectedTerm) {
      this.classService.findAllSubjectByClassId(this.classId!).subscribe(classResponse => {
        const course: CourseResponse = classResponse;
        const selectedSemesterKey = `Sem${this.selectedTerm}`;
        const selectedSemesterSubjects = course.semesters[selectedSemesterKey];

        this.subjects = selectedSemesterSubjects ? selectedSemesterSubjects : [];
        this.getExamScoresByClass(this.classId!); // Lấy điểm cho kỳ đã chọn
      },
      error => {
        console.error('Error fetching subjects:', error);
      });
    }
  }

  // Phương thức in điểm của học sinh ra console
  logScores(): void {
    this.students.forEach(student => {
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
  calculateRate(score: number, maxMark: number): number {
    return (score / maxMark) * 100;
  }
  
  determineStatus(score: number, maxMark: number, isProject: boolean): string {
    if (isProject) {
      return score > 50 ? 'Pass' : 'Failed';
    } else {
      if (score < 8) return 'Failed';
      if (score >= 8 && score < 13) return 'Pass';
      if (score >= 13 && score < 18) return 'Credit';
      return 'Distinction';
    }
  }

}

