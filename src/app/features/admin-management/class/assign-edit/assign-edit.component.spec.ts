import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignEditComponent } from './assign-edit.component';

describe('AssignEditComponent', () => {
  let component: AssignEditComponent;
  let fixture: ComponentFixture<AssignEditComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AssignEditComponent]
    });
    fixture = TestBed.createComponent(AssignEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
