import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherService } from 'src/app/core/services/admin/teacher.service'; 
import { TeacherResponse } from '../../model/teacher/teacher-response.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assign-edit',
  templateUrl: './assign-edit.component.html',
  styleUrls: ['./assign-edit.component.scss']
})
export class AssignEditComponent implements OnInit {
  form: FormGroup;
  teachers: TeacherResponse[] = []; 

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { subject: string; teacherName: string; status: string },
    private dialogRef: MatDialogRef<AssignEditComponent>,
    private fb: FormBuilder,
    private teacherService: TeacherService, 
    private toastr: ToastrService
  ) {
    this.form = this.fb.group({
      subject: [data.subject, Validators.required],
      teacherName: [data.teacherName, Validators.required], // Gán tên giáo viên hiện tại
      status: [data.status, Validators.required] // Gán trạng thái hiện tại
    });
  }

  ngOnInit(): void {
    this.loadTeachers(); 
  }

  loadTeachers(): void {
    this.teacherService.getAllTeachers().subscribe({
      next: (teachers: TeacherResponse[]) => {
        // Exclude the currently assigned teacher from the dropdown list
        this.teachers = teachers.filter(teacher => teacher.fullName !== this.data.teacherName);
        
        // Tạo một đối tượng giáo viên hiện tại với đầy đủ thuộc tính
        const currentTeacher: TeacherResponse = {
          id: 0, // Thay đổi ID nếu cần
          image: '', // Thay đổi giá trị nếu có
          email: '', // Giá trị thực tế nếu có
          fullName: this.data.teacherName,
          gender: '', // Giá trị thực tế nếu có
          phone: '', // Giá trị thực tế nếu có
          dob: '', // Giá trị thực tế nếu có
          address: '', // Giá trị thực tế nếu có
          status: this.data.status || 'ACTIVE' // Giá trị mặc định nếu cần
        };

        // Thêm giáo viên hiện tại vào danh sách
        this.teachers.unshift(currentTeacher);

        // Tự động chọn giáo viên hiện tại
        this.form.patchValue({ teacherName: currentTeacher.fullName });
      },
      error: (err) => {
        console.error('Error fetching teachers:', err);
      }
    });
  }

  close(): void {
    this.dialogRef.close(); 
  }

  save(): void {
    if (this.form.valid) {
      const updatedData = this.form.value;
      this.dialogRef.close(updatedData); 
    }
  }
}
