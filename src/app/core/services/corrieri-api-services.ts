import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CorriereDTO {
  id: number;
  nome: string;
}

@Injectable({
  providedIn: 'root'
})
export class CorrieriApiService {

  private baseUrl = 'http://localhost:9090/rest/corrieri';

  constructor(private http: HttpClient) {}

  list(): Observable<CorriereDTO[]> {
    return this.http.get<CorriereDTO[]>(`${this.baseUrl}/list`);
  }

  create(body: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, body);
  }

  update(body: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, body);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }
}
