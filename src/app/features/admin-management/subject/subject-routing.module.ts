// student-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SubjectListComponent } from './subject-list/subject-list.component';
import { SubjectComponent } from './subject.component';
import { SubjectAddComponent } from './subject-add/subject-add.component';
import { SubjectUpdateComponent } from './subject-update/subject-update.component';

const routes: Routes = [
  {
    path: '',
    component: SubjectComponent,
    children: [
      {
        path: '',
        component: SubjectListComponent,
        data: { breadcrumb: 'All Subject' },
      },
      {
        path: 'add',
        component: SubjectAddComponent,
        data: { breadcrumb: 'Add Subject' },
      },
      {
        path: 'update/:id',
        component: SubjectUpdateComponent,
        data: { breadcrumb: 'Update Subject' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubjectRoutingModule {}
