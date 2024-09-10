import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SubjectService } from '../../../../core/services/admin/subject.service';
import { SubjectResponse } from '../model/subject-response.model';
import { SubjectRequest } from '../model/subject-request.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subject-update',
  templateUrl: './subject-update.component.html',
  styleUrls: ['./subject-update.component.scss']
})
export class SubjectUpdateComponent implements OnInit {
  subjectForm!: FormGroup;
  subjectId!: number;

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private toastr: ToastrService,
    public dialogRef: MatDialogRef<SubjectUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SubjectResponse
  ) { }

  ngOnInit(): void {
    this.subjectId = this.data.id;
    this.subjectForm = this.fb.group({
      subjectName: [this.data.subjectName, Validators.required],
      subjectCode: [this.data.subjectCode, Validators.required],
      totalHours: [this.data.totalHours, [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.subjectForm.valid) {
      const updatedSubject: SubjectRequest = this.subjectForm.value;
      this.subjectService.updateSubject(this.subjectId, updatedSubject).subscribe(
        response => {
          this.toastr.success('Subject updated successfully!');
          this.dialogRef.close({ reload: true });
        },
        error => {
          this.toastr.error('Error updating subject: ' + error.message);
        }
      );
    } else {
      this.toastr.error('Please fill out the form correctly.');
    }
  }

  onCancel(): void {
    this.dialogRef.close(false); // Notify that update was canceled
  }
}
