import { Injectable } from '@angular/core';
import { CartService } from './cart-service';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  constructor(
    private cartService: CartService
  ) {}

  addToCart(
    item: any,
    type: 'prodotto' | 'biglietto',
    quantity: number = 1,
    extra?: any
  ) {
    const enrichedItem =
      type === 'biglietto'
        ? {
            ...item,
            nome: extra?.date
              ? `${item.nome} • Data: ${extra.date}`
              : item.nome
          }
        : type === 'prodotto'
        ? {
            ...item,
            nome: extra?.categoriaNome
              ? `${item.nome} • Categoria: ${extra.categoriaNome}`
              : item.nome
          }
        : item;

    this.cartService.addToCart(enrichedItem, type, quantity);
  }
}