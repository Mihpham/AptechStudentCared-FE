import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { LoginComponent } from './auth/component/login/login.component';
import { RegisterComponent } from './auth/component/register/register.component';
import { AdminComponent } from './features/admin/admin.component';
import { TeacherComponent } from './features/teacher/teacher.component';
import { StudentComponent } from './features/student/student.component';
import { SroComponent } from './features/sro/sro.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { role: 'Admin' }},
  { path: 'sro', component: SroComponent, canActivate: [AuthGuard], data: { role: 'SRO' }},
  { path: 'teacher', component: TeacherComponent, canActivate: [AuthGuard], data: { role: 'Teacher' }},
  { path: 'student', component: StudentComponent, canActivate: [AuthGuard], data: { role: 'Student' }},
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
