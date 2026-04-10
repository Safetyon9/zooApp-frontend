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

  selectedTicket: any = null;
  quantity = 1;
  selectedDate = '';
  imgBaseUrl = "http://localhost:9090/files/";

  constructor(
    private itemsS: ItemsServices,
    public shop: ShopService
  ) {}

  ngOnInit(): void {
    this.itemsS.list('biglietti').subscribe();
  }

  get biglietti() {
    return this.itemsS.biglietti();
  }

  selectTicket(ticket: any) {
    this.selectedTicket = ticket;
    this.quantity = 1;
    this.selectedDate = '';
  }

  addToCart() {
    if (!this.selectedTicket) return;

    this.shop.addToCart(
      this.selectedTicket,
      'biglietto',
      this.quantity,
      {
        date: this.selectedDate
      }
    );

    this.reset();
  }

  reset() {
    this.selectedTicket = null;
    this.quantity = 1;
    this.selectedDate = '';
  }
}