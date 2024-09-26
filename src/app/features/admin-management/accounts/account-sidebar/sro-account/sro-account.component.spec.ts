import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SroAccountComponent } from './sro-account.component';

describe('SroAccountComponent', () => {
  let component: SroAccountComponent;
  let fixture: ComponentFixture<SroAccountComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SroAccountComponent]
    });
    fixture = TestBed.createComponent(SroAccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
