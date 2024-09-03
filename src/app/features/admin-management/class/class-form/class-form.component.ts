import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Class } from '../../model/class.model';
import { AdminService } from 'src/app/core/services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-class-form',
  templateUrl: './class-form.component.html',
  styleUrls: ['./class-form.component.scss']
})
export class ClassFormComponent implements OnInit {
  class: Class = {
    id: 0,
    className: '',
    center: '',
    hour: 0,
    days: '',
    admissionDate: new Date(),
    status: 'STUDYING'
  };
  isEditMode = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private classService: AdminService,
    private toastr: ToastrService
  ) {}

  ngOnInit(): void {
    const classId = +this.route.snapshot.paramMap.get('id')!;
    if (classId) {
      this.isEditMode = true;
      this.classService.findClassById(classId).subscribe(data => {
        this.class = data;
      });
    }
  }

  saveClass(): void {
    if (this.isEditMode) {
      this.classService.updateClass(this.class.id, this.class).subscribe({
        next: () => {
          this.toastr.success('Class updated successfully!', 'Success');
          this.router.navigate(['/admin/class']);
        },
        error: (error) => {
          this.toastr.error('Failed to update class!', 'Error');
          console.error('Update failed', error);
        }
      });
    } else {
      this.classService.addClass(this.class).subscribe({
        next: () => {
          this.toastr.success('Class added successfully!', 'Success');
          this.router.navigate(['/admin/class']);
        },
        error: (error) => {
          this.toastr.error('Failed to add class!', 'Error');
          console.error('Add failed', error);
        }
      });
    }
  }

  onClick(): void {
    this.router.navigate(['/admin/class']);
  }
}
