import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListRoom } from './list-room';

describe('ListRoom', () => {
  let component: ListRoom;
  let fixture: ComponentFixture<ListRoom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListRoom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListRoom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
