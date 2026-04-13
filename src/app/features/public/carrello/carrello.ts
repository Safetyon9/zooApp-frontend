import { Component, computed, inject } from '@angular/core';
import { CartService } from '../../../core/services/cart-service';
import { ShopService } from '../../../core/services/shop-services';
import { CartType } from '../../../core/services/cart-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrello',
  templateUrl: './carrello.html',
  styleUrls: ['./carrello.css'],
  standalone: false
})
export class Carrello {

  constructor(
    public cartService: CartService,
    private shopService: ShopService,
    public routing: Router
  ) {}

  subtotale = computed(() =>
    this.cartService.totalPrice()
  );

  incrementa(item: any) {
    this.shopService.updateQuantity(
      item,
      item.tipo as CartType,
      item.quantita + 1
    );
  }

  decrementa(item: any) {
    const newQty = item.quantita - 1;

    if (newQty <= 0) {
      this.rimuovi(item);
      return;
    }

    this.shopService.updateQuantity(
      item,
      item.tipo as CartType,
      newQty
    );
  }

  rimuovi(item: any) {
    this.shopService.removeFromCart(
      item,
      item.tipo as CartType
    );
  }

  svuota() {
    this.shopService.clearCart();
  }

  checkout() {
    this.routing.navigate(['/checkout']);
  }

  tornaAlNegozio() {
    this.routing.navigate(['/shop']);
  }
}