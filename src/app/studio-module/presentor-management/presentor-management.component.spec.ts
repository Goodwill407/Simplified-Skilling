import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PresentorManagementComponent } from './presentor-management.component';

describe('PresentorManagementComponent', () => {
  let component: PresentorManagementComponent;
  let fixture: ComponentFixture<PresentorManagementComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PresentorManagementComponent]
    });
    fixture = TestBed.createComponent(PresentorManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
