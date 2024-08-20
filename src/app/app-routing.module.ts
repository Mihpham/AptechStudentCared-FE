import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './core/auth/auth.guard';
import { AdminComponent } from './features/admin/admin.component';
import { TeacherComponent } from './features/teacher/teacher.component';
import { StudentComponent } from './features/student/student.component';
import { SroComponent } from './features/sro/sro.component';

const routes: Routes = [
  //lazy loading routes
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(m => m.AuthModule) },
  { path: 'admin', component: AdminComponent, canActivate: [AuthGuard], data: { role: 'ADMIN' }},
  { path: 'teacher', component: TeacherComponent, canActivate: [AuthGuard], data: { role: 'TEACHER' }},
  { path: 'student', component: StudentComponent, canActivate: [AuthGuard], data: { role: 'USER' }},
  { path: 'sro', component: SroComponent, canActivate: [AuthGuard], data: { role: 'SRO' }},
  { path: '', redirectTo: 'auth/login', pathMatch: 'full' },
  { path: '**', redirectTo: 'auth/login' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],  
  exports: [RouterModule]
})
export class AppRoutingModule {}
