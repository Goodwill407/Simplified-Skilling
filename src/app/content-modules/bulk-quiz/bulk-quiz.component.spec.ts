import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BulkQuizComponent } from './bulk-quiz.component';

describe('BulkQuizComponent', () => {
  let component: BulkQuizComponent;
  let fixture: ComponentFixture<BulkQuizComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BulkQuizComponent]
    });
    fixture = TestBed.createComponent(BulkQuizComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
