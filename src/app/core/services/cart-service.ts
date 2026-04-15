import { Injectable, signal, computed } from '@angular/core';
import { OggettiCarrelloDTO } from './shop-services';

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

  setCart(items: OggettiCarrelloDTO[]) {
    this._items.set(items ?? []);
  }

  clear() {
    this._items.set([]);
  }

  getItem(itemId: number) {
    return this._items().find(i => i.itemId === itemId);
  }

  remove(itemId: number) {
    this._items.set(
      this._items().filter(i => i.itemId !== itemId)
    );
  }
}