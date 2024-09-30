import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-comment-dialog',
  templateUrl: './comment-dialog.component.html',
})
export class CommentDialogComponent {
  comment: string = '';

  constructor(
    public dialogRef: MatDialogRef<CommentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { studentId: number; sessionId: number; comment: string }
  ) {
    this.comment = data.comment; // Load existing comment if available
  }

  onCancel(): void {
    this.dialogRef.close(); // Close without returning data
  }

  onSave(): void {
    this.dialogRef.close(this.comment); // Close and return the updated comment
  }
}
