import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs/operators';

export interface CouponDto {
  id?: number;
  codice?: string;
  tipo?: string;
  valore?: number;
  inizioValidita?: string;
  fineValidita?: string;
  attivo?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class CouponsServices {

  private url = 'http://localhost:9090/rest/coupons/';
  private _coupons = signal<CouponDto[]>([]);

  constructor(private http: HttpClient) {}

  coupons() {
    return this._coupons();
  }

  list() {
    return this.http.get<CouponDto[]>(this.url + 'list').pipe(
      tap((resp) => this._coupons.set(resp || []))
    );
  }

  create(body: {}) {
    return this.http.post(this.url + 'create', body);
  }

  update(body: {}) {
    return this.http.put(this.url + 'update', body);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}delete/${id}`);
  }

  getById(id: number) {
    return this.http.get<CouponDto>(this.url + 'get/' + id);
  }
}