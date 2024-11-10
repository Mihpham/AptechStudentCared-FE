import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ClassService } from 'src/app/core/services/admin/class.service';
import { StudentResponse } from '../../admin-management/model/student-response.model.';
import { ClassResponse } from '../../admin-management/model/class/class-response.model';

@Component({
  selector: 'app-student-assignment-mark',
  templateUrl: './student-assignment-mark.component.html',
  styleUrls: ['./student-assignment-mark.component.scss']
})
export class StudentAssignmentMarkComponent implements OnInit {
  classId: number | null = null;
  subjectId: number | null = null;

  classDetails: ClassResponse | null = null;
  students: StudentResponse[] = [];

  constructor(
    private route: ActivatedRoute,
    private classService: ClassService,
    private router: Router,
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('classId');
      this.classId = id ? +id : null;
      if (this.classId) {
        this.getClassDetails(this.classId);
      } else {
        console.error('Class ID is undefined or invalid.');
      }
    });
  }

  getAvatarUrl(avatarName: string | undefined): string {
    return `/assets/images/${avatarName}`;
  }



  getClassDetails(id: number): void {
    this.classService.findClassById(id).subscribe(
      (data) => {
        this.classDetails = data;
        this.students =
          data.students?.map((student: any) => ({
            userId: student.userId,
            image: student.image
              ? student.image
              : 'assets/images/avatar-default.webp',
              classId : student.classId,
            rollNumber: student.rollNumber,
            fullName: student.fullName,
            password: student.password,
            email: student.email,
            dob: student.dob,
            address: student.address,
            className: student.className,
            gender: student.gender,
            phoneNumber: student.phoneNumber,
            courses: student.courses,
            status: student.status,
            parentFullName: student.parentFullName,
            studentRelation: student.studentRelation,
            parentPhone: student.parentPhone,
            parentGender: student.parentGender,
          })) ?? [];
      },
      (error) => {
        console.error('Error fetching class details:', error);
      }
    );
  }

  loadStudent(): void {
    if (this.classId) {
      this.getClassDetails(this.classId);
    }
  }

  

  
}

