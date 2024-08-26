import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClassComponent } from './class/class.component';
import { ExamMarkComponent } from './exam-mark/exam-mark.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CourseComponent } from './course/course.component';
import { SubjectComponent } from './subject/subject.component';
import { TeacherComponent } from '../teacher-management/teacher.component';
import { SroComponent } from '../sro-management/sro.component';
import { StudentComponent } from './student/student.component';

@NgModule({
  declarations: [
    AdminComponent,
    StudentComponent,
    DashboardComponent,
    ClassComponent,
    ExamMarkComponent,
    AccountsComponent,
    AttendanceComponent,
    CalendarComponent,
    CourseComponent,
    SubjectComponent
  ],
  imports: [
    CommonModule,
    RouterModule.forChild([
      { path: '', component: AdminComponent, children: [
        { path: 'dashboard', component: DashboardComponent },
        { path: 'class', component: ClassComponent },
        { path: 'student', component: StudentComponent },
        { path: 'exam-mark', component: ExamMarkComponent },
        { path: 'teacher', component: TeacherComponent },
        { path: 'sro', component: SroComponent },
        { path: 'accounts', component: AccountsComponent },
        { path: 'attendance', component: AttendanceComponent },
        { path: 'calendar', component: CalendarComponent },
        { path: 'course', component: CourseComponent },
        { path: 'subject', component: SubjectComponent },
      ]}
    ])
  ]
})
export class AdminManagementModule { }
