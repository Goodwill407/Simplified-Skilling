import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchoolLoginComponent } from './school-login.component';

describe('SchoolLoginComponent', () => {
  let component: SchoolLoginComponent;
  let fixture: ComponentFixture<SchoolLoginComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SchoolLoginComponent]
    });
    fixture = TestBed.createComponent(SchoolLoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
