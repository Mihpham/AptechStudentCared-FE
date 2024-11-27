import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SroDialogComponent } from './sro-dialog.component';

describe('SroDialogComponent', () => {
  let component: SroDialogComponent;
  let fixture: ComponentFixture<SroDialogComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SroDialogComponent]
    });
    fixture = TestBed.createComponent(SroDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
