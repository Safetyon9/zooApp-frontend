import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';
import { ItemsServices } from './items-services';

@Injectable({
  providedIn: 'root',
})
export class ProdottoServices {

  private url = "http://localhost:9090/rest/prodotto/";

  constructor(private http: HttpClient,
              private ItemsServices:ItemsServices

  ) { }

  create(body:{}){
    return this.http.post(this.url + "create", body)
      .pipe(tap(() => this.ItemsServices.list('prodotto')))
  }

  update(body:{}){
    return this.http.put(this.url + "update", body)
      .pipe(tap(() => this.ItemsServices.list('prodotto')))
  }

}
