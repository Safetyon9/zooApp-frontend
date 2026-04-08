import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ItemsServices {
  private baseUrl = "http://localhost:9090/rest/";
  
  prodotti = signal<any[]>([]);
  biglietti = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  search(req: any, tipo: 'prodotto' | 'biglietti') {
    if(tipo === 'prodotto') {
      this.http.post<any[]>(`${this.baseUrl}${tipo}/search`, req)
        .subscribe(res => this.prodotti.set(res));
    } else {
      this.http.post<any[]>(`${this.baseUrl}${tipo}/search`, req)
        .subscribe(res => this.biglietti.set(res));
    }
  }

  list(tipo: 'prodotto' | 'biglietti') {
    if(tipo === 'prodotto') {
      this.http.get<any[]>(`${this.baseUrl}${tipo}/list`)
        .subscribe(res => this.prodotti.set(res));
    } else {
      this.http.get<any[]>(`${this.baseUrl}${tipo}/list`)
        .subscribe(res => this.biglietti.set(res));
    }
  }

}
