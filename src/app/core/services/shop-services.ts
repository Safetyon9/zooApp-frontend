import { Injectable } from '@angular/core';
import { CartService, CartType } from './cart-service';
import { CartApiService } from './cart-api-services';
import { AuthServices } from './auth-services';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(
    private cartService: CartService,
    private cartApi: CartApiService,
    private auth: AuthServices
  ) {}

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

    this.cartApi.create({
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
          res.id
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

    if (!this.auth.isUserWithCart()) return;
    console.log(cartItem?.cartItemId);
    if (!cartItem?.cartItemId) return;

    console.log('DELETE ITEM:', item);
    console.log('CART ITEM:', cartItem);
    console.log('CART ITEM ID:', cartItem?.cartItemId);

    this.cartApi.delete(cartItem.cartItemId).subscribe({
      error: (err) => console.error('Delete error', err)
    });
  }

  updateQuantity(item: any, type: CartType, quantity: number) {

    const cartItem = this.cartService.getItem(item.id, type);
    if (!cartItem) return;

    this.cartService.updateQty(item.id, type, quantity);

    if (!this.auth.isUserWithCart()) return;
    if (!cartItem.cartItemId) return;

    this.cartApi.update({
      id: cartItem.cartItemId,
      quantita: quantity
    }).subscribe({
      error: (err) => console.error('Update error', err)
    });
  }

  clearCart() {
    const items = this.cartService.items();

    if (!this.auth.isUserWithCart()) {
      this.cartService.clear();
      return;
    }

    items.forEach(i => {
      if (!i.cartItemId) return;

      this.cartApi.delete(i.cartItemId).subscribe({
        error: (err) => console.error('Clear item error', err)
      });
    });

    this.cartService.clear();
  }
  
}