import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SroManagementRoutingModule } from './sro-management-routing.module';
import { SroComponent } from './sro.component';
import { SidebarSroComponent } from 'src/app/layout/components/sidebar-sro/sidebar-sro.component';
import { DashboardComponent } from './dashboard/dashboard.component';



@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [
    SroComponent,
    DashboardComponent,
  ],
  imports: [
    CommonModule,
    SroManagementRoutingModule
  ]
})
export class SroManagementModule { }
