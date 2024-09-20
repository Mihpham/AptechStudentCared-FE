import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { CourseService } from 'src/app/core/services/admin/course.service';
import { ClassRequest } from '../../model/class/class-request.model';
import { CourseResponse } from '../../model/course/course-response.model';
import { ClassResponse } from '../../model/class/class-response.model';
import { DayOfWeek } from 'src/app/core/enum/DayOfWeek';

@Component({
  selector: 'app-update-class',
  templateUrl: './update-class.component.html',
  styleUrls: ['./update-class.component.scss'],
})
export class UpdateClassComponent implements OnInit {
  DayOfWeek = DayOfWeek; // Khai báo để sử dụng trong template

  class: ClassRequest = {
    id: 0,
    className: '',
    center: '',
    hour: '',
    days: [],
    createdAt: new Date(),
    status: 'STUDYING',
    teacherName: '',
    courseCode: '',
    sem: 'Sem1',
  };

  startHour: string = '';
  finishHour: string = '';
  selectedDays: DayOfWeek[] = []; // Kiểu DayOfWeek[]
  isLoading = false;
  courses: CourseResponse[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private classService: ClassService,
    private courseService: CourseService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    const classId = +this.route.snapshot.paramMap.get('id')!;
    if (classId) {
      this.classService.findClassById(classId).subscribe({
        next: (data: ClassResponse) => {
          this.class = {
            id: data.id,
            className: data.className,
            center: data.center,
            hour: data.hour || '',
            days: data.days,
            createdAt: data.createdAt,
            status: data.status,
            sem: data.sem,
            teacherName: data.subjectTeacherMap?.['someSubjectCode'] || '',
            courseCode: data.course?.courseCode || '',
          };

          if (this.class.hour) {
            const [start, finish] = this.class.hour.split(' - ');
            this.startHour = start || '';
            this.finishHour = finish || '';
          }

          this.selectedDays = this.class.days as DayOfWeek[]; // Gán lại selectedDays
        },
        error: () => {
          this.toastr.error('Failed to load class details!', 'Error');
        },
      });
    }
  }

  loadInitialData(): void {
    this.courseService.getAllCourse().subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: () => {
        this.toastr.error('Failed to load courses!', 'Error');
      },
    });
  }

  toggleDay(event: any): void {
    const day = event.target.value as DayOfWeek; // Không cần chuyển đổi thành số
  
    if (event.target.checked) {
      if (!this.selectedDays.includes(day)) {
        this.selectedDays.push(day);
      }
    } else {
      this.selectedDays = this.selectedDays.filter((d) => d !== day);
    }
    this.class.days = this.selectedDays; // Cập nhật danh sách ngày
  }
  

  saveClass(): void {
    this.isLoading = true;
    this.class.hour = `${this.startHour} - ${this.finishHour}`.trim();

    this.classService.updateClass(this.class.id, this.class).subscribe({
      next: () => {
        this.toastr.success('Class updated successfully!', 'Success');
        this.router.navigate(['/admin/class']);
      },
      error: () => {
        this.toastr.error('Failed to update class!', 'Error');
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  onClosed(): void {
    this.router.navigate(['/admin/class']);
  }
}
