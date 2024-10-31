import {
  CUSTOM_ELEMENTS_SCHEMA,
  NgModule,
  NO_ERRORS_SCHEMA,
} from '@angular/core';
import { CommonModule } from '@angular/common';

import { StudentManagementRoutingModule } from './student-management-routing.module';
import { RouterModule } from '@angular/router';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { UserProfileService } from 'src/app/core/services/profile.service';
import { ClassStudentDetailComponent } from './class-student-detail/class-student-detail.component';
import { ClassmatesComponent } from './classmates/classmates.component';
import { ExamMarkStudentComponent } from './exam-mark-student/exam-mark-student.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CdkTableModule } from '@angular/cdk/table';
import { NgxPaginationModule } from 'ngx-pagination';
import { AttendanceStudentComponent } from './attendance-student/attendance-student.component';
import { TeachersStudentComponent } from './teachers-student/teachers-student.component';
import { StudentAssignmentMarkComponent } from './student-assignment-mark/student-assignment-mark.component';
import { FullCalendarModule } from '@fullcalendar/angular';
@NgModule({
  schemas: [NO_ERRORS_SCHEMA],
  declarations: [
    ClassStudentDetailComponent,
    ClassmatesComponent,
    ExamMarkStudentComponent,
    AttendanceStudentComponent,
    TeachersStudentComponent,
    StudentAssignmentMarkComponent,
  ],
  imports: [
    CommonModule,
    StudentManagementRoutingModule,
    RouterModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule,
    MatPaginatorModule,
    MatIconModule,
    MatDialogModule,
    MatSelectModule,
    MatOptionModule,
    MatTooltipModule,
    CdkTableModule,
    NgxPaginationModule,
  ],
  providers: [ClassService, UserProfileService],
})
export class StudentManagementModule {}
