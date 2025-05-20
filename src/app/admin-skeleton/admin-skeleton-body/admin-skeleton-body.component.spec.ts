import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminSkeletonBodyComponent } from './admin-skeleton-body.component';

describe('AdminSkeletonBodyComponent', () => {
  let component: AdminSkeletonBodyComponent;
  let fixture: ComponentFixture<AdminSkeletonBodyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AdminSkeletonBodyComponent]
    });
    fixture = TestBed.createComponent(AdminSkeletonBodyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
