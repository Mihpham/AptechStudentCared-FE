import { Component, OnInit } from '@angular/core';
import { Class } from '../model/class.model';
import { AdminService } from 'src/app/core/services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-class',
  templateUrl: './class.component.html',
  styleUrls: ['./class.component.scss']
})
export class ClassComponent implements OnInit {
  classes: Class[] = [];

  constructor(
    private classService: AdminService,
    private toastr: ToastrService // Inject ToastrService
  ) {}

  ngOnInit(): void {
    this.loadClasses();
  }

  loadClasses(): void {
    this.classService.findAllClasses().subscribe({
      next: (data) => {
        this.classes = data;
        this.toastr.success('Classes loaded successfully!', 'Success');
      },
      error: (error) => {
        this.toastr.error('Failed to load classes!', 'Error');
        console.error('Load classes failed', error);
      }
    });
  }

  deleteClass(id: number): void {
    if (confirm('Are you sure you want to delete this class?')) { // Confirm before deleting
      this.classService.deleteClass(id).subscribe({
        next: () => {
          this.toastr.success('Class deleted successfully!', 'Success');
          this.loadClasses(); // Reload classes after successful deletion
        },
        error: (error) => {
          this.toastr.error('Failed to delete class!', 'Error');
          console.error('Delete class failed', error);
        }
      });
    }
  }
}
