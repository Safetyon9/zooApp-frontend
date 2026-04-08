import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
export interface ClienteDto {
  id: number;
  nome: string;
  cognome: string;
  telefono: string;
  utenteUsername: string;
  indirizzo: string;
  comune: string;
  cap: string;
  provincia: string | null;
  carrelloId: number | null;
  ordini: any[] | null;
}
@Injectable({
  providedIn: 'root',
})


export class UtenteServices {
  private url = 'http://localhost:9090/rest/utente/';

  private _accounts = signal<ClienteDto[]>([]);

  constructor(private http: HttpClient) {}

  accounts() {
    return this._accounts();
  }

  login(body: {}) {
    return this.http.post(this.url + 'login', body);
  }

  create(body: {}) {
    return this.http.post(this.url + 'create', body);
  }

  update(body: {}) {
    return this.http.put(this.url + 'Allupdate', body);
  }

  changePwd(body: {}) {
    return this.http.put(this.url + 'changePwd', body);
  }

  list(userName?: string, nome?: string, cognome?: string, role?: string) {
    let params = new HttpParams();

    if (userName) {
      params = params.set('userName', userName);
    }
    if (nome) {
      params = params.set('nome', nome);
    }
    if (cognome) {
      params = params.set('cognome', cognome);
    }
    if (role) {
      params = params.set('role', role);
    }

    this.http.get<any[]>(this.url + 'list', { params }).subscribe({
      next: (resp) => this._accounts.set(resp),
      error: (err: any) => console.error('Errore caricamento utenti', err),
    });
  }

  findByUserName(userName: string) {
    const params = new HttpParams().set('userName', userName);
    return this.http.get(this.url + 'findByUserName', { params });
  }

  delete(userName: string) {
    const params = new HttpParams().set('userName', userName);
    return this.http.delete(this.url + 'delete', { params });
  }

  findAllByUserName(id:string){
    const params = new HttpParams().set("userName", id);
    return this.http.get(this.url + "findAllByUserName", {params});
  }
  
}
