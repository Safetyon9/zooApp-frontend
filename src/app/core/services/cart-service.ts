import { Injectable, signal, computed } from '@angular/core';
import { OggettiCarrelloDTO } from './shop-services';

export type CartType = 'PRODOTTO' | 'BIGLIETTO';

@Injectable({
  providedIn: 'root'
})
export class CartService {

  private readonly _items = signal<OggettiCarrelloDTO[]>([]);

  readonly items = computed(() => this._items());

  readonly totalCount = computed(() =>
    this._items().reduce((acc, i) => acc + i.quantita, 0)
  );

  readonly totalPrice = computed(() =>
    this._items().reduce((acc, i) => acc + (i.prezzoTotale ?? 0), 0)
  );

  // =========================
  // CORE
  // =========================

  setCart(items: OggettiCarrelloDTO[]) {
    this._items.set(items ?? []);
  }

  clear() {
    this._items.set([]);
  }

  // =========================
  // FIND
  // =========================

  getItem(itemId: number) {
    return this._items().find(i => i.itemId === itemId);
  }

  // =========================
  // UPDATE (SOLO UI STATE)
  // =========================

  updateQty(itemId: number, qty: number) {
    const current = this._items();

    const index = current.findIndex(i => i.itemId === itemId);

    if (index === -1) return;

    const updated = [...current];

    if (qty <= 0) {
      this._items.set(updated.filter(i => i.itemId !== itemId));
      return;
    }

    const item = updated[index];

    updated[index] = {
      ...item,
      quantita: qty,
      prezzoTotale: (item.prezzoUnitario ?? 0) * qty
    };

    this._items.set(updated);
  }

  // =========================
  // REMOVE
  // =========================

  remove(itemId: number) {
    this._items.set(
      this._items().filter(i => i.itemId !== itemId)
    );
  }
}