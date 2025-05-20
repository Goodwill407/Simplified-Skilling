import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MultimediaVideosComponent } from './multimedia-videos.component';

describe('MultimediaVideosComponent', () => {
  let component: MultimediaVideosComponent;
  let fixture: ComponentFixture<MultimediaVideosComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MultimediaVideosComponent]
    });
    fixture = TestBed.createComponent(MultimediaVideosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
