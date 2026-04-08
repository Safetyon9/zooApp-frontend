import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class AttributiProdottiServices {
  private url = "http://localhost:9090/rest/prodotti";

  constructor(private http: HttpClient) {}

  search(req: any) {
    return this.http.post(`${this.url}/search`, req);
  }

  list() {
    return this.http.get(`${this.url}/list`);
  }

  getBySku(sku: number) {
    return this.http.get(`${this.url}/sku/${sku}`);
  }
}