import { Component } from '@angular/core';
import { CartService } from '../../../../../core/services/cart-service';

@Component({
  selector: 'app-shop-merch',
  templateUrl: './shop-merch.html',
  styleUrl: './shop-merch.css',
  standalone: false,
})
export class ShopMerch {
  constructor(private cartS: CartService) {}

  addToCart(id: number, nome: string, prezzo: number, immagine: string) {
    this.cartS.addToCart({ id, nome, prezzo, immagine }, 'prodotto');
  }
}
