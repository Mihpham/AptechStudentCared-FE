import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { SroRequest } from '../../model/sro/sro.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-sro-dialog',
  templateUrl: './sro-dialog.component.html',
  styleUrls: ['./sro-dialog.component.scss'],
})
export class SroDialogComponent {
  sroForm: FormGroup;
  provinces: any[] = [];
  districts: any[] = []; // Add this line
  communes: any[] = [];
  constructor(
    private fb: FormBuilder,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<SroDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: SroRequest
  ) {
    this.sroForm = this.fb.group({
      id: [data?.id || null],
      fullName: [data?.fullName || '', Validators.required],
      email: [data?.email || '', [Validators.required, Validators.email]],
      phoneNumber: [data?.phone || '', Validators.required],
      dob: [data?.dob || '', Validators.required],
      status: [data?.status || '', Validators.required],
      province: [''], 
      district: [''],
      commune: [''],
    });
  }

  onSave() {
    if (this.sroForm.valid) {
      const formValues = this.sroForm.value;

      // Combine the full address using names
      const fullAddress = `${formValues.commune}, ${formValues.district}, ${formValues.province}`;

      const sro: SroRequest = {
        ...formValues,
        address: fullAddress,
      };

      this.dialogRef.close(sro);
    } else {
      this.toastr.error('Please fill out the form correctly.');
    }
  }

  onLocationChange(location: {
    province: string;
    district: string;
    commune: string;
  }): void {
    this.sroForm.get('province')?.setValue(location.province);
    this.sroForm.get('district')?.setValue(location.district); // Set name, not code
    this.sroForm.get('commune')?.setValue(location.commune);
  }

  onCancel() {
    this.dialogRef.close();
  }
}
