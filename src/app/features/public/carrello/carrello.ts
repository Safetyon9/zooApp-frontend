import { Component, computed, inject, OnInit } from '@angular/core';
import { CartService } from '../../../core/services/cart-service';
import { OggettiCarrelloDTO, ShopService } from '../../../core/services/shop-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-carrello',
  templateUrl: './carrello.html',
  styleUrls: ['./carrello.css'],
  standalone: false
})
export class Carrello implements OnInit{

  constructor(
    public cartService: CartService,
    private shopService: ShopService,
    public routing: Router
  ) {}

  ngOnInit(): void {
    this.shopService.loadCart();
  }

  subtotale = computed(() =>
    this.cartService.totalPrice()
  );

  incrementa(item: OggettiCarrelloDTO) {
    this.shopService.updateQuantity(item, item.quantita + 1);
  }

  decrementa(item: OggettiCarrelloDTO) {
    const newQty = item.quantita - 1;

    if (newQty <= 0) {
      this.shopService.removeFromCart(item.id);
      return;
    }

    this.shopService.updateQuantity(item, newQty);
  }

  rimuovi(item: OggettiCarrelloDTO) {
    this.shopService.removeFromCart(item.id);
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