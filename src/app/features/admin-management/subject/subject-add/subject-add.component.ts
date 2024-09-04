import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-subject-add',
  templateUrl: './subject-add.component.html',
  styleUrls: ['./subject-add.component.scss']
})
export class SubjectAddComponent {
  subjectForm: FormGroup;

  constructor(private fb: FormBuilder, public dialogRef: MatDialogRef<SubjectAddComponent>) {
    this.subjectForm = this.fb.group({
      subjectName: ['', Validators.required],
      subjectCode: ['', Validators.required],
      subjectHour: ['', [Validators.required, Validators.min(1)]],
      description: ['']
    });
  }

  ngOnInit(): void {}

  onSubmit(): void {
    if (this.subjectForm.valid) {
      // Add your form submission logic here
      console.log('Subject Data:', this.subjectForm.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
