import { Component, Input } from '@angular/core';
import { ActivatedRoute, Route, Router } from '@angular/router';
import { StudentRequest } from '../../model/studentRequest.model';
import { StudentService } from 'src/app/core/services/admin/student.service';
// Import the Student interface


@Component({
  selector: 'app-student-detail-dialog',
  templateUrl: './student-detail-dialog.component.html',
  styleUrls: ['./student-detail-dialog.component.scss']
})
export class StudentDetailDialogComponent {
  studentId: string | undefined;
  student : StudentRequest | undefined;
  constructor(private studentService: StudentService,
    private route: ActivatedRoute, private router : Router) { }

  ngOnInit(): void {
    this.studentId = this.route.snapshot.paramMap.get('id')!;
    this.fetchStudentDetails(this.studentId);
  }

  fetchStudentDetails(id: string) {
    this.studentService.getStudentById(id).subscribe(
      (data: StudentRequest) => {
        this.student = data;
      },
      (error: any) => {
        console.error('Error fetching student details:', error);
      }
    );

  }
  getAvatarUrl(avatarName: string | undefined): string {
    return `/assets/images/${avatarName}`;
  }

  onClose(): void {
    this.router.navigate(['/admin/student/all']);
  }

}
