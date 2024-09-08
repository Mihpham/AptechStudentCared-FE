import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { SubjectService } from '../../../../core/services/admin/subject.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-subject-add',
  templateUrl: './subject-add.component.html',
  styleUrls: ['./subject-add.component.scss']
})
export class SubjectAddComponent {
  subjectForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private subjectService: SubjectService,
    private dialogRef: MatDialogRef<SubjectAddComponent>,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.subjectForm = this.fb.group({
      subjectName: ['', Validators.required],
      subjectCode: ['', Validators.required],
      totalHours: ['', [Validators.required, Validators.min(1)]]
    });
  }

  onSubmit(): void {
    if (this.subjectForm.valid) {
      this.subjectService.addSubject(this.subjectForm.value).subscribe(
        response => {
          console.log('Dialog closing with success');
          this.dialogRef.close({ reload: true });// Indicate success
          this.toastr.success('Subject added successfully!');
        },
        error => {
          this.toastr.error('An error occurred: ' + error.message);
        }
      );
    } else {
      this.toastr.warning('Please fill out the form correctly.');
    }
  }
  
  onCancel(): void {
    console.log('Dialog closed with cancel');
    this.dialogRef.close(false); // Indicate cancellation
  }
  
}
