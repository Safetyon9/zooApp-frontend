import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UploadServices {

  private url = "http://localhost:9090/rest/upload/";

  constructor(private http: HttpClient) {}

  upload(file: File, id: number, tipo: string) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('id', id.toString());
    formData.append('tipo', tipo);

    return this.http.post<any>(this.url + "image", formData);
  }

  getUrl(filename: string) {
    const params = new HttpParams().set("filename", filename);
    return this.http.get<any>(this.url + "getUrl", { params });
  }
}