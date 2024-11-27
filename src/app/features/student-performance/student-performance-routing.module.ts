import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { StudentPerformanceComponent } from './student-performance.component'; // Component hiển thị hiệu suất của sinh viên
import { AuthGuard } from 'src/app/core/auth/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: StudentPerformanceComponent,
    children: [
      {
        path: ':userId/:subjectId/:classId',
        component: StudentPerformanceComponent, 
        
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StudentPerformanceRoutingModule {}
