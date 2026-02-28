import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListShop } from './list-shop';

describe('ListShop', () => {
  let component: ListShop;
  let fixture: ComponentFixture<ListShop>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ListShop]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ListShop);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
