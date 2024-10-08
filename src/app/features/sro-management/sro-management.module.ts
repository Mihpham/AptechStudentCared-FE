import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SroManagementRoutingModule } from './sro-management-routing.module';
import { SroComponent } from './sro.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [SroComponent, DashboardComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SroManagementRoutingModule,
    RouterModule,
    MatDialogModule,
    MatTooltipModule,

  ],
})
export class SroManagementModule {}
