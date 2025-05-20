import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LessonMasterComponent } from './lesson-master.component';

describe('LessonMasterComponent', () => {
  let component: LessonMasterComponent;
  let fixture: ComponentFixture<LessonMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LessonMasterComponent]
    });
    fixture = TestBed.createComponent(LessonMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
