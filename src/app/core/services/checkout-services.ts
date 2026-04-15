import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from './cart-service';

import { MetodiPagamentoApiService } from './metodi-pagamento-api-services';
import { CouponsServices } from './coupons-services';
import { OrdiniServices } from './ordini-services';

import { map } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  private cartService = inject(CartService);
  private router = inject(Router);

  constructor(
    private metodiPagamentoApiService: MetodiPagamentoApiService,
    private couponsService: CouponsServices,
    private ordiniService: OrdiniServices
  ) {}

  getMetodiPagamento() {
    return this.metodiPagamentoApiService.list();
  }

  verificaCouponRemoto(codice: string, subtotale: number) {
    return this.couponsService.list().pipe(
      map(coupons => {
        const coupon = coupons.find(c =>
          c.codice === codice && c.attivo
        );

        if (!coupon) {
          return {
            valido: false,
            sconto: 0,
            msg: 'Coupon non valido o scaduto',
            couponId: null
          };
        }

        const sconto = coupon.tipo === 'PERCENTUALE'
          ? subtotale * (coupon.valore! / 100)
          : Number(coupon.valore);

        return {
          valido: true,
          sconto,
          msg: `Coupon applicato! Sconto: €${sconto.toFixed(2)}`,
          couponId: coupon.id
        };
      })
    );
  }

  confermaOrdine(body: any) {
    return this.ordiniService.create(body);
  }

  svuotaCarrello() {
    this.cartService.clear();
  }

  svuotaERedirect() {
    //this.cartService.clear();
    this.router.navigate(['/pagamento-ricevuto']);
  }
}