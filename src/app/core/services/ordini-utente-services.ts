import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs/operators';

export interface OrdineUtenteDTO {
  id?: number;
  clienteId?: number;
  nome?: string;
  cognome?: string;
  indirizzo?: string;
  dataOrdine?: string;
  stato?: string;
  righe?: OggettiOrdiniDTO[];
}

export interface OrdineUtenteReq {
  id?: number;
  clienteId: number;
  indirizzo: string;
}

export interface OggettiOrdiniDTO {
  id?: number;
  itemId?: number;
  nomeItem?: string;
  quantita?: number;
  prezzoUnitario?: number;
  prezzoTotale?: number;
  ordineId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class OrdineUtenteServices {
  private url = 'http://localhost:9090/rest/ordine/';
  private _ordiniUtente = signal<OrdineUtenteDTO[]>([]);

  constructor(private http: HttpClient) {}

  ordiniUtente() {
    return this._ordiniUtente();
  }

  listByUtente(clienteId: number) {
    const params = new HttpParams().set('clienteId', clienteId.toString());
    return this.http.get<OrdineUtenteDTO[]>(this.url + 'list', { params }).pipe(
      tap(resp => this._ordiniUtente.set(resp))
    );
  }

  createForUtente(body: OrdineUtenteReq) {
    return this.http.post<OrdineUtenteDTO>(this.url + 'create', body).pipe(
      tap(() => this.listByUtente(body.clienteId).subscribe())
    );
  }

  updateForUtente(body: OrdineUtenteReq) {
    return this.http.put<OrdineUtenteDTO>(this.url + 'update', body).pipe(
      tap(() => this.listByUtente(body.clienteId).subscribe())
    );
  }

  deleteForUtente(id: number, clienteId: number) {
    return this.http.delete(`${this.url}delete/${id}`).pipe(
      tap(() => this.listByUtente(clienteId).subscribe())
    );
  }

  getById(id: number) {
    return this.http.get<OrdineUtenteDTO>(this.url + 'get/' + id);
  }
}