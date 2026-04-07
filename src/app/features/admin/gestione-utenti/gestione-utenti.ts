import { Component, inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UtenteServices } from '../../../shared/services/utente-services';

@Component({
  selector: 'app-gestione-utente',
  standalone: false,
  templateUrl: './gestione-utenti.html',
  styleUrls: ['./gestione-utenti.css'],
})
export class GestioneUtente implements OnInit {
  userName: any = null;
  nome: any = null;
  cognome: any = null;
  role: any = null;

  readonly dialog = inject(MatDialog);

  constructor(public accountServices: UtenteServices) {}

  get accounts() {
    return this.accountServices.accounts();
  }

  ngOnInit(): void {
    this.accountServices.list();
  }

  search() {
    this.accountServices.list(this.userName, this.nome, this.cognome, this.role);
  }

  create() {
    console.log('Creazione nuovo account');
  }

  onSelectedAccount(acc: any) {
    console.log(acc);
  }

  deleteAccount(acc: any, event: Event) {
    event.stopPropagation();

    this.accountServices.delete(acc.userName).subscribe({
      next: () => {
        this.accountServices.list(this.userName, this.nome, this.cognome, this.role);
      },
      error: (err: any) => {
        console.error('Errore eliminazione utente', err);
      }
    });
  }
}
