import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AccountsComponent } from './accounts.component';
import { AllAccountComponent } from './all-account/all-account.component';

const routes: Routes = [
  {
    path: '',
    component: AccountsComponent,
    data: { breadcrumb: 'All Account' },

    children: [
      {
        path: 'all',
        component: AllAccountComponent,
        data: { breadcrumb: 'All' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class AccountsRoutingModule { }
