import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShopMerch } from './shop-merch';

describe('ShopMerch', () => {
  let component: ShopMerch;
  let fixture: ComponentFixture<ShopMerch>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShopMerch],
    }).compileComponents();

    fixture = TestBed.createComponent(ShopMerch);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
