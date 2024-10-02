import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudentPerformanceComponent } from './student-performance.component';
import { StudentPerformanceRoutingModule } from './student-performance-routing.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
  declarations: [StudentPerformanceComponent],
  imports: [
    CommonModule,
    StudentPerformanceRoutingModule,
    BrowserModule,
    FormsModule, // Import FormsModule ở đây
    ReactiveFormsModule,
  ],
})
export class StudentPerformanceModule {}
