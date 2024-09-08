import { Component, OnInit, WritableSignal, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Class } from '../../model/class.model';
import { AdminService } from 'src/app/core/services/admin.service';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-class-form',
  templateUrl: './class-form.component.html',
  styleUrls: ['./class-form.component.scss'],
})
export class ClassFormComponent implements OnInit {
  class: Class = {
    id: 0,
    className: '',
    center: '',
    hour: '',
    days: '',
    admissionDate: new Date(),
    status: 'STUDYING',
  };

  startHour: string = '';
  finishHour: string = '';
  isEditMode: boolean = false;
  formattedDate: string = '';
  classes: WritableSignal<Class[]> = signal([]); // Signal to hold class list
  selectedDays: string[] = [];
  isLoading = false; // To prevent multiple submissions

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
      this.classService.findClassById(classId).subscribe({
        next: (data) => {
          this.class = data;
        },
        error: (error) => {
          this.toastr.error('Failed to load class details!', 'Error');
        },
      });
    }
    if (this.class.admissionDate) {
      this.formattedDate = this.formatDate(this.class.admissionDate);
    }
  }
  
  toggleDay(event: any): void {
    const value = event.target.value;
    if (event.target.checked) {
      this.selectedDays.push(value);
    } else {
      this.selectedDays = this.selectedDays.filter(day => day !== value);
    }
    this.class.days = this.selectedDays.join(',');
  }
  saveClass(): void {
    this.isLoading = true; // Set loading state
    if (this.class.admissionDate) {
      this.class.admissionDate = new Date(this.class.admissionDate);
    }
    this.class.hour = `${this.startHour} - ${this.finishHour}`;

    if (this.isEditMode) {
      // Update class
      this.classService.updateClass(this.class.id, this.class).subscribe({
        next: (response) => {
          console.log('Update Response:', response);
          this.toastr.success('Class updated successfully!', 'Success');
          this.updateClassInList(this.class); // Update class in the list locally
          this.clearForm(); // Optionally clear the form after update
          this.router.navigate(['/admin/class']);
        },
        error: (error) => {
          console.error('Update Error:', error);
          this.toastr.error('Failed to update class!', 'Error');
        },
        complete: () => {
          this.isLoading = false; // Reset loading state
        },
      });
    } else {
      // Add new class
      this.classService.addClass(this.class).subscribe({
        next: (response) => {
          this.toastr.success('Class added successfully!', 'Success');
          this.addClassToList(response); // Handle response based on expected format
          this.clearForm(); // Reset form after adding a new class
          this.router.navigate(['/admin/class']);
        },
        error: (error) => {
          if (error.message.includes('Class with this name already exists')) {
            this.toastr.error('Class name already exists!', 'Error');
          } else {
            this.toastr.error('Failed to add class!', 'Error');
          }
        },
        complete: () => {
          this.isLoading = false; // Reset loading state
        },
      });
    }
  }

  formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Add leading 0
    const day = ('0' + date.getDate()).slice(-2); // Add leading 0
    return `${year}-${month}-${day}`;
  }

  parseDate(dateString: string): Date {
    const [year, month, day] = dateString.split('-').map(Number);
    return new Date(year, month - 1, day); // Adjust month since it's zero-based in Date object
  }

  // Method to add a new class to the local class list
  addClassToList(newClass: Class): void {
    const updatedClasses = [...this.classes(), newClass]; // Append the new class to the list
    this.classes.set(updatedClasses); // Update signal with new class list
  }

  // Method to update an existing class in the local class list
  updateClassInList(updatedClass: Class): void {
    const updatedClasses = this.classes().map((classItem) =>
      classItem.id === updatedClass.id ? updatedClass : classItem
    );
    this.classes.set(updatedClasses); // Update signal with modified class
  }

  // Method to clear the form after adding/updating a class
  clearForm(): void {
    this.class = {
      id: 0,
      className: '',
      center: '',
      hour: '',
      days: '',
      admissionDate: new Date(),
      status: 'STUDYING',
    };
    this.isEditMode = false; // Reset edit mode for next potential entry
  }
  onClosed(): void {
    this.router.navigate(['/admin/class']);
  }
}
