import { Injectable } from '@angular/core';
import { CartService, CartType } from './cart-service';
import { CartApiService } from './cart-api-services';
import { CartItemApiService } from './cart-item-api-services';
import { AuthServices } from './auth-services';
import { ItemsServices } from './items-services';

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
    private auth: AuthServices,
    private itemsApi: ItemsServices
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
  //sto qua
  addToCart(
    item: any,
    type: CartType,
    quantity: number = 1,
    extra?: any
  ) {

    console.log('AUTH USER:', this.auth);
    console.log('CARRELLO ID:', this.auth.getCarrelloId());
    if (!this.auth.isUserWithCart()) return;

    const carrelloId = this.auth.getCarrelloId();
    if (!carrelloId) return;

    this.cartItemApi.create({
      carrelloId,
      itemId: item.id,
      quantita: quantity
    }).subscribe({
      next: (res: any) => {
        console.log('CREATE CART RESPONSE:', res);
        this.cartService.addLocalWithId(
          item,
          type,
          quantity,
          res.data
        );
      },
      error: (err) => {
        console.error('AddToCart error', err);
      }
    });
  }

  removeFromCart(item: any, type: CartType) {

    const cartItem = this.cartService.getItem(item.id, type);

    this.cartService.remove(item.id, type);

    if (!cartItem?.cartItemId) return;

    this.cartItemApi.delete(cartItem.cartItemId).subscribe({
      error: (err) => console.error('DELETE ERROR', err)
    });
  }

  updateQuantity(item: any, type: CartType, quantity: number) {

    const cartItem = this.cartService.getItem(item.id, type);
    if (!cartItem?.cartItemId) return;

    this.cartItemApi.update({
      id: cartItem.cartItemId,
      quantita: quantity
    }).subscribe({
      next: () => {
        this.cartService.updateQty(item.id, type, quantity);
      },
      error: (err) => console.error('UPDATE ERROR', err)
    });
  }

  clearCart() {

    const items = this.cartService.items();

    items.forEach(i => {
      if (!i.cartItemId) return;

      this.cartItemApi.delete(i.cartItemId).subscribe({
        error: (err) => console.error('CLEAR ERROR', err)
      });
    });

    this.cartService.clear();
  }
}