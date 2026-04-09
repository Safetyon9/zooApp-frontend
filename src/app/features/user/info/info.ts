import { Component, Input, OnInit } from '@angular/core';
import { AuthServices } from '../../../core/services/auth-services';
import { UtenteServices } from '../../../core/services/utente-services';
import { Utilities } from '../../../core/utils/utilities';
import { ChangeDetectorRef } from '@angular/core';
import { UpdateDialog } from '../../auth/dialog/update-dialog/update-dialog';

@Component({
  selector: 'app-info',
  standalone: false,
  templateUrl: './info.html',
  styleUrl: './info.css',
})
export class Info implements OnInit{
  @Input() showProfileSection: boolean = false;

  profilo: any = {};

  constructor(
    public auth: AuthServices,
    private utenteServices: UtenteServices,
    private util: Utilities,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userId = this.auth.grant()?.userId;
    if (!userId) return;

    this.utenteServices.findAllByUserName(userId).subscribe({
      next: (r: any) => {
        console.log('PROFILO BACKEND:', JSON.stringify(r));

        this.profilo = this.profilo = {
          username: r.userName ?? '',
          email: r.email ?? '',
          nome: r.nome ?? '',
          cognome: r.cognome ?? '',
          telefono: r.telefono ?? '',
          indirizzo: r.indirizzo ?? '',
          comune: r.comune ?? '',
          cap: r.cap ?? '',
          provincia: r.provincia ?? ''
        };
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('error getAccount:', err);
      }
    });
  }

  modificaProfilo(): void {
  const dialogRef = this.util.openDialog(
    UpdateDialog,
    { account: this.profilo, mode: 'U' },
    { width: '90vw', maxWidth: '1200px', height: 'auto' }
  );

  dialogRef.afterClosed().subscribe((resp: any) => {
    if (!resp) return;

    const userId = this.auth.grant()?.userId;
    if (!userId) return;

    this.utenteServices.findAllByUserName(userId).subscribe({
      next: (r: any) => {
        this.profilo = {
          username: r.userName ?? '',
          email: r.email ?? '',
          nome: r.nome ?? '',
          cognome: r.cognome ?? '',
          telefono: r.telefono ?? '',
          indirizzo: r.indirizzo ?? '',
          comune: r.comune ?? '',
          cap: r.cap ?? '',
          provincia: r.provincia ?? ''
        };
        this.cdr.detectChanges();
      }
    });
  });
}

  delete(): void {
    const username = this.profilo?.username;

    if (!username) {
      console.error('Username profilo non trovato');
      return;
    }

    const conferma = confirm(`Sei sicuro di voler eliminare l'utente "${username}"?`);
    if (!conferma) {
      return;
    }

    this.utenteServices.delete(username).subscribe({
      next: () => {
        this.auth.resetAll();
        window.location.href = '/';
      },
      error: (err: any) => {
        console.error('Errore eliminazione utente', err);
      }
    });
  }
}