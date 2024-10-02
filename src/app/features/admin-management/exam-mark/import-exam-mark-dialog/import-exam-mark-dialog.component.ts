import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { ExamMarkService } from 'src/app/core/services/admin/exam-mark.service';

@Component({
  selector: 'app-import-exam-mark-dialog',
  templateUrl: './import-exam-mark-dialog.component.html',
  styleUrls: ['./import-exam-mark-dialog.component.scss']
})
export class ImportExamMarkDialogComponent {
  selectedFile: File | null = null;
  selectedClass: number | null; // Thay đổi kiểu dữ liệu về `number` và khởi tạo ở constructor

  constructor(
    private dialogRef: MatDialogRef<ImportExamMarkDialogComponent>,
    private examMarkService: ExamMarkService,
    private toastr: ToastrService,
    @Inject(MAT_DIALOG_DATA) public data: { selectedClass: number } // Nhận dữ liệu từ dialog
  ) {
    this.selectedClass = data.selectedClass; // Lưu giá trị lớp học vào biến
  }

  triggerFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onImportStudentExamScore(): void {
    console.log('Import button clicked');
    if (this.selectedFile && this.selectedClass) {
      console.log('Selected file:', this.selectedFile);
      console.log('Selected class:', this.selectedClass);
      this.examMarkService.importStudentExamScore(this.selectedClass, this.selectedFile).subscribe(
        (response) => {
          console.log('API response:', response);
          this.toastr.success(response.message, 'Import Successful');
          this.dialogRef.close({ reload: true }); // Đóng dialog và gửi tín hiệu để reload dữ liệu
        },
        (error) => {
          console.error('API error:', error);
          this.toastr.error(error.error, 'Import Failed');
        }
      );
    } else {
      console.warn('No file or class selected');
      this.toastr.warning('Please select a file to import.', 'No File Selected');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
