import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs/operators';

export interface EventiDto {
  id?: number;
  tipoEvento?: string;
  dataInizio?: string;
  dataFine?: string;
  descrizione?: string;
}
//cancellalo
@Injectable({
  providedIn: 'root',
})
export class EventiServices {

  private url = 'http://localhost:9090/rest/eventi/';

  private _eventi = signal<EventiDto[]>([]);

  constructor(private http: HttpClient) {}

  eventi() {
    return this._eventi();
  }

  list() {
    return this.http.get<EventiDto[]>(this.url + 'list').pipe(
      tap((resp) => this._eventi.set(resp))
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
    return this.http.get<EventiDto>(this.url + 'get/' + id);
  }
}