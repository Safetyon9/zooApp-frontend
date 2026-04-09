import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { ItemsServices } from './items-services';

@Injectable({
  providedIn: 'root',
})
export class ProdottoServices {

  private url = "http://localhost:9090/rest/prodotto/";

  constructor(
    private http: HttpClient,
    private itemsS: ItemsServices
  ) {}

  getCategorie() {
    return this.http.get<any[]>('http://localhost:9090/rest/categorie/list');
  }

  create(body: {}) {
    return this.http.post(this.url + "create", body)
      .pipe(tap(() => this.itemsS.list('prodotto')));
  }

  update(body: {}) {
    return this.http.put(this.url + "update", body)
      .pipe(tap(() => this.itemsS.list('prodotto')));
  }

  delete(id: number) {
    return this.http.delete(this.url + "delete/" + id)
      .pipe(tap(() => this.itemsS.list('prodotto')));
  }
}