// attendance-routing.module.ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AttendanceComponent } from './attendance.component';
import { AttendanceClassComponent } from './attendance-class/attendance-class.component';
import { AttendanceRecordComponent } from './attendance-record/attendance-record.component';

const routes: Routes = [
  {
    path: '',
    component: AttendanceComponent,
    children: [
      {
        path: ':id',
        component: AttendanceClassComponent,
        data: { breadcrumb: 'Attendance' },
      },
      {
        path: 'attendance-record',
        component: AttendanceRecordComponent,
        data: { breadcrumb: 'Attendance Record' },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AttendanceRoutingModule {}
