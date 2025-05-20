import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveStreamingComponent } from './live-streaming.component';

describe('LiveStreamingComponent', () => {
  let component: LiveStreamingComponent;
  let fixture: ComponentFixture<LiveStreamingComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LiveStreamingComponent]
    });
    fixture = TestBed.createComponent(LiveStreamingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
