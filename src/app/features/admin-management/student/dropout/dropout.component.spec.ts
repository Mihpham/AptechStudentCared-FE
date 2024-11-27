import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DropoutComponent } from './dropout.component';

describe('DropoutComponent', () => {
  let component: DropoutComponent;
  let fixture: ComponentFixture<DropoutComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DropoutComponent]
    });
    fixture = TestBed.createComponent(DropoutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
