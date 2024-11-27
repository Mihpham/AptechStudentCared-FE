import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportStudentDialogComponent } from './import-student-dialog.component';

describe('ImportStudentDialogComponent', () => {
  let component: ImportStudentDialogComponent;
  let fixture: ComponentFixture<ImportStudentDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportStudentDialogComponent]
    });
    fixture = TestBed.createComponent(ImportStudentDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
