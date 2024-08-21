import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RegisterComponent } from './component/register/register.component';
import { LoginComponent } from './component/login/login.component';
import { ForgotPasswordComponent } from './component/forgot-password/forgot-password.component';
import { ResetPasswordOtpComponent } from './component/reset-password-otp/reset-password-otp.component';
import { ResetPasswordComponent } from './component/reset-password/reset-password.component';
import { ResetPasswordSuccessComponent } from './component/reset-password-success/reset-password-success.component';
import { AuthRoutingModule } from './auth-routing.module';

@NgModule({

  declarations: [
    LoginComponent,
    RegisterComponent,
    ForgotPasswordComponent,
    ResetPasswordOtpComponent,
    ResetPasswordComponent,
    ResetPasswordSuccessComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AuthRoutingModule
  ],
  providers: [],
})
export class AuthModule { }
