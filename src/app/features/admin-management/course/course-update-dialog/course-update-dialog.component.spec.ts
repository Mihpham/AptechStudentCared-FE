import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseUpdateDialogComponent } from './course-update-dialog.component';

describe('CourseUpdateDialogComponent', () => {
  let component: CourseUpdateDialogComponent;
  let fixture: ComponentFixture<CourseUpdateDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseUpdateDialogComponent]
    });
    fixture = TestBed.createComponent(CourseUpdateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
