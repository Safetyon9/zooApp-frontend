import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ItemsServices {
  private baseUrl = "http://localhost:9090/rest/";
  items = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  search(req: any, tipo: 'prodotti' | 'biglietti') {
    this.http.post<any[]>(`${this.baseUrl}${tipo}/search`, req)
      .subscribe(res => this.items.set(res));
  }

  list(tipo: 'prodotti' | 'biglietti') {
    this.http.get<any[]>(`${this.baseUrl}${tipo}/list`)
      .subscribe(res => this.items.set(res));
  }

}
