// accounts.component.ts
import { Component } from '@angular/core';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss']
})
export class AccountsComponent {
  selectedRole: string | null = null; // Variable to hold the selected role

  onRoleSelected(role: string): void {
    this.selectedRole = role; // Update the selected role
  }
}
