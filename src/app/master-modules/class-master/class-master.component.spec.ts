import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClassMasterComponent } from './class-master.component';

describe('ClassMasterComponent', () => {
  let component: ClassMasterComponent;
  let fixture: ComponentFixture<ClassMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ClassMasterComponent]
    });
    fixture = TestBed.createComponent(ClassMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
