import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs/operators';

export interface EventoDto {
  id?: number;
  tipoEvento?: string;
  dataInizio?: string;
  dataFine?: string;
}
//cancellalo
@Injectable({
  providedIn: 'root',
})
export class EventiServices {

  private url = 'http://localhost:9090/rest/eventi/';

  private _eventi = signal<EventoDto[]>([]);

  constructor(private http: HttpClient) {}

  eventi() {
    return this._eventi();
  }

  list() {
    return this.http.get<EventoDto[]>(this.url + 'list').pipe(
      tap((resp) => this._eventi.set(resp))
    );
  }

  search(req: any) {
    this.http.post<any[]>(this.url + "search", req)
      .subscribe(res => this.eventi.set(res));
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
    return this.http.get<EventoDto>(this.url + 'get/' + id);
  }
}