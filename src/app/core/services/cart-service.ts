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

  private cartItems = signal<CartItem[]>([]);

  items = computed(() => this.cartItems());

  totalCount = computed(() =>
    this.cartItems().reduce((acc, item) => acc + item.quantita, 0)
  );

  totalPrice = computed(() =>
    this.cartItems().reduce((acc, item) => acc + (item.prezzo * item.quantita), 0)
  );

  addToCart(item: Partial<CartItem>, tipo: CartType, quantity: number = 1) {

    const qty = this.normalizeQty(quantity);

    const current = this.cartItems();

    const key = this.buildKey(item.id!, tipo);

    const existingIndex = current.findIndex(i => this.buildKey(i.id, i.tipo) === key);

    if (existingIndex >= 0) {
      const updated = [...current];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantita: updated[existingIndex].quantita + qty
      };
      this.cartItems.set(updated);
      return;
    }

    this.cartItems.set([
      ...current,
      this.createItem(item, tipo, qty)
    ]);
  }

  removeFromCart(id: number, tipo: CartType) {
    this.cartItems.set(
      this.cartItems().filter(i => !(i.id === id && i.tipo === tipo))
    );
  }

  clearCart() {
    this.cartItems.set([]);
  }

  private buildKey(id: number, tipo: CartType): string {
    return `${tipo}-${id}`;
  }

  private normalizeQty(qty: number): number {
    if (!Number.isFinite(qty) || qty <= 0) return 1;
    return Math.floor(qty);
  }

  private createItem(item: Partial<CartItem>, tipo: CartType, qty: number): CartItem {
    return {
      id: item.id!,
      nome: item.nome || '',
      prezzo: Number(item.prezzo || 0),
      quantita: qty,
      tipo,
      immagine: item.immagine
    };
  }
}