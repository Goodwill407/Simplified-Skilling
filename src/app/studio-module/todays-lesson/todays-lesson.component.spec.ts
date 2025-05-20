import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodaysLessonComponent } from './todays-lesson.component';

describe('TodaysLessonComponent', () => {
  let component: TodaysLessonComponent;
  let fixture: ComponentFixture<TodaysLessonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TodaysLessonComponent]
    });
    fixture = TestBed.createComponent(TodaysLessonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
