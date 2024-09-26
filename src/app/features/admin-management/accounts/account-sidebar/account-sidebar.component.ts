// accounts-sidebar.component.ts
import { Component, EventEmitter, Output } from '@angular/core';
import { AccountService } from 'src/app/core/services/admin/account.service';

@Component({
  selector: 'app-account-sidebar',
  templateUrl: './account-sidebar.component.html',
  styleUrls: ['./account-sidebar.component.scss']
})
export class AccountSidebarComponent {
  @Output() roleSelected = new EventEmitter<string>();

  // Make roles public and initialize them
  public roles = [
    { name: 'SRO', total: 0 },
    { name: 'Teacher', total: 0 },
    { name: 'Student', total: 0 },
  ];

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.loadTotalAccounts();
  }

  loadTotalAccounts(): void {
    // Fetch total accounts for each role
    this.roles.forEach(role => {
      this.accountService.getTotalAccountsByRole(role.name).subscribe(
        (response: { totalAccount: number }) => {
          role.total = response.totalAccount; // Set total for each role
        },
        (error) => {
          console.error(`Error fetching total accounts for role ${role.name}:`, error);
          role.total = 0; // Set total to 0 on error
        }
      );
    });
  }

  selectRole(role: string): void {
    this.roleSelected.emit(role);
  }
}
