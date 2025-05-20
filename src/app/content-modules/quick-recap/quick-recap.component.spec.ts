import { ComponentFixture, TestBed } from '@angular/core/testing';

import { QuickRecapComponent } from './quick-recap.component';

describe('QuickRecapComponent', () => {
  let component: QuickRecapComponent;
  let fixture: ComponentFixture<QuickRecapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [QuickRecapComponent]
    });
    fixture = TestBed.createComponent(QuickRecapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
