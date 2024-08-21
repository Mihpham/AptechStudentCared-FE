import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ErrorComponent } from './error/error.component';
import { PagesRoutingModule } from './pages-routing.module';
import { NotAuthComponent } from './not-auth/not-auth.component';

@NgModule({
  declarations: [
    NotAuthComponent,
    ErrorComponent
  ],
  imports: [
    CommonModule,
    PagesRoutingModule
  ]
})
export class PagesModule { }
