import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassStudentDetailComponent } from './class-student-detail.component';

describe('ClassStudentDetailComponent', () => {
  let component: ClassStudentDetailComponent;
  let fixture: ComponentFixture<ClassStudentDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassStudentDetailComponent]
    });
    fixture = TestBed.createComponent(ClassStudentDetailComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
