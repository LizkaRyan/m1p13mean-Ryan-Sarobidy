import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ClientEvent } from './client-event';

describe('ClientEvent', () => {
  let component: ClientEvent;
  let fixture: ComponentFixture<ClientEvent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ClientEvent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ClientEvent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
