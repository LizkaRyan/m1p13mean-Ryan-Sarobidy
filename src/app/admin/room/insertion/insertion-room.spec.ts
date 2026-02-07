import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InsertionRoom } from './insertion-room';

describe('Insertion', () => {
  let component: InsertionRoom;
  let fixture: ComponentFixture<InsertionRoom>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InsertionRoom]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InsertionRoom);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
