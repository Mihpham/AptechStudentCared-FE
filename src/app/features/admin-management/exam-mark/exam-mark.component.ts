import { Component, OnInit } from '@angular/core';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { ClassResponse } from '../model/class/class-response.model';
import { StudentInClassResponse } from '../model/class/student-in-class-response.model';

@Component({
  selector: 'app-exam-mark',
  templateUrl: './exam-mark.component.html',
  styleUrls: ['./exam-mark.component.scss']
})
export class ExamMarkComponent implements OnInit {
  class: ClassResponse[] = []; 
  selectedClass: string = ''; // Lớp học được chọn
  students: StudentInClassResponse[] = []; 
  displayedColumns: string[] = [];

  constructor(private classService: ClassService) { }

  ngOnInit(): void {
    this.loadClassNames();
  }

  // Phương thức để load danh sách tên các lớp học
  loadClassNames(): void {
    this.classService.findAllClasses().subscribe(
      (classes: ClassResponse[]) => {
        this.class = classes; // Lưu trực tiếp danh sách lớp
      },
      (error) => {
        console.error('Lỗi khi lấy danh sách lớp:', error);
      }
    );
  }

  // Phương thức khi lớp học được chọn
  onClassChange(event: any): void {
    const classId = event.target.value;
    if (classId) {
      this.classService.findClassById(classId).subscribe(
        (classData: ClassResponse) => {
          this.students = classData.students;
  
          // Kiểm tra nếu subjects tồn tại trước khi gọi updateDisplayedColumns
          const subjects = classData.course.semesters[classData.sem];
          if (subjects) {
            this.updateDisplayedColumns(subjects);
          } else {
            this.displayedColumns = ['fullName', 'className']; // Đặt cột mặc định nếu không có môn học
          }
        },
        (error) => {
          console.error('Lỗi khi lấy thông tin lớp:', error);
        }
      );
    }
  
  }

  updateDisplayedColumns(subjects: string[]): void {
    const theoryColumns = subjects.map(subject => `${subject}-LT`);
    const practicalColumns = subjects.map(subject => `${subject}-TH`);
  
    // Đảm bảo rằng 'fullName' và 'className' luôn có trong danh sách cột
    this.displayedColumns = ['fullName', 'className', ...theoryColumns, ...practicalColumns];
  }
  
}

