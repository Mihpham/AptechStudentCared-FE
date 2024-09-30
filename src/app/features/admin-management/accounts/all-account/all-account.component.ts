// all-account.component.ts
import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AccountService } from 'src/app/core/services/admin/account.service';
import { AccountResponse } from '../../model/account/account-response.model';
import { MatDialog } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ActivatedRoute, Router } from '@angular/router';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-all-account',
  templateUrl: './all-account.component.html',
  styleUrls: ['./all-account.component.scss']
})
export class AllAccountComponent implements OnInit, AfterViewInit {
  accounts: AccountResponse[] = [];
  allAccounts: AccountResponse[] = []; // To store all accounts
  
  @Input() selectedRole: string | null = null;

  pageSize: number = 5; // Default page size (number of items per page)
  totalItems: number = 0; // Total number of items for pagination

  displayedColumns: string[] = [
    'stt',
    'email',
    'fullName',
    'role',
    'createdAt',
    'status',
    'actions',
  ];
  dataSource: MatTableDataSource<AccountResponse> =
    new MatTableDataSource<AccountResponse>();

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private accountService: AccountService,
    public dialog: MatDialog,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.loadAllAccounts(); // Load all accounts initially
  }

  ngOnChanges(): void {
    this.loadAccounts(); // Filter accounts when selectedRole changes
  }

  loadAllAccounts(): void {
    this.accountService.getAllAccounts().subscribe(
      (data) => {
        console.log('All accounts received:', data);
        this.allAccounts = data; // Store all accounts
        this.accounts = data; // Initially display all accounts
        this.dataSource.data = this.accounts; // Set data source
        this.totalItems = this.accounts.length; // Update total items for pagination
        this.dataSource.paginator = this.paginator; // Set paginator
      },
      (error) => {
        this.toastr.error('Failed to load accounts', 'Error');
        console.error('Error fetching all accounts', error);
      }
    );
  }
  loadAccounts(): void {
    if (this.selectedRole) {
      this.accountService.getAccountsByRole(this.selectedRole).subscribe(
        (data) => {
          console.log('Data received for role:', data);
          this.accounts = data;
          this.dataSource.data = this.accounts;
          this.totalItems = this.accounts.length; // Update totalItems for pagination
          this.dataSource.paginator = this.paginator;
        },
        (error) => {
          this.toastr.error('Failed to load accounts', 'Error');
          console.error('Error fetching accounts by role', error);
        }
      );
    } else {
      // If no role is selected, you might want to load all accounts or show an empty state.
      this.dataSource.data = [];
    }
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.paginator.page.subscribe(() => {
      this.updateTable();
    });
  }

  updateTable(): void {
    this.dataSource.data = this.accounts; // Ensure data is updated
  }

  getDisplayIndex(index: number): number {
    return (this.paginator.pageIndex * this.paginator.pageSize) + index + 1;
  }

  // Method to update the account status
  updateStatus(accountId: number): void {
    this.accountService.updateAccountStatus(accountId).subscribe(
      (response) => {
        this.toastr.success('Account status updated successfully', 'Success'); // Show success message
        this.loadAllAccounts(); // Refresh the account list to reflect status changes
      },
      (error) => {
        this.toastr.error('Failed to update account status', 'Error');
        console.error('Error updating account status', error);
      }
    );
  }


}
