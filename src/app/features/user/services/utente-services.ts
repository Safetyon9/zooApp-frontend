import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtenteServices {
  private url = "http://localhost:9090/rest/utente/";

  constructor(private http:HttpClient){}

  login(body:{}){
    return this.http.post(this.url + "login", body);
  }
  create(body:{}){
    return this.http.post(this.url + "create", body);
  }

  update(body:{}){
    return this.http.put(this.url + "update", body);
  }
  changePwd(body:{}){
    return this.http.put(this.url + "changePwd", body);
  }

  findByUserName(id:string){
    const params = new HttpParams().set("userName", id);
    return this.http.get(this.url + "findByUserName", {params});
  }

  findAllByUserName(id:string){
    const params = new HttpParams().set("userName", id);
    return this.http.get(this.url + "findAllByUserName", {params});
  }

}