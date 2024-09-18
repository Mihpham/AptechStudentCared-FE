import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { AccountResponse } from '../model/accounts-response.model';
import { MatPaginator } from '@angular/material/paginator';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from 'src/app/core/services/admin/account.service';

@Component({
  selector: 'app-accounts-list',
  templateUrl: './accounts-list.component.html',
  styleUrls: ['./accounts-list.component.scss']
})
export class AccountsListComponent implements OnInit {
  displayedColumns: string[] = ['id', 'username', 'createdAt', 'updatedAt', 'status', 'action'];
  dataSource = new MatTableDataSource<AccountResponse>([]);
  searchTerm: string = '';
  totalAccounts: number = 0;

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private router: Router,
    private accountService: AccountService,
    private dialog: MatDialog,
    private cdr: ChangeDetectorRef,
    private toastr: ToastrService,
  ) { }

  ngOnInit(): void {
    //test data
    this.fetchAccounts();

    //call API
    // this.loadAccounts();
  }

  fetchAccounts(): void {
    const accounts: AccountResponse[] = [
      { id: 1, username: 'toandv', createdAt: '24-03-2024 12:12', updatedAt: '24-03-2024 14:49', status: 'Lock', action: false },
      { id: 2, username: 'quangdv', createdAt: '24-03-2024 12:12', updatedAt: '24-03-2024 14:49', status: 'Active', action: true },
      { id: 3, username: 'trongdv', createdAt: '24-03-2024 12:12', updatedAt: '24-03-2024 14:49', status: 'Active', action: true },
      { id: 4, username: 'minhpq', createdAt: '24-03-2024 12:12', updatedAt: '24-03-2024 14:49', status: 'Active', action: true },
      { id: 5, username: 'hoibt', createdAt: '24-03-2024 12:12', updatedAt: '24-03-2024 14:49', status: 'Active', action: true },
      { id: 6, username: 'username', createdAt: '24-03-2024 12:12', updatedAt: '24-03-2024 14:49', status: 'Lock', action: false },
      { id: 7, username: 'username', createdAt: '24-03-2024 12:12', updatedAt: '24-03-2024 14:49', status: 'Active', action: true },
      { id: 8, username: 'username', createdAt: '24-03-2024 12:12', updatedAt: '24-03-2024 14:49', status: 'Active', action: true },
      { id: 9, username: 'username', createdAt: '24-03-2024 12:12', updatedAt: '24-03-2024 14:49', status: 'Active', action: true },
      { id: 10, username: 'username', createdAt: '24-03-2024 12:12', updatedAt: '24-03-2024 14:49', status: 'Lock', action: false },
      { id: 11, username: 'username', createdAt: '24-03-2024 12:12', updatedAt: '24-03-2024 14:49', status: 'Lock', action: false },
      { id: 12, username: 'username', createdAt: '24-03-2024 12:12', updatedAt: '24-03-2024 14:49', status: 'Active', action: true },
      { id: 13, username: 'username', createdAt: '24-03-2024 12:12', updatedAt: '24-03-2024 14:49', status: 'Active', action: true },
      { id: 14, username: 'username', createdAt: '24-03-2024 12:12', updatedAt: '24-03-2024 14:49', status: 'Active', action: true },
      { id: 15, username: 'username', createdAt: '24-03-2024 12:12', updatedAt: '24-03-2024 14:49', status: 'Active', action: true },
    ];

    this.dataSource.data = accounts;
    this.dataSource.paginator = this.paginator;
    this.cdr.detectChanges();
  }


  // loadSubjects(): void {
  //   console.log('Loading account...');
  //   this.accountService.getAllAccounts().subscribe(
  //     (data: AccountResponse[]) => {
  //       console.log('Loaded subjects:', data);

  //       data.forEach(account => {
  //         // if (typeof account.createdAt === 'string') {
  //         //   account.createdAt = new Date(account.createdAt);
  //         // }
  //       });

  //       // data.sort((a, b) => (b.createdAt.getTime() - a.createdAt.getTime()));

  //       this.dataSource.data = [...data]; // Thay thế dữ liệu cũ
  //       this.totalAccounts = data.length;
  //       this.dataSource.paginator = this.paginator;
  //       this.applyFilter(this.searchTerm); // Apply the filter after loading data
  //     },
  //     (error) => {
  //       console.error('Error fetching subjects', error);
  //     }
  //   );
  // }

  onActionToggle(row: AccountResponse): void {
    // Update the status of the account based on the action toggle
    // Replace this with your actual API call to update the status
    console.log('Action toggled for:', row);
    row.action = !row.action;
  }

  onAdd(): void {
    // const dialogRef = this.dialog.open(SubjectAddComponent, {
    //   width: '400px'
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result && result.reload) {
    //     this.loadSubjects(); // Reload data if needed
    //   }
    // });
  }

  onUpdate(account: AccountResponse): void {
    // const dialogRef = this.dialog.open(SubjectUpdateComponent, {
    //   width: '400px',
    //   data: account
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result && result.reload) {
    //     this.loadSubjects(); // Reload data if needed
    //   }
    // });
  }

  onDelete(id: number,  row: AccountResponse): void {
    // Open a confirmation dialog to delete account
    // const dialogRef = this.dialog.open(ConfirmDeleteSubjectComponent, {
    //   width: '300px',
    //   data: { id: row.id, username: row.username }
    // });

    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.accountService.deleteAccount(id).subscribe(
    //       () => {
    //         // Delete account  from the current list
    //         const updatedData = this.dataSource.data.filter(item => item.id !== row.id);
    //         this.dataSource.data = updatedData;
    //         this.totalAccounts = updatedData.length;
    //         this.toastr.success(`Delete account ${row.username} successfully`);
    //       },
    //       error => {
    //         console.error('Error deleting account:', error);
    //         this.toastr.error('Delete account  failed');
    //       }
    //     );
    //   }
    // });
  }
}
