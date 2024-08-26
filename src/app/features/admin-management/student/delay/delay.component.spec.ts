import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DelayComponent } from './delay.component';

describe('DelayComponent', () => {
  let component: DelayComponent;
  let fixture: ComponentFixture<DelayComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DelayComponent]
    });
    fixture = TestBed.createComponent(DelayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
