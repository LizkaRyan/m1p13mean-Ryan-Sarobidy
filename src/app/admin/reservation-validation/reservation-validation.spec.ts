import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReservationValidation } from './reservation-validation';

describe('ReservationValidation', () => {
  let component: ReservationValidation;
  let fixture: ComponentFixture<ReservationValidation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReservationValidation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ReservationValidation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
