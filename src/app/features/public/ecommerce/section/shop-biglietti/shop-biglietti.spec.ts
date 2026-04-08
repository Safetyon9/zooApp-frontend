import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopBiglietti } from './shop-biglietti';

describe('ShopBiglietti', () => {
  let component: ShopBiglietti;
  let fixture: ComponentFixture<ShopBiglietti>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopBiglietti],
    }).compileComponents();

    fixture = TestBed.createComponent(ShopBiglietti);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
