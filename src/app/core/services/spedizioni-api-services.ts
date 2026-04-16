import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface SpedizioneDTO {
  id?: number;
  corriereId?: number;
  trackingNumber?: string;
  costo?: number;
  stato?: string;
  dataAggiornamento?: string;
  ordineId?: number;
}

@Injectable({
  providedIn: 'root',
})
export class SpedizioniApiServices {

  private baseUrl = 'http://localhost:9090/rest/spedizioni';

  constructor(private http: HttpClient) {}

  list(): Observable<SpedizioneDTO[]> {
    return this.http.get<SpedizioneDTO[]>(`${this.baseUrl}/list`);
  }

  getById(id: number): Observable<SpedizioneDTO> {
    return this.http.get<SpedizioneDTO>(
      `${this.baseUrl}/findById`,
      { params: { id } }
    );
  }

  create(body: SpedizioneDTO): Observable<any> {
    return this.http.post(`${this.baseUrl}/create`, body);
  }

  update(body: SpedizioneDTO): Observable<any> {
    return this.http.put(`${this.baseUrl}/update`, body);
  }

  delete(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

  getByOrdineId(ordineId: number): Observable<SpedizioneDTO> {
    return this.http.get<SpedizioneDTO>(
      `${this.baseUrl}/findByOrdineId/${ordineId}`
    );
  }
}