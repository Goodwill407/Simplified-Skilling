import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardMasterComponent } from './board-master.component';

describe('BoardMasterComponent', () => {
  let component: BoardMasterComponent;
  let fixture: ComponentFixture<BoardMasterComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoardMasterComponent]
    });
    fixture = TestBed.createComponent(BoardMasterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
