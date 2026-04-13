import { Injectable, signal, computed } from '@angular/core';

export type CartType = 'prodotto' | 'biglietto';

export interface CartItem {
  id: number;
  nome: string;
  prezzo: number;
  quantita: number;
  tipo: CartType;
  immagine?: string;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly cartItems = signal<CartItem[]>([]);

  readonly items = computed(() => this.cartItems());

  readonly totalCount = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.quantita, 0)
  );

  readonly totalPrice = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.prezzo * item.quantita, 0)
  );

  addToCart(item: Partial<CartItem>, tipo: CartType, quantity: number = 1) {
    if (!item?.id) return;

    const qty = this.normalizeQty(quantity);
    const current = this.cartItems();

    const index = current.findIndex(
      i => i.id === item.id && i.tipo === tipo
    );

    if (index !== -1) {
      this.incrementItem(current, index, qty);
      return;
    }

    this.cartItems.set([
      ...current,
      this.createItem(item, tipo, qty)
    ]);
  }

  decrement(item: CartItem, qty: number = 1) {
    const current = this.cartItems();

    const index = current.findIndex(
      i => i.id === item.id && i.tipo === item.tipo
    );

    if (index === -1) return;

    const updated = [...current];

    const newQty = updated[index].quantita - qty;

    if (newQty <= 0) {
      this.removeFromCart(item.id, item.tipo);
      return;
    }

    updated[index] = {
      ...updated[index],
      quantita: newQty
    };

    this.cartItems.set(updated);
  }

  removeFromCart(id: number, tipo: CartType) {
    this.cartItems.set(
      this.cartItems().filter(
        i => !(i.id === id && i.tipo === tipo)
      )
    );
  }

  clearCart() {
    this.cartItems.set([]);
  }

  setCart(items: CartItem[]) {
    this.cartItems.set(items ?? []);
  }

  getItem(id: number, tipo: CartType) {
    return this.cartItems().find(
      i => i.id === id && i.tipo === tipo
    );
  }

  private incrementItem(current: CartItem[], index: number, qty: number) {
    const updated = [...current];

    updated[index] = {
      ...updated[index],
      quantita: updated[index].quantita + qty
    };

    this.cartItems.set(updated);
  }

  private normalizeQty(qty: number): number {
    if (!Number.isFinite(qty) || qty <= 0) return 1;
    return Math.floor(qty);
  }

  private createItem(
    item: Partial<CartItem>,
    tipo: CartType,
    qty: number
  ): CartItem {
    return {
      id: item.id!,
      nome: item.nome ?? '',
      prezzo: Number(item.prezzo ?? 0),
      quantita: qty,
      tipo,
      immagine: item.immagine
    };
  }
}