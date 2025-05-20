import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MediumMasterComponent } from './medium-master.component';

describe('MediumMasterComponent', () => {
  let component: MediumMasterComponent;
  let fixture: ComponentFixture<MediumMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MediumMasterComponent]
    });
    fixture = TestBed.createComponent(MediumMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
