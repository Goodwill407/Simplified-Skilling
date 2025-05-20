import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoardcastComponent } from './boardcast.component';

describe('BoardcastComponent', () => {
  let component: BoardcastComponent;
  let fixture: ComponentFixture<BoardcastComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BoardcastComponent]
    });
    fixture = TestBed.createComponent(BoardcastComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
