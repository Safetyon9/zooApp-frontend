import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs/operators';

export interface PagamentoDTO {
  id?: number;
  metodoPagamento?: string;
  stato?: string;
  idRicevuta?: number;
  ordineId?: number;
}

export interface OrdineDTO {
  id?: number;
  clienteId?: number;
  nome?: string;
  cognome?: string;
  indirizzo?: string;
  dataOrdine?: string;
  stato?: string;
  righe?: any[];
  pagamento?: PagamentoDTO | null;
}

export interface OrdiniReq {
  id?: number;
  clienteId: number;
  indirizzo: string;
}

@Injectable({
  providedIn: 'root',
})
export class OrdiniServices {

  private url = 'http://localhost:9090/rest/ordine/';
  private urlP = `http://localhost:9090/rest/pagamenti/`;
  private _ordini = signal<OrdineDTO[]>([]);

  constructor(private http: HttpClient) {}

  ordini() {
    return this._ordini();
  }

  list(clienteId?: number) {
    let params = new HttpParams();
    if (clienteId) params = params.set('clienteId', clienteId);

    return this.http.get<OrdineDTO[]>(this.url + 'list', { params }).pipe(
      tap(resp => this._ordini.set(resp))
    );
  }

  listByUtente(clienteId: number) {
  return this.http.get<OrdineDTO[]>(this.url + 'my-list/' + clienteId).pipe(
    tap(resp => this._ordini.set(resp))
  );
}

  create(body: OrdiniReq) {
    return this.http.post<OrdineDTO>(this.url + 'create', body).pipe(
      tap(() => this.list())
    );
  }

  update(body: OrdiniReq) {
    return this.http.put<OrdineDTO>(this.url + 'update', body).pipe(
      tap(() => this.list())
    );
  }

  delete(id: number) {
    return this.http.delete(`${this.url}delete/${id}`).pipe(
      tap(() => this.list())
    );
  }

  getById(id: number) {
    return this.http.get<OrdineDTO>(this.url + 'findById/' + id);
  }

  getPagamentoById(id: number) {
    return this.http.get<PagamentoDTO>(this.urlP + 'findById/' + id);
  }

}