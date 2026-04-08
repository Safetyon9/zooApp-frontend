import { Injectable, signal, computed } from '@angular/core';

export interface CartItem {
  id: number;
  nome: string;
  prezzo: number;
  quantita: number;
  tipo: 'prodotto' | 'biglietto';
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

  addToCart(item: any, tipo: 'prodotto' | 'biglietto') {
    const currentItems = this.cartItems();
    const existingItem = currentItems.find(i => i.id === item.id && i.tipo === tipo);

    if (existingItem) {
      const updatedItems = currentItems.map(i => 
        (i.id === item.id && i.tipo === tipo) 
          ? { ...i, quantita: i.quantita + 1 } 
          : i
      );
      this.cartItems.set(updatedItems);
    } else {
      this.cartItems.set([...currentItems, {
        id: item.id,
        nome: item.nome,
        prezzo: item.prezzo,
        quantita: 1,
        tipo: tipo,
        immagine: item.immagine
      }]);
    }
  }

  removeFromCart(id: number, tipo: 'prodotto' | 'biglietto') {
    const updatedItems = this.cartItems().filter(i => !(i.id === id && i.tipo === tipo));
    this.cartItems.set(updatedItems);
  }

  clearCart() {
    this.cartItems.set([]);
  }
}
