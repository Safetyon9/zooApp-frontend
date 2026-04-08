import { Component } from '@angular/core';
import { CartService } from '../../../../../core/services/cart-service';

@Component({
  selector: 'app-shop-biglietti',
  templateUrl: './shop-biglietti.html',
  styleUrl: './shop-biglietti.css',
  standalone: false,
})
export class ShopBiglietti {
  constructor(private cartS: CartService) {}

  addToCart(id: number, nome: string, prezzo: number, immagine: string) {
    this.cartS.addToCart({ id, nome, prezzo, immagine }, 'biglietto');
  }
}
