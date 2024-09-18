import { Component, OnInit, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherService } from 'src/app/core/services/admin/teacher.service';
import { ToastrService } from 'ngx-toastr';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-teacher-add',
  templateUrl: './teacher-add.component.html',
  styleUrls: ['./teacher-add.component.scss']
})
export class TeacherAddComponent implements OnInit {
  teacherForm!: FormGroup;
  dropdownOpen = false; // For address selection if needed

  constructor(private fb: FormBuilder,
    private teacherService: TeacherService,
    private toastr: ToastrService,
    private dialogRef: MatDialogRef<TeacherAddComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) { }

  ngOnInit(): void {
    this.teacherForm = this.fb.group({
      fullName: ['', [Validators.required, Validators.minLength(2)]],
      gender: ['', Validators.required],
      phoneNumber: ['', [Validators.required, Validators.pattern('^[0-9]{10}$')]],
      dob: ['', [Validators.required, this.validateAge]],
      address: ['', Validators.required]
    });
  }

  validateAge(control: any) {
    const inputDate = new Date(control.value);
    const today = new Date();
    const age = today.getFullYear() - inputDate.getFullYear();
    if (age < 18) {
      return { invalidAge: true };
    }
    return null;
  }

  onSubmit(): void {
    if (this.teacherForm.valid) {
      this.teacherService.addTeacher(this.teacherForm.value).subscribe({
        next: (response) => {
          this.toastr.success('Teacher added successfully!', 'Success');
          this.dialogRef.close({ reload: true });
        },
        error: (error) => {
          this.toastr.error('Failed to add teacher. Please try again.', 'Error');
          console.error(error);
        }
      });
    } else {
      this.teacherForm.markAllAsTouched();
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
