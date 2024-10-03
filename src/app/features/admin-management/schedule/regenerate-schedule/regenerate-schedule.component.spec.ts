import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegenerateScheduleComponent } from './regenerate-schedule.component';

describe('RegenerateScheduleComponent', () => {
  let component: RegenerateScheduleComponent;
  let fixture: ComponentFixture<RegenerateScheduleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegenerateScheduleComponent]
    });
    fixture = TestBed.createComponent(RegenerateScheduleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
