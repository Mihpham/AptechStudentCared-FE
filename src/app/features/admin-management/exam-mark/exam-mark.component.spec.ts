import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExamMarkComponent } from './exam-mark.component';

describe('ExamMarkComponent', () => {
  let component: ExamMarkComponent;
  let fixture: ComponentFixture<ExamMarkComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExamMarkComponent]
    });
    fixture = TestBed.createComponent(ExamMarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
