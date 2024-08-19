import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  credentials = { username: '', password: '' };

  constructor(private authService: AuthService) {}

  onLogin() {
    this.authService.login(this.credentials);
  }
}
