import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ExamMarkComponent } from './exam-mark.component';
import { AuthGuard } from 'src/app/core/auth/auth.guard';
import { ExamMarkAllSubjectComponent } from './exam-mark-all-subject/exam-mark-all-subject.component';


const routes: Routes = [
      
      {
        path: 'exam-mark-all-subject/:classID',
        component: ExamMarkAllSubjectComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Exam Marks ALL Subjects', role: 'ROLE_ADMIN' },
      },
      {
        path: 'exam-mark-edit/:classID',
        component: ExamMarkComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Exam Marks', role: 'ROLE_ADMIN' },
      },
    ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamMarkRoutingModule {}