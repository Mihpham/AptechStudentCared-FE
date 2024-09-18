import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { TeacherService } from 'src/app/core/services/admin/teacher.service'; // Adjust the import path
import { CourseService } from 'src/app/core/services/admin/course.service'; // Adjust the import path
import { ClassRequest } from '../../model/class/class-request.model';
import { TeacherResponse } from '../../model/teacher/teacher-response.model'; // Adjust the import path
import { CourseResponse } from '../../model/course/course-response.model'; // Adjust the import path
import { Semester } from '../../model/semester/semester.model';

@Component({
  selector: 'app-class-form',
  templateUrl: './class-form.component.html',
  styleUrls: ['./class-form.component.scss'],
})
export class ClassFormComponent implements OnInit {
  class: ClassRequest = {
    id: 0,
    className: '',
    center: '',
    hour: '',
    days: '',
    createdAt: new Date(),
    status: 'STUDYING',
    teacherName: '',
    courseCode: '',
    sem: 'Sem1' // Default semester
  };

  startHour: string = '';
  finishHour: string = '';
  isEditMode: boolean = false;
  formattedDate: string = '';
  classes: WritableSignal<ClassRequest[]> = signal([]); // Signal to hold class list
  selectedDays: string[] = [];
  isLoading = false; // To prevent multiple submissions
  teachers: TeacherResponse[] = [];
  courses: CourseResponse[] = [];
  semesters: Semester[] = [];
  
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private classService: ClassService,
    private teacherService: TeacherService,
    private courseService: CourseService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadInitialData();
    const classId = +this.route.snapshot.paramMap.get('id')!;
    if (classId) {
      this.isEditMode = true;
      this.classService.findClassById(classId).subscribe({
        next: (data) => {
          this.class = data;
          this.selectedDays = this.class.days.split(','); // Populate selectedDays in edit mode
        },
        error: (error) => {
          this.toastr.error('Failed to load class details!', 'Error');
        },
      });
    }
  }

  loadInitialData(): void {
    this.teacherService.getAllTeachers().subscribe({
      next: (data) => {
        this.teachers = data;
      },
      error: (error) => {
        this.toastr.error('Failed to load teachers!', 'Error');
      }
    });

    this.courseService.getAllCourse().subscribe({
      next: (data) => {
        this.courses = data;
      },
      error: (error) => {
        this.toastr.error('Failed to load courses!', 'Error');
      }
    });

    
  }

  toggleDay(event: any): void {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedDays.push(value);
    } else {
      this.selectedDays = this.selectedDays.filter(day => day !== value);
    }
    this.class.days = this.selectedDays.join(',');
  }

  saveClass(): void {
    this.isLoading = true; // Set loading state
    if (this.class.createdAt) {
      this.class.createdAt = new Date(this.class.createdAt);
    }
    this.class.hour = `${this.startHour} - ${this.finishHour}`;

    if (this.isEditMode) {
      // Update class
      this.classService.updateClass(this.class.id, this.class).subscribe({
        next: (response) => {
          this.toastr.success('Class updated successfully!', 'Success');
          this.updateClassInList(this.class); // Update class in the list locally
          this.clearForm(); // Optionally clear the form after update
          this.router.navigate(['/admin/class']);
        },
        error: (error) => {
          this.toastr.error('Failed to update class!', 'Error');
        },
        complete: () => {
          this.isLoading = false; // Reset loading state
        },
      });
    } else {
      // Add new class
      this.classService.addClass(this.class).subscribe({
        next: (response) => {
          this.toastr.success('Class added successfully!', 'Success');
          this.addClassToList(response); // Handle response based on expected format
          this.clearForm(); // Reset form after adding a new class
          this.router.navigate(['/admin/class']);
        },
        error: (error) => {
          if (error.message.includes('Class with this name already exists')) {
            this.toastr.error('Class name already exists!', 'Error');
          } else {
            this.toastr.error('Failed to add class!', 'Error');
          }
        },
        complete: () => {
          this.isLoading = false; // Reset loading state
        },
      });
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading 0
    const day = ('0' + date.getDate()).slice(-2); // Add leading 0
    return `${year}-${month}-${day}`;
  }

  parseDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Adjust month since it's zero-based in Date object
  }

  // Method to add a new class to the local class list
  addClassToList(newClass: ClassRequest): void {
    const updatedClasses = [...this.classes(), newClass]; // Append the new class to the list
    this.classes.set(updatedClasses); // Update signal with new class list
  }

  // Method to update an existing class in the local class list
  updateClassInList(updatedClass: ClassRequest): void {
    const updatedClasses = this.classes().map((classItem) =>
      classItem.id === updatedClass.id ? updatedClass : classItem
    );
    this.classes.set(updatedClasses); // Update signal with modified class
  }

  // Method to clear the form after adding/updating a class
  clearForm(): void {
    this.class = {
      id: 0,
      className: '',
      center: '',
      hour: '',
      days: '',
      createdAt: new Date(),
      status: 'STUDYING',
      teacherName: '',
      courseCode: '',
      sem: 'Sem1' // Default semester
    };
    this.isEditMode = false; // Reset edit mode for next potential entry
  }

  onClosed(): void {
    this.router.navigate(['/admin/class']);
  }
}
