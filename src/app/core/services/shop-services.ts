import { Injectable } from '@angular/core';
import { CartService } from './cart-service';
import { CartApiService } from './cart-api-services';
import { CartItemApiService } from './cart-item-api-services';
import { AuthServices } from './auth-services';

export interface OggettiCarrelloDTO {
  id: number;
  quantita: number;
  prezzoUnitario: number;
  prezzoTotale: number;
  carrelloId: number;
  itemId: number;
  tipo: 'PRODOTTO' | 'BIGLIETTO';
  nome: string;
  urlImmagine: string;
}

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(
    private cartService: CartService,
    private cartApi: CartApiService,
    private cartItemApi: CartItemApiService,
    private auth: AuthServices
  ) {}

  loadCart() {

    const carrelloId = this.auth.getCarrelloId();
    if (!carrelloId) return;

    this.cartApi.getById(carrelloId).subscribe({
      next: (cart: any) => {

        const righe: OggettiCarrelloDTO[] = cart?.oggettiCarrello ?? [];

        this.cartService.setCart(righe);
      },
      error: (err) => console.error(err)
    });
  }

  addToCart(itemId: number, quantity: number = 1) {

    //if (!this.auth.isUserWithCart()) return; da inserire pe rendere indisponibili le interazioni in base al ruolo.
    const carrelloId = this.auth.getCarrelloId();
    if (!carrelloId) return;

    this.cartItemApi.create({
      carrelloId,
      itemId,
      quantita: quantity
    }).subscribe({
      next: () => {
        this.refreshCart();
      },
      error: (err) => console.error(err)
    });
  }

  removeFromCart(cartItemId: number) {

    this.cartItemApi.delete(cartItemId).subscribe({
      next: () => {
        this.refreshCart();
      },
      error: (err) => console.error(err)
    });
  }

  updateQuantity(item: OggettiCarrelloDTO, quantity: number) {
    this.cartItemApi.update({
      id: item.id,
      quantita: quantity
    }).subscribe({
      next: () => this.refreshCart(),
      error: (err) => console.error(err)
    });
  }

  private refreshCart() {
    const carrelloId = this.auth.getCarrelloId();
    if (!carrelloId) return;

    this.cartApi.getById(carrelloId).subscribe({
      next: (cart) => {
        this.cartService.setCart(cart.oggettiCarrello);
      }
    });
  }

  clearCart() {
    
    const carrelloId = this.auth.getCarrelloId();
    console.log('carrelloId:', carrelloId);
    if (!carrelloId) return;

    this.cartApi.clear(carrelloId).subscribe({
      next: () => {
        this.refreshCart();
      },
      error: (err) => console.error('CLEAR ERROR', err)
    });
  }
}