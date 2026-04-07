import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { UtenteServices } from '../../user/services/utente-services';

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

  constructor(
    public accountServices: UtenteServices,
    private dialogRef: MatDialogRef<GestioneUtente>
  ) {}

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

  close() {
    this.dialogRef.close();
  }
}
