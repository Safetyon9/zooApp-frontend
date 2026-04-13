import { Component, OnInit } from '@angular/core';
import { ItemsServices } from '../../../../../core/services/items-services';
import { ShopService } from '../../../../../core/services/shop-services';

@Component({
  selector: 'app-shop-biglietti',
  templateUrl: './shop-biglietti.html',
  styleUrl: './shop-biglietti.css',
  standalone: false,
})
export class ShopBiglietti implements OnInit {

  quantity = 1;
  selectedDate = '';
  imgBaseUrl = "http://localhost:9090/files/";

  constructor(
    private itemsS: ItemsServices,
    public shop: ShopService
  ) {}

  ngOnInit(): void {
    this.itemsS.list('biglietti').subscribe({
      error: err => console.error('Errore caricamento biglietti', err)
    });
  }

  get biglietti() {
    return this.itemsS.biglietti();
  }

  addToCart(ticket: any) {
    console.log('ADD TO CART:', ticket);
    this.shop.addToCart(
      ticket,
      'biglietto',
      this.quantity,
      {
        date: this.selectedDate
      }
    );
  }
}