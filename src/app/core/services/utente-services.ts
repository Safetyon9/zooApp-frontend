import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { tap } from 'rxjs/operators';

export interface ClienteDto {
  id?: number;
  userName?: string;
  email?: string;
  role?: string;
  nome?: string;
  cognome?: string;
  telefono?: string;
  utenteUsername?: string;
  indirizzo?: string;
  comune?: string;
  cap?: string;
  provincia?: string | null;
  carrelloId?: number | null;
  ordini?: any[] | null;
  isOnline?: boolean;     // aggiunto
  online?: boolean;       // opzionale se il backend lo manda così
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
    return this.http.put(this.url + 'update', body);
  }

  changePwd(body: {}) {
    return this.http.put(this.url + 'changePwd', body);
  }
  inviaMailValidazione(userName: string) {
  return this.http.get(this.url +'sendValidation?id=' + userName, {} );
}

  logout(userName: string) {
    console.log("LOGOUT SU UTENTE SERVICES")
    return this.http.post(this.url + 'logout/' + userName, {});
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

    return this.http.get<ClienteDto[]>(this.url + 'list', { params }).pipe(
      tap((resp) => this._accounts.set(resp))
    );
  }

  findByUserName(userName: string) {
    const params = new HttpParams().set('userName', userName);
    return this.http.get(this.url + 'findByUserName', { params });
  }

  delete(userName: string) {
  return this.http.delete(`${this.url}delete/${userName}`);
}

  findAllByUserName(userName: string) {
    const params = new HttpParams().set('userName', userName);
    return this.http.get(this.url + 'findAllByUserName', { params });
  }
}