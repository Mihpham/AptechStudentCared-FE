// course-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CourseComponent } from './course.component';
import { CourseDetailDialogComponent } from './course-detail-dialog/course-detail-dialog.component';

const routes: Routes = [
  {
    path: '',
    component: CourseComponent,
    data: { breadcrumb: 'All Course' },
    children: [
      {
        path: 'detail/:id',
        component: CourseDetailDialogComponent,
        data: { breadcrumb: 'Course Detail' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class CourseRoutingModule {}
