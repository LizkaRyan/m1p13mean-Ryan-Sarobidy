import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventValidation } from './event-validation';

describe('EventValidation', () => {
  let component: EventValidation;
  let fixture: ComponentFixture<EventValidation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventValidation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventValidation);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
