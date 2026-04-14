import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CartService } from './cart-service';
import { switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private http = inject(HttpClient);
  private cartService = inject(CartService);
  private router = inject(Router);

  private baseOrdine    = 'http://localhost:9090/rest/ordine';
  private baseMetodi    = 'http://localhost:9090/rest/metodiPagamento';
  private baseCoupons   = 'http://localhost:9090/rest/coupons';
  private baseOggettiOrdine   = 'http://localhost:9090/rest/oggettoordine';

  getMetodiPagamento() {
    return this.http.get<any[]>(`${this.baseMetodi}/list`);
  }

  getCoupons() {
    return this.http.get<any[]>(`${this.baseCoupons}/list`);
  }

  verificaCoupon(codice: string, subtotale: number): { valido: boolean; sconto: number; msg: string } {
    return { valido: false, sconto: 0, msg: '' };
  }

  verificaCouponRemoto(codice: string, subtotale: number) {
    return this.getCoupons().pipe(
      switchMap(coupons => {
        const coupon = coupons.find((c: any) =>
          c.codice === codice && c.attivo
        );

        if (!coupon) {
          return [{ valido: false, sconto: 0, msg: 'Coupon non valido o scaduto', couponId: null }];
        }

        const sconto = coupon.tipo === 'PERCENTUALE'
          ? subtotale * (coupon.valore / 100)
          : Number(coupon.valore);

        return [{ valido: true, sconto, msg: `Coupon applicato! Sconto: €${sconto.toFixed(2)}`, couponId: coupon.id }];
      })
    );
  }

  confermaOrdine(body: any) {
  return this.http.post<any>(`${this.baseOrdine}/create`, body);
}

  svuotaERedirect() {
    this.cartService.clear();
    setTimeout(() => this.router.navigate(['/utente']), 2500);
  }
}