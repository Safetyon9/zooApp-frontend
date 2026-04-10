import { Component, computed } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../../core/services/cart-service';

@Component({
  selector: 'app-carrello',
  standalone: false,
  templateUrl: './carrello.html',
  styleUrl: './carrello.css'
})
export class Carrello {

  constructor(
    public cartService: CartService,
    private router: Router
  ) {}

  get subtotale(): number {
    return this.cartService.items().reduce(
      (acc, item) => acc + item.prezzo * item.quantita, 0
    );
  }

  incrementa(item: CartItem): void {
    this.cartService.addToCart({ ...item, quantita: 1 }, item.tipo);
  }

  decrementa(item: CartItem): void {
    if (item.quantita <= 1) {
      this.rimuovi(item);
      return;
    }
    const aggiornati = this.cartService.items().map(i =>
      i.id === item.id && i.tipo === item.tipo && i.nome === item.nome
        ? { ...i, quantita: i.quantita - 1 }
        : i
    );
    this.cartService['cartItems'].set(aggiornati);
  }

  rimuovi(item: CartItem): void {
    this.cartService.removeFromCart(item.id, item.tipo);
  }

  svuota(): void {
    this.cartService.clearCart();
  }

  checkout(): void {
    this.router.navigate(['/utente/checkout']);
  }
}