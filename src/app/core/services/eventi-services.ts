import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EventiServices {

  private url = "http://localhost:9090/rest/eventi/";

  eventi = signal<any[]>([]);

  constructor(private http: HttpClient) { }

  list() {
    this.http.get<any[]>(this.url + "list")
      .subscribe(res => this.eventi.set(res));
  }

  create(body: {}) {
    return this.http.post(this.url + "create", body)
      .pipe(tap(() => this.list()));
  }

  update(body: {}) {
    return this.http.put(this.url + "update", body)
      .pipe(tap(() => this.list()));
  }

  delete(id: number) {
    return this.http.delete(this.url + "delete/" + id)
      .pipe(tap(() => this.list()));
  }

  getById(id: number) {
    return this.http.get(this.url + "get/" + id);
  }
}