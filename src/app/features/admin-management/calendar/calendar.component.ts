import { Component } from '@angular/core';
interface Task {
  name: string;
  date: string;
  time: string;
}
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent {
  taskName = '';
  taskDate = '';
  taskTime = '';
  tasks: Task[] = [];

  // Add a new task
  addTask() {
    if (this.taskName && this.taskDate && this.taskTime) {
      const newTask: Task = {
        name: this.taskName,
        date: this.taskDate,
        time: this.taskTime,
      };
      this.tasks.push(newTask);
      this.clearForm();
    }
  }

  // Clear the form after adding a task
  clearForm() {
    this.taskName = '';
    this.taskDate = '';
    this.taskTime = '';
  }

  // Remove a task by index
  removeTask(index: number) {
    this.tasks.splice(index, 1);
  }
}
