import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LectureVideosComponent } from './lecture-videos.component';

describe('LectureVideosComponent', () => {
  let component: LectureVideosComponent;
  let fixture: ComponentFixture<LectureVideosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LectureVideosComponent]
    });
    fixture = TestBed.createComponent(LectureVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
