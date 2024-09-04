import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectUpdateComponent } from './subject-update.component';

describe('SubjectUpdateComponent', () => {
  let component: SubjectUpdateComponent;
  let fixture: ComponentFixture<SubjectUpdateComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubjectUpdateComponent]
    });
    fixture = TestBed.createComponent(SubjectUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
