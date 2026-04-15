import { Injectable } from '@angular/core';

import { MetodiPagamentoApiService } from './metodi-pagamento-api-services';
import { CouponsServices } from './coupons-services';
import { OrdiniServices } from './ordini-services';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {

  constructor(
    private metodiPagamentoApiService: MetodiPagamentoApiService,
    private couponsService: CouponsServices,
    private ordiniService: OrdiniServices
  ) {}

  getMetodiPagamento() {
    return this.metodiPagamentoApiService.list();
  }

  verificaCoupon(codice: string) {
    return this.couponsService.getByCodice(codice);
  }

  creaOrdine(body: any) {
    return this.ordiniService.create(body);
  }
}