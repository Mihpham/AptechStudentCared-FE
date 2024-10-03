import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamMarkAllSubjectComponent } from './exam-mark-all-subject.component';

describe('ExamMarkAllSubjectComponent', () => {
  let component: ExamMarkAllSubjectComponent;
  let fixture: ComponentFixture<ExamMarkAllSubjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamMarkAllSubjectComponent]
    });
    fixture = TestBed.createComponent(ExamMarkAllSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
