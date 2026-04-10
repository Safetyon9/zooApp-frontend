import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { AuthServices } from '../../../core/services/auth-services';
import { UtenteServices } from '../../../core/services/utente-services';
import { Utilities } from '../../../core/utils/utilities';

import { UpdateDialog } from '../../auth/dialog/update-dialog/update-dialog';
import { ConfirmDialog } from '../../auth/dialog/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-info',
  standalone: false,
  templateUrl: './info.html',
  styleUrl: './info.css',
})
export class Info implements OnInit {
  @Input() showProfileSection: boolean = false;

  profilo: any = {};

  constructor(
    public auth: AuthServices,
    private utenteServices: UtenteServices,
    private util: Utilities,
    private cdr: ChangeDetectorRef,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.caricaProfilo();
  }

  private getUserId(): any {
    return this.auth.grant()?.userId;
  }

  private toBoolean(value: any): boolean {
    const normalized = String(value ?? '').trim().toLowerCase();
    return value === true || value === 1 || normalized === 'true' || normalized === '1';
  }

  private mapProfilo(r: any): any {
  return {
    username: r.userName ?? r.username ?? '',
    email: r.email ?? '',
    nome: r.nome ?? '',
    cognome: r.cognome ?? '',
    telefono: r.telefono ?? '',
    indirizzo: r.indirizzo ?? '',
    comune: r.comune ?? '',
    cap: r.cap ?? '',
    provincia: r.provincia ?? '',
    isValidate: this.toBoolean(r.isValidate ?? r.validate)
  };
}

  private caricaProfilo(): void {
    const userId = this.getUserId();
    if (!userId) return;

    this.utenteServices.findAllByUserName(userId).subscribe({
      next: (r: any) => {
        console.log('PROFILO BACKEND:', JSON.stringify(r));
        this.profilo = this.mapProfilo(r);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Errore caricamento profilo:', err);
      }
    });
  }

  modificaProfilo(): void {
    const dialogRef = this.util.openDialog(
      UpdateDialog,
      { account: this.profilo, mode: 'U' },
      { width: '90vw', maxWidth: '1200px', height: 'auto' }
    );

    dialogRef?.afterClosed()?.subscribe((resp: any) => {
      if (!resp) return;
      this.caricaProfilo();
    });
  }

  // USA USERNAME AL POSTO DI EMAIL
  inviaMailValidazione(): void {
    const username = this.profilo?.username;
    if (!username) {
      alert('Username non disponibile.');
      return;
    }

    this.utenteServices.inviaMailValidazione(username).subscribe({
      next: () => {
        alert('Mail di validazione inviata con successo.');
      },
      error: (err: any) => {
        console.error('Errore invio mail di validazione', err);
        alert('Errore durante l\'invio della mail di validazione.');
      }
    });
  }

  delete(): void {
    const username = this.profilo?.username;
    if (!username) return;

    const dialogRef = this.dialog.open(ConfirmDialog, {
      width: '400px',
      data: { message: `Sei sicuro di voler eliminare l'utente "${username}"?` }
    });

    dialogRef.afterClosed().subscribe((conferma: boolean) => {
      if (!conferma) return;

      this.utenteServices.delete(username).subscribe({
        next: () => {
          this.auth.resetAll();
          window.location.href = '/';
        },
        error: (err: any) => {
          console.error('Errore eliminazione utente', err);
        }
      });
    });
  }
}