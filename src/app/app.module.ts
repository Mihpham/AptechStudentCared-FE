import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { JwtModule } from '@auth0/angular-jwt';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { NavbarComponent } from './layout/components/navbar/navbar.component';
import { SidebarComponent } from './layout/components/sidebar/sidebar.component';
import { ProfileComponent } from './features/profile/profile.component';

export function tokenGetter() {
  return localStorage.getItem('token');
}

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    SidebarComponent,
    ProfileComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
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
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
