// class-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassComponent } from './class.component';
import { AuthGuard } from 'src/app/core/auth/auth.guard';
import { ClassFormComponent } from './class-form/class-form.component';
import { ClassDetailComponent } from './class-detail/class-detail.component';
import { AssignTeacherComponent } from './assign-teacher/assign-teacher.component';


const routes: Routes = [
  {
    path: '',
    component: ClassComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Class Management' },
  },
  {
    path: 'create',
    component: ClassFormComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Create Class' },
  },
  {
    path: 'assign/:id',
    component: AssignTeacherComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Assign Class' },
  },
  {
    path: 'update/:id',
    component: ClassFormComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Update Class' },
  },
  {
    path: 'class-detail/:id',
    component: ClassDetailComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Class Details' },
  },


];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ClassRoutingModule {}
