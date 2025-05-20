import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSkeletonNavbarComponent } from './admin-skeleton-navbar.component';

describe('AdminSkeletonNavbarComponent', () => {
  let component: AdminSkeletonNavbarComponent;
  let fixture: ComponentFixture<AdminSkeletonNavbarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminSkeletonNavbarComponent]
    });
    fixture = TestBed.createComponent(AdminSkeletonNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
