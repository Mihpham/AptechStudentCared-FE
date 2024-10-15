import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAssignmentMarkComponent } from './student-assignment-mark.component';

describe('StudentAssignmentMarkComponent', () => {
  let component: StudentAssignmentMarkComponent;
  let fixture: ComponentFixture<StudentAssignmentMarkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentAssignmentMarkComponent]
    });
    fixture = TestBed.createComponent(StudentAssignmentMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
