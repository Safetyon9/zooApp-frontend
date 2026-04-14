import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID, signal } from '@angular/core';
import { EMPTY } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthServices {

  grant = signal({
    isAdmin: false,
    isLogged: false,
    userId: null as string | null,
    carrelloId: null as number | null,
    clienteId: null as number | null
  });

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {

    if (isPlatformBrowser(this.platformId)) {

      console.log('restore---');

      const isLogged = localStorage.getItem("isLogged") === '1';
      const isAdmin = localStorage.getItem("isAdmin") === '1';
      const userId = localStorage.getItem("userId");
      const carrelloId = localStorage.getItem("carrelloId");
      const clienteId = localStorage.getItem("clienteId");

      this.grant.set({
        isAdmin,
        isLogged,
        userId,
        carrelloId: carrelloId ? Number(carrelloId) : null,
         clienteId: clienteId ? Number(clienteId) : null
      });

      console.log('[AuthService] restore', this.grant());
    }
  }

  setAutentificated(userId: any, carrelloId?: number, clienteId?: number) {

    if (isPlatformBrowser(this.platformId)) {

      localStorage.setItem("isLogged", "1");
      localStorage.setItem("userId", userId);

      if (carrelloId !== undefined && carrelloId !== null) {
        localStorage.setItem("carrelloId", String(carrelloId));
      }

      if (clienteId !== undefined && clienteId !== null) {
        localStorage.setItem("clienteId", String(clienteId));
      }

      this.grant.set({
        isAdmin: false,
        isLogged: true,
        userId,
        carrelloId: carrelloId ?? null,
        clienteId: clienteId ?? null
      });
    }

    return EMPTY;
  }

  setAdmin() {
    if (isPlatformBrowser(this.platformId)) {

      localStorage.setItem("isAdmin", "1");

      this.grant.update(grant => ({
        ...grant,
        isAdmin: true,
        carrelloId: null
      }));
    }
    return EMPTY;
  }

  setUser() {
    if (isPlatformBrowser(this.platformId)) {

      localStorage.setItem("isAdmin", "0");

      this.grant.update(grant => ({
        ...grant,
        isAdmin: false
      }));
    }
    return EMPTY;
  }

  resetAll() {

    if (isPlatformBrowser(this.platformId)) {

      localStorage.removeItem("isAdmin");
      localStorage.removeItem("isLogged");
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("carrelloId");

      this.grant.set({
        isAdmin: false,
        isLogged: false,
        userId: null,
        carrelloId: null,
        clienteId: null
      });
    }

    return EMPTY;
  }

  logout() {
    this.resetAll();
  }

  isAutentificated(): boolean {
    return this.grant().isLogged;
  }

  isRoleAdmin(): boolean {
    return this.grant().isAdmin;
  }

  isUserWithCart(): boolean {
    const g = this.grant();
    return g.isLogged && !g.isAdmin && !!g.carrelloId;
  }

  getCarrelloId(): number | null {
    return this.grant().carrelloId;
  }

  getClienteId(): number | null {
    return this.grant().clienteId;
  }
}