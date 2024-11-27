import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ScheduleClassComponent } from './schedule-class.component';

describe('ScheduleClassComponent', () => {
  let component: ScheduleClassComponent;
  let fixture: ComponentFixture<ScheduleClassComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ScheduleClassComponent]
    });
    fixture = TestBed.createComponent(ScheduleClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
