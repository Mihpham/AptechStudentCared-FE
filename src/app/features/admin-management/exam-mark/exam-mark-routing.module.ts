import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExamMarkComponent } from './exam-mark.component';
import { AuthGuard } from 'src/app/core/auth/auth.guard';
import { ExamMarkAllSubjectComponent } from './exam-mark-all-subject/exam-mark-all-subject.component';


const routes: Routes = [
      
      {
        path: 'exam-mark-all-subject/:classId',
        component: ExamMarkAllSubjectComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Exam Marks ALL Subjects'},
      },
      {
        path: 'exam-mark-edit/:classId',
        component: ExamMarkComponent,
        canActivate: [AuthGuard],
        data: { breadcrumb: 'Exam Marks'},
      },
    ];


@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ExamMarkRoutingModule {}