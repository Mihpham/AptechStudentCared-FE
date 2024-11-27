import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { ScheduleComponent } from './schedule.component';
import { ScheduleClassComponent } from './schedule-class/schedule-class.component';
import { AddScheduleComponent } from './add-schedule/add-schedule.component';

const routes: Routes = [
  {
    path: '',
    component: ScheduleComponent,
     children: [
      {
        path: ':classId/:subjectId',
        component: ScheduleClassComponent,
        data: { breadcrumb: 'Schedule' },
      },
      {
        path: 'create/:classId/:subjectId',
        component: AddScheduleComponent,
        data: { breadcrumb: 'AddSchedule' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ScheduleRoutingModule { }
