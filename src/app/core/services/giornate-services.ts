import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs/operators';
import { EventoDto } from './eventi-services';

export interface GiornateDto {
  id?: number;
  data: string;
  stock: number;
  aperto: boolean;
  evento?: EventoDto;
}

@Injectable({
  providedIn: 'root',
})
export class GiornateServices {
  private url = 'http://localhost:9090/rest/giornate/';
  private _giornate = signal<GiornateDto[]>([]);

  constructor(private http: HttpClient) { }

  giornate() {
    return this._giornate();
  }

  list() {
    return this.http.get<GiornateDto[]>(this.url + 'list').pipe(
      tap((resp) => this._giornate.set(resp))
    );
  }

  create(body: GiornateDto) {
    return this.http.post(this.url + 'create', body);
  }

  update(body: GiornateDto) {
    return this.http.put(this.url + 'update', body);
  }

  delete(id: number) {
    return this.http.delete(`${this.url}delete/${id}`);
  }

  getById(id: number) {
    return this.http.get<GiornateDto>(this.url + 'get/' + id);
  }

  getByDate(date: string) {
    return this.http.get<GiornateDto>(this.url + 'getByDate/' + date);
  }
}
