import { Component, OnInit, ViewChild } from '@angular/core';
import { ClassResponse } from '../../admin-management/model/class/class-response.model';
// import { StudentResponse } from '../../admin-management/model/student-response.model';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { AuthService } from 'src/app/core/auth/auth.service';
import { MatDialog } from '@angular/material/dialog';
import { ScheduleService } from 'src/app/core/services/admin/schedules.service';
import { ToastrService } from 'ngx-toastr';
import { MatPaginator } from '@angular/material/paginator';
import { Schedule } from '../../admin-management/model/schedules/schedules.model';
import { DayOfWeek } from 'src/app/core/enum/DayOfWeek';
import { SubjectResponse } from '../../admin-management/subject/model/subject-response.model';
import { SubjectService } from 'src/app/core/services/admin/subject.service';
import { CourseResponse } from '../../admin-management/model/course/course-response.model';
import { StudentResponse } from '../../admin-management/model/student-response.model.';

@Component({
  selector: 'app-schedule-student',
  templateUrl: './schedule-student.component.html',
  styleUrls: ['./schedule-student.component.scss']
})
export class ScheduleStudentComponent implements OnInit {
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  classDetails: ClassResponse | null = null;
  schedules: Schedule[] = [];
  currentPage: number = 0;
  itemsPerPage: number = 10;
  currentUserRole!: string | null;
  classId: number | null = null;
  subjectId: number | null = null;
  students: StudentResponse[] = [];
  subjects: SubjectResponse[] = [];
  subjectCodes: string[] = []; // Ensure this is included
  selectedSubject: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private classService: ClassService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog,
    private scheduleService: ScheduleService,
    private toastr: ToastrService,
    private subjectService: SubjectService
  ) { }
  ngOnInit(): void {
    this.currentUserRole = this.authService.getRole();
    this.route.params.subscribe((params) => {
      this.classId = +params['classId'];
      if (this.classId) {
        this.getClassDetails(this.classId);
      } else {
        console.error('Class ID is undefined.');
      }
    });
    this.loadSubjects();
  }

  loadSubjects(): void {
    this.subjectService.getAllSubjects().subscribe(
      (data: SubjectResponse[]) => {
        this.subjects = data;
        this.subjects.forEach(subject => {
          if (typeof subject.createdAt === 'string') {
            subject.createdAt = new Date(subject.createdAt);
          }
        });
        this.subjects.sort((a, b) => (b.createdAt.getTime() - a.createdAt.getTime()));
        
        // Set default subject if available
        if (this.subjects.length > 0) {
          this.selectedSubject = this.subjects[0].subjectCode; // Set default subject
          this.subjectId = this.subjects[0].id; // Set default subject ID
          this.loadSchedules(); // Load schedules for the default subject
        }
      },
      (error) => {
        console.error('Error fetching subjects', error);
      }
    );
  }

  loadSchedules(): void {
    if (this.classId && this.subjectId) {
      this.scheduleService
        .getSchedulesByClassId(this.classId, this.subjectId)
        .subscribe(
          (data) => {
            this.schedules = data;
            console.log('Schedules loaded:', this.schedules);
          },
          (error) => {
            console.error('Error fetching schedules:', error);
          }
        );
    } else {
      console.error('Class ID or Subject ID is undefined.');
    }
  }

  onSubjectChange(event: Event) {
    const subjectCode = (event.target as HTMLSelectElement).value;
    this.selectedSubject = subjectCode;
  
    if (this.subjects && this.selectedSubject) {
      for (const subject of this.subjects) {
        console.log(`Checking subject: ${subject.subjectCode} against selected: ${this.selectedSubject}`);
        
        if (subject.subjectCode === this.selectedSubject) {
          this.subjectId = subject.id;
          console.log(`Subject matched. Subject ID: ${this.subjectId}`);
          
          this.loadSchedules(); // Load schedules based on the selected subject
          break; // Exit the loop once the subject is found
        }
      }
    } else {
      console.error('Subjects list is empty or no subject selected.');
    }
  }
  
  // ngOnInit(): void {
  //   this.currentUserRole = this.authService.getRole();
  //   this.route.params.subscribe((params) => {
  //     this.classId = +params['classId'];
  //     if (this.classId) {
  //       this.getClassDetails(this.classId);
  //     } else {
  //       console.error('Class ID is undefined.');
  //     }
  //   });
  //   this.loadSubjects();
  // }

  getpaginatedSchedules() {
    const start = this.currentPage * this.itemsPerPage;
    return this.schedules.slice(start, start + this.itemsPerPage);
  }

  getSubjectCodeById(subjectId: number | null): string | undefined {
    if (!this.classDetails || !this.classDetails.subjectTeachers) {
      return undefined;
    }
    const subject = this.classDetails.subjectTeachers.find(
      (teacher) => teacher.subjectId === subjectId
    );
    return subject ? subject.subjectCode : undefined;
  }

  onPageChange(event: any) {
    this.currentPage = event.pageIndex;
    this.itemsPerPage = event.pageSize;
  }

  getDaysAsNumbers(days: DayOfWeek[]): string {
    const dayMap: { [key in DayOfWeek]: number } = {
      [DayOfWeek.MONDAY]: 2,
      [DayOfWeek.TUESDAY]: 3,
      [DayOfWeek.WEDNESDAY]: 4,
      [DayOfWeek.THURSDAY]: 5,
      [DayOfWeek.FRIDAY]: 6,
      [DayOfWeek.SATURDAY]: 7,
      [DayOfWeek.SUNDAY]: 8,
    };

    return days.map((day) => dayMap[day]).join(', ');
  }

  getClassDetails(classId: number): void {
    this.classService.findClassById(classId).subscribe(
      (data: ClassResponse) => {
        this.classDetails = data;
        console.log('Class Details:', this.classDetails);
        this.getCourseDetails(this.classDetails.sem);
      },
      (error) => {
        console.error('Error fetching class details:', error);
      }
    );
  }

  // loadSchedules(): void {
  //   if (this.classId && this.subjectId) {
  //     this.scheduleService
  //       .getSchedulesByClassId(this.classId, this.subjectId)
  //       .subscribe(
  //         (data) => {
  //           this.schedules = data;
  //           console.log('Schedules loaded:', this.schedules);
  //         },
  //         (error) => {
  //           console.error('Error fetching schedules:', error);
  //         }
  //       );
  //   } else {
  //     console.error('Class ID or Subject ID is undefined.');
  //   }
  // }

  getCourseDetails(semester: string): void {
    if (this.classDetails) {
      this.subjectCodes = this.classDetails.course.semesters[semester] || [];
      console.log('List of subject codes:', this.subjectCodes);

      // Set default subject if available
      if (this.subjectCodes.length > 0) {
        this.selectedSubject = this.subjectCodes[0]; // Set default subject code
        this.subjectId = this.subjects.find(subject => subject.subjectCode === this.selectedSubject)?.id || null; // Set default subject ID
        this.loadSchedules(); // Load schedules for the default subject
      }
    }
  }

//   onSubjectChange(event: Event) {
//     const subjectCode = (event.target as HTMLSelectElement).value;
//     this.selectedSubject = subjectCode;

//     const selectedSubject = this.subjects.find(subject => subject.subjectCode === this.selectedSubject);
    
//     if (selectedSubject) {
//         this.subjectId = selectedSubject.id;
//         this.loadSchedules(); // Load schedules for the selected subject
//         console.log('Selected Subject ID:', this.subjectId);
//     } else {
//         console.log('Selected subject not found:', this.selectedSubject);
//     }
// }


  // loadSubjects(): void {
  //   console.log('Loading subjects...');
  //   this.subjectService.getAllSubjects().subscribe(
  //     (data: SubjectResponse[]) => {
  //       this.subjects = data;
  //       console.log('Loaded subjects:', this.subjects);
  //       this.subjects.forEach(subject => {
  //         if (typeof subject.createdAt === 'string') {
  //           subject.createdAt = new Date(subject.createdAt);
  //         }
  //       });

  //       this.subjects.sort((a, b) => (b.createdAt.getTime() - a.createdAt.getTime()));
  //     },
  //     (error) => {
  //       console.error('Error fetching subjects', error);
  //     }
  //   );
  // }
}