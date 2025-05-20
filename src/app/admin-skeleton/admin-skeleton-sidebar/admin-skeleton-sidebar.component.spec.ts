import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSkeletonSidebarComponent } from './admin-skeleton-sidebar.component';

describe('AdminSkeletonSidebarComponent', () => {
  let component: AdminSkeletonSidebarComponent;
  let fixture: ComponentFixture<AdminSkeletonSidebarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminSkeletonSidebarComponent]
    });
    fixture = TestBed.createComponent(AdminSkeletonSidebarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
