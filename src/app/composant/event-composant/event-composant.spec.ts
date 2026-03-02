import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EventComposant } from './event-composant';

describe('EventComposant', () => {
  let component: EventComposant;
  let fixture: ComponentFixture<EventComposant>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EventComposant]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EventComposant);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
