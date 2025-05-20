import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SubjectMasterComponent } from './subject-master.component';

describe('SubjectMasterComponent', () => {
  let component: SubjectMasterComponent;
  let fixture: ComponentFixture<SubjectMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubjectMasterComponent]
    });
    fixture = TestBed.createComponent(SubjectMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
