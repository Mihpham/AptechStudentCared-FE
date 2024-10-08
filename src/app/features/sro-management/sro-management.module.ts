import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SroManagementRoutingModule } from './sro-management-routing.module';
import { SroComponent } from './sro.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';



@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    SroComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    SroManagementRoutingModule,
    RouterModule // Add RouterModule here
  ]
})
export class SroManagementModule { }
