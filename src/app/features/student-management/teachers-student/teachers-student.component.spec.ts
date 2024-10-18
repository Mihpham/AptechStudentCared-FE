import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TeachersStudentComponent } from './teachers-student.component';

describe('TeachersStudentComponent', () => {
  let component: TeachersStudentComponent;
  let fixture: ComponentFixture<TeachersStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TeachersStudentComponent]
    });
    fixture = TestBed.createComponent(TeachersStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
