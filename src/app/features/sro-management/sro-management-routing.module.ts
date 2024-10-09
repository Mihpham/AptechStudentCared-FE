import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/auth/auth.guard';
import { DashboardComponent } from '../admin-management/dashboard/dashboard.component';
import { TeacherComponent } from '../admin-management/teacher/teacher.component';
import { CalendarComponent } from '../admin-management/calendar/calendar.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Sro Dashboard' },
  },
  {
    path: 'class',
    loadChildren: () =>
      import('../admin-management/class/class-routing.module').then(
        (m) => m.ClassRoutingModule
      ),
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Class' },
  },
  {
    path: 'student',
    loadChildren: () =>
      import('../admin-management/student/student-routing.module').then(
        (m) => m.StudentRoutingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'teacher',
    component: TeacherComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Teacher Management' },
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
      import('../admin-management/course/course-routing.module').then(
        (m) => m.CourseRoutingModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: 'subject',
    loadChildren: () =>
      import('../admin-management/subject/subject-routing.module').then(
        (m) => m.SubjectRoutingModule
      ),
    canActivate: [AuthGuard],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SroManagementRoutingModule {}
