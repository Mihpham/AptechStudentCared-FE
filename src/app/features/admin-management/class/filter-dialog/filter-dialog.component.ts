import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-filter-dialog',
  templateUrl: './filter-dialog.component.html',
  styleUrls: ['./filter-dialog.component.scss']
})
export class FilterDialogComponent {
  classNameFilter = '';
  statusFilter = 'ALL';

  constructor(public dialogRef: MatDialogRef<FilterDialogComponent>) {}

  applyFilters(): void {
    this.dialogRef.close({
      className: this.classNameFilter,
      status: this.statusFilter
    });
  }

  cancel(): void {
    this.dialogRef.close();
  }
}
