import { Component, ViewChild } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ToastrService } from 'ngx-toastr';
import { StudentService } from 'src/app/core/services/admin/student.service';

@Component({
  selector: 'app-import-student-dialog',
  templateUrl: './import-student-dialog.component.html',
  styleUrls: ['./import-student-dialog.component.scss']
})
export class ImportStudentDialogComponent {

  selectedFile: File | null = null;

  constructor(
    private dialogRef: MatDialogRef<ImportStudentDialogComponent>,
    private studentService: StudentService,
    private toastr: ToastrService
  ) {}

  triggerFileInput(fileInput: HTMLInputElement): void {
    fileInput.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  onImportStudents(): void {
    if (this.selectedFile) {
      this.studentService.importStudents(this.selectedFile).subscribe(
        (response) => {
          this.toastr.success(response.message, 'Import Successful');
          this.dialogRef.close({ reload: true }); // Close dialog and send a signal to reload data
        },
        (error) => {
          this.toastr.error(error.error, 'Import Failed');
        }
      );
    } else {
      this.toastr.warning('Please select a file to import.', 'No File Selected');
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
