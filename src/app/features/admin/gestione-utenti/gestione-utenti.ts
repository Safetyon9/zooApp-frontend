import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UtenteServices } from '../../../core/services/utente-services';
import { Utilities } from '../../../core/utils/utilities';
import { UpdateDialog } from '../../auth/dialog/update-dialog/update-dialog';

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
  loading = false;

  constructor(
    public utenteServices: UtenteServices,
    private util: Utilities,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.loading = true;

    this.utenteServices.list(
      this.userName ?? undefined,
      this.nome ?? undefined,
      this.cognome ?? undefined
    ).subscribe({
      next: (resp: any[]) => {
        console.log('RISPOSTA BACKEND:', resp);

        this.profili = (resp || []).map((r: any) => ({
          userName: r.userName ?? r.username ?? r.utenteUsername ?? '',
          email: r.email ?? '',
          role: r.role ?? '',

          nome: r.nome ?? r.cliente?.nome ?? '',
          cognome: r.cognome ?? r.cliente?.cognome ?? '',
          indirizzo: r.indirizzo ?? r.via ?? r.cliente?.indirizzo ?? '',
          comune: r.comune ?? r.cliente?.comune ?? '',
          cap: r.cap ?? r.cliente?.cap ?? '',
          telefono: r.telefono ?? r.cliente?.telefono ?? '',
          provincia: r.provincia ?? r.cliente?.provincia ?? '',

          expanded: false,
          isCliente: (r.role ?? '') === 'USER'
        }));

        console.log('PROFILI MAPPATI:', this.profili);

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Errore caricamento utenti', err);
        this.profili = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleDettaglio(profilo: any): void {
    if (!profilo.isCliente) return;
    profilo.expanded = !profilo.expanded;
    this.cdr.detectChanges();
  }

  create(): void {
    console.log('Creazione nuovo cliente');
  }

  modificaProfilo(profilo: any): void {
    const dialogRef = this.util.openDialog(
      UpdateDialog,
      { account: { ...profilo }, mode: 'U' },
      { width: '90vw', maxWidth: '1200px', height: 'auto' }
    );

    if (dialogRef?.afterClosed) {
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          this.search();
        }
      });
    }
  }

  eliminaProfilo(profilo: any): void {
    console.log('Elimina profilo:', profilo);

    const conferma = confirm(`Sei sicuro di voler eliminare l'utente "${profilo.userName}"?`);
    if (!conferma) {
      return;
    }

    this.utenteServices.delete(profilo.userName).subscribe({
      next: () => {
        this.profili = this.profili.filter(p => p.userName !== profilo.userName);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Errore eliminazione utente', err);
      }
    });
  }
}