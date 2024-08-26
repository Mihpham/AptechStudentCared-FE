import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClassComponent } from './class/class.component';
import { ExamMarkComponent } from './exam-mark/exam-mark.component';
import { TeacherComponent } from './teacher/teacher.component';
import { SroComponent } from './sro/sro.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CourseComponent } from './course/course.component';
import { SubjectComponent } from './subject/subject.component';
import { StudentComponent } from '../student-management/student.component';
import { StudentAllStatusesComponent } from './student/student-all-statuses/student-all-statuses.component';
import { StudyingComponent } from './student/studying/studying.component';
import { DelayComponent } from './student/delay/delay.component';
import { DropoutComponent } from './student/dropout/dropout.component';
import { GraduatedComponent } from './student/graduated/graduated.component';
import { AttendanceClassComponent } from './attendance/attendance-class/attendance-class.component';
import { AttendanceRecordComponent } from './attendance/attendance-record/attendance-record.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Admin Dashboard' },
  },
  {
    path: 'class',
    component: ClassComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Class Management' },
  },
  {
    path: 'student',
    component: StudentComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Student Management' },
    children: [
      {
        path: '',
        component: StudentAllStatusesComponent,
        data: { breadcrumb: 'All Student' },
      },
      {
        path: 'studying',
        component: StudyingComponent,
        data: { breadcrumb: 'Student Studying' },
      },
      {
        path: 'delay',
        component: DelayComponent,
        data: { breadcrumb: 'Student Delay' },
      },
      {
        path: 'dropout',
        component: DropoutComponent,
        data: { breadcrumb: 'Student Drop' },
      },
      {
        path: 'graduated',
        component: GraduatedComponent,
        data: { breadcrumb: 'Student Graduated' },
      },
    ],
  },
  {
    path: 'exam-mark',
    component: ExamMarkComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Exam Marks' },
  },
  {
    path: 'teacher',
    component: TeacherComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Teacher Management' },
  },
  {
    path: 'sro',
    component: SroComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'SRO Management' },
  },
  {
    path: 'accounts',
    component: AccountsComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Accounts' },
  },
  {
    path: 'attendance',
    component: AttendanceComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        component: AttendanceClassComponent,
        data: { breadcrumb: 'Attendance' },
      },
      {
        path: 'attendance-record',
        component: AttendanceRecordComponent,
        data: { breadcrumb: 'Attendence Record' },
      },
    ],
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Calendar' },
  },
  {
    path: 'course',
    component: CourseComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Course Management' },
  },
  {
    path: 'subject',
    component: SubjectComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Subject Management' },
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminManagementRoutingModule {}
