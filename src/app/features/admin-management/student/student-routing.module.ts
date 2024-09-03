// student-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentComponent } from './student.component';
import { StudentAllStatusesComponent } from './student-all-statuses/student-all-statuses.component';
import { StudyingComponent } from './studying/studying.component';
import { DelayComponent } from './delay/delay.component';
import { DropoutComponent } from './dropout/dropout.component';
import { GraduatedComponent } from './graduated/graduated.component';
import { StudentDetailDialogComponent } from './student-detail/student-detail-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: StudentComponent,
    children: [
      {
        path: 'all',
        component: StudentAllStatusesComponent,
        data: { breadcrumb: 'All Students' },
      },
      {
        path: 'studying',
        component: StudyingComponent,
        data: { breadcrumb: 'Students Studying' },
      },
      {
        path: 'delay',
        component: DelayComponent,
        data: { breadcrumb: 'Students Delay' },
      },
      {
        path: 'dropout',
        component: DropoutComponent,
        data: { breadcrumb: 'Students Dropout' },
      },
      {
        path: 'graduated',
        component: GraduatedComponent,
        data: { breadcrumb: 'Students Graduated' },
      },
      {
        path: 'details/:id',
        component: StudentDetailDialogComponent,
        data: { breadcrumb: 'Student Details' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class StudentRoutingModule {}
