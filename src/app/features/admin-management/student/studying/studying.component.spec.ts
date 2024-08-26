import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudyingComponent } from './studying.component';

describe('StudyingComponent', () => {
  let component: StudyingComponent;
  let fixture: ComponentFixture<StudyingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudyingComponent]
    });
    fixture = TestBed.createComponent(StudyingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
