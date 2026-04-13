import { Component, OnInit } from '@angular/core';
import { ItemsServices } from '../../../../../core/services/items-services';
import { ShopService } from '../../../../../core/services/shop-services';

@Component({
  selector: 'app-shop-merch',
  templateUrl: './shop-merch.html',
  styleUrl: './shop-merch.css',
  standalone: false,
})
export class ShopMerch implements OnInit {

  imgBaseUrl = "http://localhost:9090/files/";

  constructor(
    private itemsS: ItemsServices,
    public shop: ShopService
  ) {}

  ngOnInit(): void {
    this.itemsS.list('prodotto').subscribe();
  }

  get prodotti() {
    return this.itemsS.prodotti();
  }

  addToCart(prodotto: any) {
    this.shop.addToCart(
      prodotto,
      'prodotto',
      1,
      {}
    );
  }
}