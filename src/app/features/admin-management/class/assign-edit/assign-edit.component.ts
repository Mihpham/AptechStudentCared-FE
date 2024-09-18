import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TeacherService } from 'src/app/core/services/admin/teacher.service'; // Đường dẫn chính xác đến TeacherService
import { TeacherResponse } from '../../model/teacher/teacher-response.model';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-assign-edit',
  templateUrl: './assign-edit.component.html',
  styleUrls: ['./assign-edit.component.scss']
})
export class AssignEditComponent implements OnInit {
  form: FormGroup;
  teachers: TeacherResponse[] = []; // Mảng chứa danh sách giáo viên
  
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { subject: string; teacherName: string },
    private dialogRef: MatDialogRef<AssignEditComponent>,
    private fb: FormBuilder,
    private teacherService: TeacherService, // Inject TeacherService
    private toastr: ToastrService

  ) {
    this.form = this.fb.group({
      subject: [data.subject, Validators.required],
      teacherName: [null, Validators.required] // Sử dụng null cho dropdown
    });
  }

  ngOnInit(): void {
    this.loadTeachers(); // Gọi hàm loadTeachers khi khởi tạo component
  }

  loadTeachers(): void {
    this.teacherService.getAllTeachers().subscribe({
      next: (teachers: TeacherResponse[]) => {
        // Exclude the currently assigned teacher from the dropdown list
        this.teachers = teachers.filter(teacher => teacher.fullName !== this.data.teacherName);
        
        // If a teacher is currently assigned, pre-select them in the form (optional)
        const currentTeacher = this.teachers.find(teacher => teacher.fullName === this.data.teacherName);
        if (currentTeacher) {
          this.form.patchValue({ teacherName: currentTeacher });
        }
      },
      error: (err) => {
        console.error('Error fetching teachers:', err);
      }
    });
  }

  close(): void {
    this.dialogRef.close(); // Close the dialog
  }

  save(): void {
    if (this.form.valid) {
      const updatedData = this.form.value;
      
      this.dialogRef.close(updatedData); // Return updated data
      this.toastr.success('Assign successfully')

    }

  }
}
