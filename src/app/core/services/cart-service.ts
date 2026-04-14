import { Injectable, signal, computed } from '@angular/core';

export type CartType = 'prodotto' | 'biglietto';

export interface CartItem {
  id: number;
  nome: string;
  prezzo: number;
  quantita: number;
  tipo: CartType;
  urlImmagine?: string;
  cartItemId?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly _items = signal<CartItem[]>([]);

  readonly items = computed(() => this._items());

  readonly totalCount = computed(() =>
    this._items().reduce((acc, i) => acc + i.quantita, 0)
  );

  readonly totalPrice = computed(() =>
    this._items().reduce((acc, i) => acc + (i.prezzo * i.quantita), 0)
  );

  setCart(items: CartItem[]) {
    this._items.set(items ?? []);
  }

  addLocal(item: Partial<CartItem>, tipo: CartType, qty: number = 1) {
    if (!item?.id) return;

    const quantity = this.normalizeQty(qty);
    const current = this._items();

    const index = current.findIndex(
      i => i.id === item.id && i.tipo === tipo
    );

    if (index !== -1) {
      const updated = [...current];
      updated[index] = {
        ...updated[index],
        quantita: updated[index].quantita + quantity
      };
      this._items.set(updated);
      return;
    }

    this._items.set([
      ...current,
      this.createItem(item, tipo, quantity)
    ]);
  }

  attachCartItemId(itemId: number, tipo: CartType, cartItemId: number) {
    const current = this._items();

    const index = current.findIndex(
      i => i.id === itemId && i.tipo === tipo
    );

    if (index === -1) return;

    const updated = [...current];

    updated[index] = {
      ...updated[index],
      cartItemId
    };

    this._items.set(updated);
  }

  updateQty(id: number, tipo: CartType, qty: number) {
    const current = this._items();

    const index = current.findIndex(
      i => i.id === id && i.tipo === tipo
    );

    if (index === -1) return;

    const updated = [...current];

    if (qty <= 0) {
      this._items.set(
        updated.filter(i => !(i.id === id && i.tipo === tipo))
      );
      return;
    }

    updated[index] = {
      ...updated[index],
      quantita: qty
    };

    this._items.set(updated);
  }

  remove(id: number, tipo: CartType) {
    this._items.set(
      this._items().filter(i => !(i.id === id && i.tipo === tipo))
    );
  }

  clear() {
    this._items.set([]);
  }

  getItem(id: number, tipo: CartType) {
    return this._items().find(
      i => i.id === id && i.tipo === tipo
    );
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
      urlImmagine: item.urlImmagine ?? ''
    };
  }

  addLocalWithId(item: Partial<CartItem>, tipo: CartType, qty: number, cartItemId: number) {

    const quantity = this.normalizeQty(qty);
    const current = this._items();

    const index = current.findIndex(
      i => i.id === item.id && i.tipo === tipo
    );

    if (index !== -1) {
      const updated = [...current];
      updated[index] = {
        ...updated[index],
        quantita: updated[index].quantita + quantity,
        cartItemId
      };
      this._items.set(updated);
      return;
    }

    this._items.set([
      ...current,
      {
        ...this.createItem(item, tipo, quantity),
        cartItemId
      }
    ]);
  }
}