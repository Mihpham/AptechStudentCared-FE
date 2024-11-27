import { NgModule } from '@angular/core';
import { AuthGuard } from './core/auth/auth.guard';
import { TeacherComponent } from './features/teacher-management/teacher.component';
import { StudentComponent } from './features/student-management/student.component';
import { SroComponent } from './features/sro-management/sro.component';
import { ErrorComponent } from './features/pages/error/error.component';
import { NotAuthComponent } from './features/pages/not-auth/not-auth.component';
import { ProfileComponent } from './features/profile/profile.component';
import { StudentPerformanceComponent } from './features/student-performance/student-performance.component';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  // Lazy loading routes
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: 'admin',
    canActivate: [AuthGuard],
    data: { role: 'ROLE_ADMIN' }, // Changed from 'ADMIN' to 'ROLE_ADMIN'
    loadChildren: () =>
      import('./features/admin-management/admin-management.module').then(
        (m) => m.AdminManagementModule
      ),
  },
  {
    path: 'teacher',
    component: TeacherComponent,
    canActivate: [AuthGuard],
    data: { role: 'ROLE_TEACHER' }, // Changed from 'TEACHER' to 'ROLE_TEACHER'
  },
  {
    path: 'student',
    canActivate: [AuthGuard],
    data: { role: 'ROLE_STUDENT' }, // Kiểm tra vai trò cho sinh viên
    loadChildren: () =>
      import('./features/student-management/student-management.module').then(
        (m) => m.StudentManagementModule
      ),
  }, 

  {
    path: 'sro',
    canActivate: [AuthGuard],
    data: { role: 'ROLE_SRO' }, // Changed from 'SRO' to 'ROLE_SRO'
    loadChildren: () =>
    import('./features/sro-management/sro-management.module').then(
      (m) => m.SroManagementModule
    ),
  },
  { path: 'access-denied', component: NotAuthComponent }, // Route for access denied

  {
    path: 'profile',
    component: ProfileComponent,
    data: { breadcrumb: 'Profile' },
  },
  {
    path: 'student-performance',
    loadChildren: () =>
      import(
        './features/student-performance/student-performance-routing.module'
      ).then((m) => m.StudentPerformanceRoutingModule),
  },

  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: 'error', component: ErrorComponent },
  { path: '**', redirectTo: 'auth/login' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
