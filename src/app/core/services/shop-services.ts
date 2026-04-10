import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

import { CartService } from './cart-service';
import { UtenteServices } from './utente-services';
import { AuthServices } from './auth-services';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private cartUrl = 'http://localhost:9090/rest/oggettiCarrelli/';

  constructor(
    private cartService: CartService,
    private utenteService: UtenteServices,
    private http: HttpClient,
    private auth: AuthServices
  ) {}

  addToCart(item: any, type: 'prodotto' | 'biglietto', quantity: number = 1, extra?: any) {

    const enrichedItem =
      type === 'biglietto'
        ? {
            ...item,
            nome: extra?.date
              ? `${item.nome} • Data: ${extra.date}`
              : item.nome
          }
        : item;

    this.cartService.addToCart(enrichedItem, type, quantity);

    this.syncToBackend(enrichedItem, quantity).subscribe({
      error: err => console.error('sync error', err)
    });
  }

  private getUserId(): string | null {
    return this.auth.grant().userId;
  }

  private syncToBackend(item: any, quantity: number) {

    const userId = this.getUserId();

    if (!userId) return of(null);

    return this.utenteService.findAllByUserName(userId).pipe(
      switchMap((profilo: any) => {

        const carrelloId = profilo?.carrelloId;

        if (!carrelloId) return of(null);

        return this.http.post(this.cartUrl + 'create', {
          carrelloId,
          itemId: item.id,
          quantita: quantity,
          prezzoUnitario: item.prezzo
        });
      })
    );
  }
}