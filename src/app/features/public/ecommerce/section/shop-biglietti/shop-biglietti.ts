import { Component } from '@angular/core';
import { CartService } from '../../../../../core/services/cart-service';

@Component({
  selector: 'app-shop-biglietti',
  templateUrl: './shop-biglietti.html',
  styleUrl: './shop-biglietti.css',
  standalone: false,
})
export class ShopBiglietti {
  step = 1;
  selectedTicket: any = null;
  selectedDate: string = '';

  constructor(private cartS: CartService) {}

  selectTicket(ticket: any) {
    this.selectedTicket = ticket;
    this.step = 2;
  }

  confirmPurchase() {
    if (this.selectedDate) {
      this.cartS.addToCart({ 
        ...this.selectedTicket, 
        nome: `${this.selectedTicket.nome} (${this.selectedDate})` 
      }, 'biglietto');
      this.reset();
    }
  }

  reset() {
    this.step = 1;
    this.selectedTicket = null;
    this.selectedDate = '';
  }
}
