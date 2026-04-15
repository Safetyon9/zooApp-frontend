import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
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
    private ordiniService: OrdiniServices,
    private http: HttpClient

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

  salvaRicevutaPdf(file: File, pagamentoId: number, idRicevuta: string) {
  const formData = new FormData();
  formData.append('file', file, file.name);
  formData.append('pagamentoId', String(pagamentoId));
  formData.append('idRicevuta', idRicevuta);

  return this.http.post<any>('http://localhost:9090/rest/upload/ricevuta', formData);
}
}