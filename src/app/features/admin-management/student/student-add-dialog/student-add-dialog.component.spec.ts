import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudentAddDialogComponent } from './student-add-dialog.component';

describe('StudentAddDialogComponent', () => {
  let component: StudentAddDialogComponent;
  let fixture: ComponentFixture<StudentAddDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudentAddDialogComponent]
    });
    fixture = TestBed.createComponent(StudentAddDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
