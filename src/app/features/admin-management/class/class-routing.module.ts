// class-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ClassComponent } from './class.component';
import { AuthGuard } from 'src/app/core/auth/auth.guard';
import { ClassDetailComponent } from './class-detail/class-detail.component';
import { AssignTeacherComponent } from './assign-teacher/assign-teacher.component';
import { CreateClassComponent } from './create-class/create-class.component';
import { UpdateClassComponent } from './update-class/update-class.component';


const routes: Routes = [
  {
    path: '',
    component: ClassComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Class List' },
  },
  {
    path: 'create',
    component: CreateClassComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Create Class' },
  },
  {
    path: 'update/:id',
    component: UpdateClassComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Update Class' },
  },
  {
    path: 'assign/:id',
    component: AssignTeacherComponent,
    canActivate: [AuthGuard],
    data: { breadcrumb: 'Assign Class' },
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
