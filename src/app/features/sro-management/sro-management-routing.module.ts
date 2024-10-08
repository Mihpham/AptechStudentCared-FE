import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from 'src/app/core/auth/auth.guard';
import { DashboardComponent } from './dashboard/dashboard.component';

const routes: Routes = [
 {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    data : {breadcrumb: 'Sro Dashboard'},
 }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SroManagementRoutingModule {}
