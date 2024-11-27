import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamMarkStudentComponent } from './exam-mark-student.component';

describe('ExamMarkStudentComponent', () => {
  let component: ExamMarkStudentComponent;
  let fixture: ComponentFixture<ExamMarkStudentComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamMarkStudentComponent]
    });
    fixture = TestBed.createComponent(ExamMarkStudentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
