import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassmatesComponent } from './classmates.component';

describe('ClassmatesComponent', () => {
  let component: ClassmatesComponent;
  let fixture: ComponentFixture<ClassmatesComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassmatesComponent]
    });
    fixture = TestBed.createComponent(ClassmatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
