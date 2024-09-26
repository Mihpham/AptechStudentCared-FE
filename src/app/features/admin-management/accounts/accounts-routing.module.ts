import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts.component';
import { AllAccountComponent } from './all-account/all-account.component';
import { SroAccountComponent } from './account-sidebar/sro-account/sro-account.component';
import { StudentAccountComponent } from './account-sidebar/student-account/student-account.component';
import { TeacherAccountComponent } from './account-sidebar/teacher-account/teacher-account.component';

const routes: Routes = [
  {
    path: '',
    component: AccountsComponent,
    children: [
      {
        path: 'all',
        component: AllAccountComponent,
        data: { breadcrumb: 'All Account' },
      },
      {
        path: 'sro',
        component: SroAccountComponent,
        data: { breadcrumb: 'SRO Account' },
      },
      {
        path: 'teacher',
        component: TeacherAccountComponent,
        data: { breadcrumb: 'Teacher Account' },
      },
      {
        path: 'student',
        component: StudentAccountComponent,
        data: { breadcrumb: 'Student Account' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
