import { Component, OnInit, Input, Inject } from '@angular/core';
import { TeacherResponse } from '../../model/teacher/teacher-response.model';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { TeacherRequest } from '../../model/teacher/teacher-request.model';
import { TeacherService } from 'src/app/core/services/admin/teacher.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-teacher-update',
  templateUrl: './teacher-update.component.html',
  styleUrls: ['./teacher-update.component.scss']
})
export class TeacherUpdateComponent implements OnInit {
  @Input() teacher!: TeacherResponse;  // Nhận dữ liệu từ component cha hoặc dịch vụ
  teacherForm!: FormGroup;
  teacherId!: number;

  constructor(
    private fb: FormBuilder,
    public dialogRef: MatDialogRef<TeacherUpdateComponent>,
    @Inject(MAT_DIALOG_DATA) public data: TeacherResponse,
    private teacherService: TeacherService,
    private toastr: ToastrService,
  ) {}

  ngOnInit(): void {
    // Kiểm tra xem `teacher` có dữ liệu không
    if (this.data) {
      console.log('Teacher data:', this.data);
      this.teacherId = this.data.id;
  
      // Khởi tạo form với dữ liệu từ `data`
      this.teacherForm = this.fb.group({
        fullName: [this.data.fullName, Validators.required],
        phoneNumber: [this.data.phone, Validators.required], // Đúng lại tên phoneNumber
        dob: [this.data.dob, Validators.required],
        address: [this.data.address, Validators.required],
        gender: [this.data.gender, Validators.required],
        status: [this.data.status, Validators.required],
      });
    } else {
      console.error('Teacher data is not provided');
    }
  }

  onSubmit(): void {
    if (this.teacherForm.valid) {
      const updateTeacher: TeacherRequest = this.teacherForm.value;
      this.teacherService.updateTeacher(this.teacherId, updateTeacher).subscribe(
        (response: TeacherResponse) => {
          this.toastr.success('Teacher updated successfully!');
          this.dialogRef.close({ reload: true });
        },
        (error: any) => {
          this.toastr.error('Error updating teacher: ' + error.message);
        }
      );
    } else {
      this.toastr.error('Please fill out the form correctly.');
    }
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
