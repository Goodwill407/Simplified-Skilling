import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StudioDashboardComponent } from './studio-dashboard.component';

describe('StudioDashboardComponent', () => {
  let component: StudioDashboardComponent;
  let fixture: ComponentFixture<StudioDashboardComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [StudioDashboardComponent]
    });
    fixture = TestBed.createComponent(StudioDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
