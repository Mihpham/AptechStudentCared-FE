import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileComponent } from './profile.component';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [ProfileComponent],
  imports: [
    CommonModule,
    HttpClientModule],
  exports: [ProfileComponent],
})
export class ProfileModule {}
