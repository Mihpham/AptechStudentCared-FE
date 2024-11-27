import { NgModule } from '@angular/core';
import { Router, RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/auth/auth.guard';
import { ClassStudentDetailComponent } from './class-student-detail/class-student-detail.component';
import { ClassmatesComponent } from './classmates/classmates.component';
import { ExamMarkStudentComponent } from './exam-mark-student/exam-mark-student.component';
import { AttendanceStudentComponent } from './attendance-student/attendance-student.component';
import { StudentAssignmentMarkComponent } from './student-assignment-mark/student-assignment-mark.component';
import { TeachersStudentComponent } from './teachers-student/teachers-student.component';
import { StudentComponent } from './student.component';

const routes: Routes = [
  {
    path: 'dashboard',
    component: StudentComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Student Dashboard' },
  },
  {
    path: 'class-student-detail/:classId',
    component: ClassStudentDetailComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Class Student Detail' },
  },
  {
    path: 'student-classmates/:classId',
    component: ClassmatesComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Classmates' },
  },
  // {
  //   path: 'student-scheduler',
  //   component: SchedulerComponent,
  //   canActivate: [AuthGuard],
  //   data: { breadcrumb: 'Scheduler' },
  // },
  {
    path: 'student-teachers/:classId',
    component: TeachersStudentComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Teachers' },
  },
  {
    path: 'student-exam-mark/:classId',
    component: ExamMarkStudentComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Exam Mark' },
  },
  {
    path: 'student-assignment-mark/:classId',
    component: StudentAssignmentMarkComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Assignment Mark' },
  },
  {
    path: 'student-attendance/:classId',
    component: AttendanceStudentComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Attendance' },
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentManagementRoutingModule {
 
  
}