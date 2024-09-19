import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SroService } from 'src/app/core/services/admin/sro.service';
import { SroRequest, SroResponse } from '../model/sro/sro.model';
import { SroDialogComponent } from './sro-dialog/sro-dialog.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import Swal from 'sweetalert2';
import { ToastrService } from 'ngx-toastr';
import * as XLSX from 'xlsx';  // Import XLSX for Excel export
import { saveAs } from 'file-saver'; // Import saveAs for saving the file

@Component({
  selector: 'app-sro',
  templateUrl: './sro.component.html',
  styleUrls: ['./sro.component.scss'],
})
export class SroComponent implements OnInit {
  displayedColumns: string[] = [
    'image',
    'fullName',
    'email',
    'phoneNumber',
    'dob',
    'address',
    'status',
    'actions',
  ];
  dataSource = new MatTableDataSource<SroResponse>();
  
  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(
    private sroService: SroService,
    private dialog: MatDialog,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    this.loadSros();
  }

  loadSros(): void {
    this.sroService.getAllSros().subscribe(
      (data) => {
        this.dataSource.data = data;
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      (error) => {
        console.error('Error loading SROs:', error);
        this.toastr.error('Error loading SROs', 'Error');
      }
    );
  }

  openDialog(sro?: SroRequest): void {
    const dialogRef = this.dialog.open(SroDialogComponent, {
      data: sro || {},
      width: '600px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        if (sro) {
          this.sroService.updateSro(sro.id!, result).subscribe(
            () => {
              this.loadSros();
              this.toastr.success('SRO updated successfully', 'Success');
            },
            (error) => {
              if (error.message.includes('Email already exists')) {
                this.toastr.error('Email already exists!', 'Error');
              } else {
                this.toastr.error('Failed to update SRO!', 'Error');
              }
            }
          );
        } else {
          this.sroService.addSro(result).subscribe(
            () => {
              this.loadSros();
              this.toastr.success('SRO added successfully', 'Success');
            },
            (error) => {
              if (error.message.includes('Email already exists')) {
                this.toastr.error('Email already exists!', 'Error');
              } else {
                this.toastr.error('Failed to add SRO!', 'Error');
              }
            }
          );
        }
      }
    });
  }

  deleteSro(id: number): void {
    Swal.fire({
      title: 'Are you sure?',
      text: 'You will not be able to recover this SRO!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        this.sroService.deleteSro(id).subscribe(
          () => {
            this.loadSros();
            Swal.fire('Deleted!', 'SRO has been deleted.', 'success');
          },
          (error) => {
            console.error('Error deleting SRO:', error);
            Swal.fire('Error!', 'There was an issue deleting the SRO.', 'error');
          }
        );
      }
    });
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportToExcel(): void {
    // Create a new worksheet
    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(
      this.dataSource.data.map((sro) => ({
        'Full Name': sro.fullName,
        Email: sro.email,
        'Phone Number': sro.phone,
        'Date of Birth': sro.dob,
        Address: sro.address,
        Status: sro.status,
      }))
    );

    // Create a new workbook
    const wb: XLSX.WorkBook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SROs');

    // Export the workbook
    const excelBuffer: any = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });

    // Save the Excel file using FileSaver
    const data: Blob = new Blob([excelBuffer], { type: 'application/octet-stream' });
    saveAs(data, 'SROs.xlsx');
  }
}
