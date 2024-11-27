import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentUpdateDialogComponent } from './student-update-dialog.component';

describe('StudentUpdateDialogComponent', () => {
  let component: StudentUpdateDialogComponent;
  let fixture: ComponentFixture<StudentUpdateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentUpdateDialogComponent]
    });
    fixture = TestBed.createComponent(StudentUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
