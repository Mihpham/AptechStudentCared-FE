import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAllStatusesComponent } from './student-all-statuses.component';

describe('StudentAllStatusesComponent', () => {
  let component: StudentAllStatusesComponent;
  let fixture: ComponentFixture<StudentAllStatusesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentAllStatusesComponent]
    });
    fixture = TestBed.createComponent(StudentAllStatusesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
