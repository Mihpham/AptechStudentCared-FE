import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { AdminComponent } from './admin.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ClassComponent } from './class/class.component';
import { ExamMarkComponent } from './exam-mark/exam-mark.component';
import { AccountsComponent } from './accounts/accounts.component';
import { AttendanceComponent } from './attendance/attendance.component';
import { CalendarComponent } from './calendar/calendar.component';
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
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { StudentAddComponent } from './student/student-add/student-add.component';
import { StudentUpdateDialogComponent } from './student/student-update-dialog/student-update-dialog.component';
import { StudentDetailDialogComponent } from './student/student-detail/student-detail-dialog.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { HttpClientModule } from '@angular/common/http';
import { SubjectListComponent } from './subject/subject-list/subject-list.component';
import { SubjectAddComponent } from './subject/subject-add/subject-add.component';
import { SubjectUpdateComponent } from './subject/subject-update/subject-update.component';
import { ConfirmDeleteSubjectComponent } from './subject/confirm-delete-subject/confirm-delete-subject.component';
import { CdkTableModule } from '@angular/cdk/table';
import { FilterDialogComponent } from './class/filter-dialog/filter-dialog.component';
import { CourseComponent } from './course/course.component';
import { CourseAddComponent } from './course/course-add/course-add.component';
import { CourseDetailDialogComponent } from './course/course-detail-dialog/course-detail-dialog.component';
import { CourseUpdateDialogComponent } from './course/course-update-dialog/course-update-dialog.component';
import { LocationSelectorComponent } from '../location-selector/location-selector.component';
import { ClassDetailComponent } from './class/class-detail/class-detail.component';
import { NgxPaginationModule } from 'ngx-pagination';
import { TeacherComponent } from './teacher/teacher.component';
import { SroDialogComponent } from './sro/sro-dialog/sro-dialog.component';
import { SroComponent } from './sro/sro.component';
import { TeacherAddComponent } from './teacher/teacher-add/teacher-add.component';
import { TeacherUpdateComponent } from './teacher/teacher-update/teacher-update.component';
import { TeacherDetailComponent } from './teacher/teacher-detail/teacher-detail.component';
import { AssignTeacherComponent } from './class/assign-teacher/assign-teacher.component';
import { AssignEditComponent } from './class/assign-edit/assign-edit.component';
import { CreateClassComponent } from './class/create-class/create-class.component';
import { UpdateClassComponent } from './class/update-class/update-class.component';
import { ImportStudentDialogComponent } from './student/import-student-dialog/import-student-dialog.component';
import { CommentDialogComponent } from './attendance/comment-dialog/comment-dialog.component';
import { AccountSidebarComponent } from './accounts/account-sidebar/account-sidebar.component';

import { AllAccountComponent } from './accounts/all-account/all-account.component';
import { ScheduleClassComponent } from './schedule/schedule-class/schedule-class.component';
import { ScheduleComponent } from './schedule/schedule.component';
import { AddScheduleComponent } from './schedule/add-schedule/add-schedule.component';
import { UpdateScheduleComponent } from './schedule/update-schedule/update-schedule.component';
import { RegenerateScheduleComponent } from './schedule/regenerate-schedule/regenerate-schedule.component';
import { ImportExamMarkDialogComponent } from './exam-mark/import-exam-mark-dialog/import-exam-mark-dialog.component';
import { ExamMarkAllSubjectComponent } from './exam-mark/exam-mark-all-subject/exam-mark-all-subject.component';
import { FullCalendarModule } from '@fullcalendar/angular';

@NgModule({

  schemas: [CUSTOM_ELEMENTS_SCHEMA],

  declarations: [
    AdminComponent,
    StudentComponent,
    DashboardComponent,
    ClassComponent,
    CalendarComponent,
    ExamMarkComponent,
    AccountsComponent,
    AttendanceComponent,
    CourseComponent,
    SubjectComponent,
    StudyingComponent,
    DropoutComponent,
    DelayComponent,
    GraduatedComponent,
    StudentAllStatusesComponent,
    AttendanceRecordComponent,
    AttendanceClassComponent,
    StudentDetailDialogComponent,
    StudentAddComponent,
    StudentUpdateDialogComponent,
    ClassComponent,
    SubjectListComponent,
    SubjectAddComponent,
    SubjectUpdateComponent,
    ConfirmDeleteSubjectComponent,
    FilterDialogComponent,
    CourseAddComponent,
    CourseDetailDialogComponent,
    CourseUpdateDialogComponent,
    LocationSelectorComponent,
    ClassDetailComponent,
    TeacherComponent,
    SroComponent,
    SroDialogComponent,
    TeacherAddComponent,
    TeacherUpdateComponent,
    TeacherDetailComponent,
    AssignTeacherComponent,
    AssignEditComponent,
    CreateClassComponent,
    UpdateClassComponent,
    ImportStudentDialogComponent,
    CommentDialogComponent,
    AccountSidebarComponent,
    AllAccountComponent,
    ScheduleClassComponent,
    ScheduleComponent,
    AddScheduleComponent,
    UpdateScheduleComponent,
    RegenerateScheduleComponent,
    ImportExamMarkDialogComponent,
    ExamMarkAllSubjectComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    FullCalendarModule,
    AdminManagementRoutingModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatIconModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule,
    CdkTableModule,
    NgxPaginationModule,
  ],


})
export class AdminManagementModule { }
