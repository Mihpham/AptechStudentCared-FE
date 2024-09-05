import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CourseDetailDialogComponent } from './course-detail-dialog.component';

describe('CourseDetailDialogComponent', () => {
  let component: CourseDetailDialogComponent;
  let fixture: ComponentFixture<CourseDetailDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CourseDetailDialogComponent]
    });
    fixture = TestBed.createComponent(CourseDetailDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
