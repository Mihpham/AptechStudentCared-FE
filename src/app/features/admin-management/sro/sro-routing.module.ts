import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { SroComponent } from './sro.component';  // Import your component
import { SroDialogComponent } from './sro-dialog/sro-dialog.component';
import { ReactiveFormsModule } from '@angular/forms';


const routes: Routes = [
  {
    path: '',
    component: SroComponent,
    data: { breadcrumb: 'All SRO' },

    children: [
      {
        path: 'dialog',
        component: SroDialogComponent,  // Điều hướng đến dialog nếu cần
      },
    ],
  },
];

@NgModule({
  imports: [ReactiveFormsModule, RouterModule.forChild(routes)],
  exports: [RouterModule],

})
export class SroRoutingModule {}
