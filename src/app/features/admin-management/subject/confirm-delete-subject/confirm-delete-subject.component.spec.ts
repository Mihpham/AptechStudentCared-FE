import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmDeleteSubjectComponent } from './confirm-delete-subject.component';

describe('ConfirmDeleteSubjectComponent', () => {
  let component: ConfirmDeleteSubjectComponent;
  let fixture: ComponentFixture<ConfirmDeleteSubjectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ConfirmDeleteSubjectComponent]
    });
    fixture = TestBed.createComponent(ConfirmDeleteSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
