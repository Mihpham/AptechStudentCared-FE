import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-subject-update',
  templateUrl: './subject-update.component.html',
  styleUrls: ['./subject-update.component.scss']
})
export class SubjectUpdateComponent {
  subjectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<SubjectUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any // Receive data from the dialog open
  ) {
    this.subjectForm = this.fb.group({
      subjectName: [data.subjectName || '', Validators.required],
      subjectCode: [data.subjectCode || '', Validators.required],
      subjectHour: [data.subjectHour || '', [Validators.required, Validators.min(1)]],
      description: [data.description || '']
    });
  }

  ngOnInit(): void { }

  onSubmit(): void {
    if (this.subjectForm.valid) {
      // Add your form submission logic here
      console.log('Updated Subject Data:', this.subjectForm.value);
      // Close the dialog with the form data
      this.dialogRef.close(this.subjectForm.value);
    }
  }

  onCancel(): void {
    // Close the dialog without saving any data
    this.dialogRef.close();
  }
}
