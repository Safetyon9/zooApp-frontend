import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { ItemsServices } from './items-services';

@Injectable({
  providedIn: 'root',
})
export class BigliettoServices {

  private url = "http://localhost:9090/rest/biglietti/";
  private urlTipo = "http://localhost:9090/rest/tipibiglietti/";
  constructor(
    private http: HttpClient,
    private itemsS: ItemsServices
  ) {}

  getTipi() {
    return this.http.get<any[]>('http://localhost:9090/rest/tipibiglietti/list');
  }

  create(body: {}) {
    return this.http.post(this.url + "create", body)
      .pipe(tap(() => this.itemsS.list('biglietti')));
  }

  update(body: {}) {
    return this.http.put(this.url + "update", body)
      .pipe(tap(() => this.itemsS.list('biglietti')));
  }

  delete(id: number) {
    return this.http.delete(this.url + "delete/" + id)
      .pipe(tap(() => this.itemsS.list('biglietti')));
  }

  createTipo(body: any) {
  return this.http.post(this.urlTipo + 'create', body);
}

updateTipo(body: any) {
  return this.http.put(this.urlTipo + 'update', body);
}

deleteTipo(id: number) {
  return this.http.delete(this.urlTipo + "delete/" + id);
}
}