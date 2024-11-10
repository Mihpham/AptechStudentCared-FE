import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/auth/auth.guard';
import { DashboardComponent } from '../admin-management/dashboard/dashboard.component';
import { TeacherComponent } from '../admin-management/teacher/teacher.component';
import { CalendarComponent } from '../admin-management/calendar/calendar.component';
import { StudentPerformanceComponent } from '../student-performance/student-performance.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { role: 'ROLE_SRO', breadcrumb: 'Sro Dashboard' },
  },
  {
    path: 'class',
    loadChildren: () =>
      import('../admin-management/class/class-routing.module').then(
        (m) => m.ClassRoutingModule
      ),
    canActivate: [AuthGuard],
    data: { role: 'ROLE_SRO', breadcrumb: 'Class' },
  },
  {
    path: 'exam',
    loadChildren: () =>
      import('../admin-management/exam-mark/exam-mark-routing.module').then(
        (m) => m.ExamMarkRoutingModule
      ),
    canActivate: [AuthGuard],
    data: { role: 'ROLE_SRO', breadcrumb: 'Exam-Mark' },
  },
  {
    path: 'student',
    loadChildren: () =>
      import('../admin-management/student/student-routing.module').then(
        (m) => m.StudentRoutingModule
      ),
    canActivate: [AuthGuard],
    data: { role: 'ROLE_SRO' },
  },
  {
    path: 'teacher',
    component: TeacherComponent,
    canActivate: [AuthGuard],
    data: { role: 'ROLE_SRO', breadcrumb: 'Teacher Management' },
  },
  {
    path: 'calendar',
    component: CalendarComponent,
    canActivate: [AuthGuard],
    data: { role: 'ROLE_SRO', breadcrumb: 'Calendar' },
  },
 
  {
    path: 'student-performance/:classId/:studentId',
    component: StudentPerformanceComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Student Performance' }, 
  },
  {
    path: 'schedule',
    loadChildren: () =>
      import('../admin-management/schedule/schedule-routing.module').then(
        (m) => m.ScheduleRoutingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'exam',
    loadChildren: () =>
      import('../admin-management/exam-mark/exam-mark-routing.module').then(
        (m) => m.ExamMarkRoutingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'attendance',
    loadChildren: () =>
      import('../admin-management/attendance/attendance-routing.module').then(
        (m) => m.AttendanceRoutingModule
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
export class SroManagementRoutingModule {}
