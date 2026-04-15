import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MetodoPagamentoDTO {
  id: number;
  nome: string;
  provider?: string;
}

export interface MetodiPagamentoReq {
  id?: number;
  nome: string;
  provider?: string;
}

@Injectable({
  providedIn: 'root'
})
export class MetodiPagamentoApiService {

  private baseUrl = 'http://localhost:9090/rest/metodiPagamento';

  constructor(private http: HttpClient) {}

  list(): Observable<MetodoPagamentoDTO[]> {
    return this.http.get<MetodoPagamentoDTO[]>(`${this.baseUrl}/list`);
  }

  getById(id: number): Observable<MetodoPagamentoDTO> {
    return this.http.get<MetodoPagamentoDTO>(`${this.baseUrl}/getById`, {
      params: { id }
    });
  }

  create(body: MetodiPagamentoReq): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, body);
  }

  update(body: MetodiPagamentoReq): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, body);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }
}