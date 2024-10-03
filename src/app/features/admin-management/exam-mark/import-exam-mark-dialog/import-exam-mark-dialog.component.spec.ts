import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ImportExamMarkDialogComponent } from './import-exam-mark-dialog.component';

describe('ImportExamMarkDialogComponent', () => {
  let component: ImportExamMarkDialogComponent;
  let fixture: ComponentFixture<ImportExamMarkDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ImportExamMarkDialogComponent]
    });
    fixture = TestBed.createComponent(ImportExamMarkDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
