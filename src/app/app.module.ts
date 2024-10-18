import { BrowserModule } from '@angular/platform-browser';
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './layout/components/navbar/navbar.component';
import { SidebarComponent } from './layout/components/sidebar/sidebar.component';
import { PagesModule } from './features/pages/pages.module';
import { SharedModule } from './shared/shared.module';
import { ProfileModule } from './features/profile/profile.module';
import { BreadcrumbsComponent } from './layout/components/breadcrumbs/breadcrumbs.component';

import {  LocationStrategy, PathLocationStrategy } from '@angular/common';
import { StudentPerformanceModule } from './features/student-performance/student-performance.module';
import { AuthModule } from './auth/auth.module';
import { StudentComponent } from './features/student-management/student.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    BreadcrumbsComponent,
    StudentComponent
  ],
  imports: [
    BrowserModule,
    AuthModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    PagesModule,
    SharedModule,
    ProfileModule,
    StudentPerformanceModule,
    ToastrModule.forRoot({
      positionClass: 'toast-top-right',
      preventDuplicates: true,
      timeOut: 5000,
      closeButton: true,
      progressBar: true,
    }),
    JwtModule.forRoot({
      config: {
        tokenGetter: tokenGetter,
        allowedDomains: ['localhost:1010'],
        disallowedRoutes: ['localhost:1010/api/auth']
      }
    }),
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  providers: [
   
    { provide: LocationStrategy, useClass: PathLocationStrategy  }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
