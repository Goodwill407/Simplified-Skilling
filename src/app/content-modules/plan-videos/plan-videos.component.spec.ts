import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlanVideosComponent } from './plan-videos.component';

describe('PlanVideosComponent', () => {
  let component: PlanVideosComponent;
  let fixture: ComponentFixture<PlanVideosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PlanVideosComponent]
    });
    fixture = TestBed.createComponent(PlanVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
