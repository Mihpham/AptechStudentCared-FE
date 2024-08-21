import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ErrorComponent } from './error/error.component';
import { NotAuthComponent } from './not-auth/not-auth.component';

const routes: Routes = [
  {
    path: 'not-authorized',
    component: NotAuthComponent
  },
  {
    path: 'error',
    component: ErrorComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class PagesRoutingModule { }
