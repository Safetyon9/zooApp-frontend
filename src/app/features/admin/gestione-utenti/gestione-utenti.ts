import { Component, OnInit } from '@angular/core';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { UtenteServices } from '../../../shared/services/utente-services';

@Component({
  selector: 'app-gestione-utente',
  templateUrl: './gestione-utenti.html',
  styleUrls: ['./gestione-utenti.css'],
  standalone: false
})
export class GestioneUtente implements OnInit {
  userName: string | null = null;
  nome: string | null = null;
  cognome: string | null = null;

  profili: any[] = [];

  constructor(public utenteServices: UtenteServices) {}

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.utenteServices.list(
      this.userName ?? undefined,
      this.nome ?? undefined,
      this.cognome ?? undefined
    );

    const utentiBase = this.utenteServices.accounts();

    if (!utentiBase || utentiBase.length === 0) {
      setTimeout(() => this.loadProfiliCompleti(), 300);
      return;
    }

    this.loadProfiliCompleti();
  }

  loadProfiliCompleti(): void {
    const utentiBase = this.utenteServices.accounts();

    if (!utentiBase || utentiBase.length === 0) {
      this.profili = [];
      return;
    }

    const chiamate = utentiBase.map((u: any) =>
      this.utenteServices.findAllByUserName(u.userName ?? u.utenteUsername).pipe(
        catchError((err) => {
          console.error('Errore dettaglio profilo:', err);
          return of(null);
        })
      )
    );

    forkJoin(chiamate).subscribe({
      next: (results: any[]) => {
        this.profili = results
          .filter((r) => r != null)
          .map((r: any) => ({
            username: r.userName ?? '',
            email: r.email ?? '',
            nome: r.nome ?? '',
            cognome: r.cognome ?? '',
            telefono: r.telefono ?? '',
            indirizzo: r.indirizzo ?? '',
            comune: r.comune ?? '',
            cap: r.cap ?? '',
            provincia: r.provincia ?? ''
          }));

        console.log('PROFILI COMPLETI:', this.profili);
      },
      error: (err: any) => {
        console.error('Errore caricamento profili completi', err);
      }
    });
  }

  create(): void {
    console.log('Creazione nuovo cliente');
  }

  onSelectedCliente(cliente: any): void {
    console.log('Cliente selezionato:', cliente);
  }

  modificaProfilo(cliente: any): void {
    console.log('Modifica profilo:', cliente);
  }
}