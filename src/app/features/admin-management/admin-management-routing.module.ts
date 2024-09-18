// admin-management-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../../core/auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ExamMarkComponent } from './exam-mark/exam-mark.component';
import { TeacherComponent } from './teacher/teacher.component';
import { CalendarComponent } from './calendar/calendar.component';

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
      import('./student/student-routing.module').then(
        (m) => m.StudentRoutingModule
      ),
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
    loadChildren: () =>
      import('./sro/sro-routing.model').then((m) => m.SroRoutingModule), // Lazy load SroModule
    canActivate: [AuthGuard],
    data: { breadcrumb: 'SRO Management' },
  },

  {
    path: 'accounts',
    loadChildren: () =>
      import('./accounts/accounts-routing.module').then((m) => m.AccountsRoutingModule),
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Accounts' },
  },
  {
    path: 'attendance',
    loadChildren: () =>
      import('./attendance/attendance-routing.module').then(
        (m) => m.AttendanceRoutingModule
      ),
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
    loadChildren: () =>
      import('./course/course-routing.module').then(
        (m) => m.CourseRoutingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'subject',
    loadChildren: () =>
      import('./subject/subject-routing.module').then(
        (m) => m.SubjectRoutingModule
      ),
    canActivate: [AuthGuard],
  },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminManagementRoutingModule {}
