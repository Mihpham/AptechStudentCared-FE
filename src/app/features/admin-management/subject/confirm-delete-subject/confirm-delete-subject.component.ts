import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-delete-subject',
  templateUrl: './confirm-delete-subject.component.html',
  styleUrls: ['./confirm-delete-subject.component.scss']
})
export class ConfirmDeleteSubjectComponent {
  constructor(private dialogRef: MatDialogRef<ConfirmDeleteSubjectComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true); // Trả về true khi xác nhận xóa
  }

  onCancel(): void {
    this.dialogRef.close(false); // Trả về false khi hủy
  }
}
