import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ItemsServices {
  private baseUrl = "http://localhost:9090/rest/";
  
  prodotti = signal<any[]>([]);
  biglietti = signal<any[]>([]);

  constructor(private http: HttpClient) {}

  private setItems(tipo: 'prodotto' | 'biglietti', res: any[]) {
    if (tipo === 'prodotto') this.prodotti.set(res);
    else this.biglietti.set(res);
  }

  search(req: any, tipo: 'prodotto' | 'biglietti') {
    return this.http.post<any[]>(`${this.baseUrl}${tipo}/search`, req)
      .pipe(tap(res => this.setItems(tipo, res)));
  }

  list(tipo: 'prodotto' | 'biglietti') {
    return this.http.get<any[]>(`${this.baseUrl}${tipo}/list`)
      .pipe(tap(res => this.setItems(tipo, res)));
  }

  getById(id: number, tipo: 'prodotto' | 'biglietti') {
    return this.http.get<any>(
      `${this.baseUrl}${tipo}/getById`,
      { params: { id } }
    );
  }

}
