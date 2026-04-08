import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ProdottiServices {

  private url = "http://localhost:9090/rest/prodotti/";
  prodotti = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  search(req: any) {
    this.http.post(this.url + "search", req)
      .subscribe({
        next: (r: any) => this.prodotti.set(r),
      });
  }

  list() {
    this.http.get(this.url + "list")
      .subscribe({
        next: (r: any) => this.prodotti.set(r),
      });
  }
}