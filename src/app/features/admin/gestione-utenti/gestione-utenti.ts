import { Component, OnInit } from '@angular/core';
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
  role: string | null = null;

  constructor(public UtenteServices: UtenteServices) {}

  get accounts() {
    return this.UtenteServices.accounts();
  }

  ngOnInit(): void {
    this.UtenteServices.list();
  }

  search(): void {
    this.UtenteServices.list(
      this.userName ?? undefined,
      this.nome ?? undefined,
      this.cognome ?? undefined,
      this.role ?? undefined
    );
  }

  create(): void {
    console.log('Creazione nuovo account');
  }

  onSelectedAccount(acc: any): void {
    console.log('Account selezionato:', acc);
  }

  deleteAccount(acc: any, event: Event): void {
    event.stopPropagation();

    this.UtenteServices.delete(acc.userName).subscribe({
      next: () => {
        this.UtenteServices.list(
          this.userName ?? undefined,
          this.nome ?? undefined,
          this.cognome ?? undefined,
          this.role ?? undefined
        );
      },
      error: (err: any) => {
        console.error('Errore eliminazione utente', err);
      }
    });
  }

  
}