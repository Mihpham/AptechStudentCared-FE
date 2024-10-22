import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { CourseService } from 'src/app/core/services/admin/course.service';
import { ClassRequest } from '../../model/class/class-request.model';
import { CourseResponse } from '../../model/course/course-response.model';
import { DayOfWeek } from 'src/app/core/enum/DayOfWeek';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-create-class',
  templateUrl: './create-class.component.html',
  styleUrls: ['./create-class.component.scss'],
})
export class CreateClassComponent implements OnInit {
  public DayOfWeek = DayOfWeek;
  isEditMode: boolean = false;

  class: ClassRequest = {
    id: 0,
    className: '',
    center: '',
    startHour: '',
    endHour: '',
    days: [],
    createdAt: new Date(),
    status: 'STUDYING',
    teacherName: '',
    courseCode: '',
    sem: 'Sem1',
  };

  startHour: string = '';
  finishHour: string = '';
  selectedDays: Set<DayOfWeek> = new Set();
  isLoading = false;
  courses: CourseResponse[] = [];
  classes: WritableSignal<ClassRequest[]> = signal([]);

  constructor(
    private router: Router,
    private classService: ClassService,
    private authService: AuthService,
    private courseService: CourseService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
  }

  loadInitialData(): void {
    this.currentUserRole = this.authService.getRole();

    this.courseService.getAllCourse().subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (error) => {
        this.toastr.error('Failed to load courses!', 'Error');
      },
    });
  }

  toggleDay(event: any): void {
    const value: DayOfWeek = event.target.value as DayOfWeek;
    if (event.target.checked) {
      this.selectedDays.add(value);
    } else {
      this.selectedDays.delete(value);
    }
    this.updateDaysInput();
  }

  updateDaysInput(): void {
    this.class.days = Array.from(this.selectedDays); // Cập nhật days trong class
  }

  saveClass(): void {
    this.isLoading = true;
    this.class.startHour = this.startHour;
    this.class.endHour = this.finishHour;

    this.classService.addClass(this.class).subscribe({
      next: (response) => {
        this.toastr.success('Class added successfully!', 'Success');
        this.addClassToList(response);
        this.clearForm();
        this.currentUserRole === 'ROLE_ADMIN'
          ? this.router.navigate(['/admin/class'])
          : this.router.navigate(['/sro/class']);
      },
      error: (error) => {
        if (error.message.includes('Class with this name already exists')) {
          this.toastr.error('Class name already exists!', 'Error');
        } else {
          this.toastr.error('Failed to add class!', 'Error');
        }
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  addClassToList(newClass: ClassRequest): void {
    const updatedClasses = [...this.classes(), newClass];
    this.classes.set(updatedClasses);
  }

  clearForm(): void {
    this.class = {
      id: 0,
      className: '',
      center: '',
      startHour: '',
      endHour: '',
      days: [],
      createdAt: new Date(),
      status: 'STUDYING',
      teacherName: '',
      courseCode: '',
      sem: 'Sem1',
    };
    this.selectedDays.clear();
    this.updateDaysInput(); // Đảm bảo ô input cũng được cập nhật
  }
  currentUserRole!: string | null;

  onClosed(): void {
    this.currentUserRole === 'ROLE_ADMIN'
      ? this.router.navigate(['/admin/class'])
      : this.router.navigate(['/sro/class']);
  }
}
