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
  private basePagamenti = 'http://localhost:9090/rest/pagamenti';
  private baseMetodi    = 'http://localhost:9090/rest/metodiPagamento';
  private baseCoupons   = 'http://localhost:9090/rest/coupons';

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

  confermaOrdine(params: {
    clienteId: number;
    indirizzo: string;
    importo: number;
    metodoPagamentoId: number;
    couponId?: number | null;
  }) {
    const ordineBody = {
      clienteId: params.clienteId,
      indirizzo: params.indirizzo
    };

    return this.http.post<any>(`${this.baseOrdine}/create`, ordineBody).pipe(
      switchMap((ordineResp: any) => {
        const pagamentoBody = {
          ordineId: ordineResp?.id,
          importo: params.importo,
          metodoPagamentoId: params.metodoPagamentoId,
          couponId: params.couponId ?? null,
          stato: 'ATTESA'
        };

        return this.http.post(`${this.basePagamenti}/create`, pagamentoBody);
      })
    );
  }

  svuotaERedirect() {
    this.cartService.clear();
    setTimeout(() => this.router.navigate(['/utente']), 2500);
  }
}