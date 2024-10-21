import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SroManagementRoutingModule } from './sro-management-routing.module';
import { SroComponent } from './sro.component';
import { RouterModule } from '@angular/router';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { PaginationService } from 'ngx-pagination';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [SroComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatSelectModule,
    SroManagementRoutingModule,
    RouterModule,
    MatDialogModule,
    MatTooltipModule,
  ],
  providers: [PaginationService], 
})
export class SroManagementModule {}
