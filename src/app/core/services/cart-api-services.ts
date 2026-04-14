import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

export interface OggettiCarrelliReq {
  id?: number;

  carrelloId: number;
  itemId: number;

  quantita: number;

  prezzoUnitario?: number;
  prezzoTotale?: number;
}

@Injectable({
  providedIn: 'root'
})
export class CartApiService {

  private url = 'http://localhost:9090/rest/oggettiCarrelli/';

  constructor(private http: HttpClient) {}

  create(req: OggettiCarrelliReq) {
    return this.http.post(this.url + 'create', req);
  }

  update(req: Partial<OggettiCarrelliReq>) {
    return this.http.put(this.url + 'update', req);
  }

  delete(id: number) {
    return this.http.delete(this.url + 'delete/' + id);
  }

  list() {
    return this.http.get(this.url + 'list');
  }

  getById(id: number) {
    return this.http.get(this.url + 'getById?id=' + id);
  }

  getCarrelloById(id: number) {
    return this.http.get<any>(
      `http://localhost:9090/rest/carrelli/findById?id=${id}`
    );
  }

  getOrCreate(userId: number) {
    return this.http.get<any>(
      `${this.url}getOrCreate/${userId}`
    );
  }
}