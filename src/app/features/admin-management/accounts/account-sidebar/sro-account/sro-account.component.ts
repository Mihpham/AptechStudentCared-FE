// sro-account.component.ts (similar for Teacher/Student)
import { Component, OnInit } from '@angular/core';
import { AccountResponse } from '../../../model/account/account-response.model';
import { AccountService } from 'src/app/core/services/admin/account.service';


@Component({
  selector: 'app-sro-account',
  templateUrl: './sro-account.component.html',
  styleUrls: ['./sro-account.component.scss']
})
export class SroAccountComponent implements OnInit {
  accounts: AccountResponse[] = [];

  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
    this.loadSroAccounts();
  }

  loadSroAccounts(): void {
    this.accountService.getAccountsByRole('SRO').subscribe(
      (data: AccountResponse[]) => {
        this.accounts = data;
      },
      (error) => {
        console.error('Error fetching students by status', error);
      }
    );
  }
}
