import { Component } from '@angular/core';
import { AuthService } from 'src/app/core/auth/auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent {

  userData = { username: '', password: '' };

  constructor(private authService: AuthService) {}

  onRegister() {
    this.authService.register(this.userData);
  }
}
