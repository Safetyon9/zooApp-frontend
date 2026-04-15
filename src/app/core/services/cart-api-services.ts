import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CartApiService {

  private url = 'http://localhost:9090/rest/carrelli';

  constructor(private http: HttpClient) {}

  getById(id: number) {
    return this.http.get<any>(
      `${this.url}/findById?id=${id}`
    );
  }

  getOrCreate(userId: number) {
    return this.http.get<any>(
      `${this.url}/getOrCreate/${userId}`
    );
  }
}