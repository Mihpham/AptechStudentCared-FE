// admin-management-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClassComponent } from './class/class.component';
import { ExamMarkComponent } from './exam-mark/exam-mark.component';
import { TeacherComponent } from './teacher/teacher.component';
import { SroComponent } from './sro/sro.component';
import { AccountsComponent } from './accounts/accounts.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CourseComponent } from './course/course.component';
import { SubjectComponent } from './subject/subject.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Admin Dashboard' },
  },
  {
    path: 'class',
    loadChildren: () =>
      import('./class/class-routing.module').then((m) => m.ClassRoutingModule),
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Class Management' },
  },
  {
    path: 'student',
    loadChildren: () =>
      import('./student/student-routing.module').then((m) => m.StudentRoutingModule),
    canActivate: [AuthGuard],
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
    loadChildren: () =>
      import('./attendance/attendance-routing.module').then((m) => m.AttendanceRoutingModule),
    canActivate: [AuthGuard],
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
