import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClassComponent } from './class/class.component';
import { ExamMarkComponent } from './exam-mark/exam-mark.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { CalendarComponent } from './calendar/calendar.component';
import { CourseComponent } from './course/course.component';
import { SubjectComponent } from './subject/subject.component';
import { StudentComponent } from './student/student.component';
import { StudyingComponent } from './student/studying/studying.component';
import { DropoutComponent } from './student/dropout/dropout.component';
import { DelayComponent } from './student/delay/delay.component';
import { GraduatedComponent } from './student/graduated/graduated.component';
import { StudentAllStatusesComponent } from './student/student-all-statuses/student-all-statuses.component';
import { AttendanceRecordComponent } from './attendance/attendance-record/attendance-record.component';
import { AttendanceClassComponent } from './attendance/attendance-class/attendance-class.component';
import { AdminManagementRoutingModule } from './admin-management-routing.module';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { StudentDetailDialogComponent } from './student/student-detail-dialog/student-detail-dialog.component';
import { MatDialogModule } from '@angular/material/dialog';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  declarations: [
    AdminComponent,
    StudentComponent,
    DashboardComponent,
    ClassComponent,
    ExamMarkComponent,
    AccountsComponent,
    AttendanceComponent,
    CalendarComponent,
    CourseComponent,
    SubjectComponent,
    StudyingComponent,
    DropoutComponent,
    DelayComponent,
    GraduatedComponent,
    StudentAllStatusesComponent,
    AttendanceRecordComponent,
    AttendanceClassComponent,
    StudentDetailDialogComponent
  ],
  imports: [
    CommonModule,
    AdminManagementRoutingModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatIconModule,
    MatDialogModule,
  ]
})
export class AdminManagementModule { }
