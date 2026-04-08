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
        console.log('RISPOSTA BACKEND LIST:', resp);

        this.profili = (resp || []).map((r: any) => ({
          userName: r.userName ?? r.username ?? r.utenteUsername ?? '',
          email: r.email ?? '',
          role: r.role ?? '',
          nome: r.nome ?? '',
          cognome: r.cognome ?? '',
          indirizzo: r.indirizzo ?? '',
          comune: r.comune ?? '',
          cap: r.cap ?? '',
          telefono: r.telefono ?? '',
          provincia: r.provincia ?? '',
          expanded: false,
          loadingDettaglio: false,
          dettaglioCaricato: false,
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
    if (!profilo.isCliente) {
      return;
    }

    // chiudi se già aperto
    if (profilo.expanded) {
      profilo.expanded = false;
      this.cdr.detectChanges();
      return;
    }

    // se già caricato, solo apri
    if (profilo.dettaglioCaricato) {
      profilo.expanded = true;
      this.cdr.detectChanges();
      return;
    }

    // carica dettaglio da backend
    profilo.loadingDettaglio = true;
    this.cdr.detectChanges();

    this.utenteServices.findAllByUserName(profilo.userName).subscribe({
      next: (r: any) => {
        console.log('DETTAGLIO BACKEND:', r);

        profilo.nome = r.nome ?? '';
        profilo.cognome = r.cognome ?? '';
        profilo.telefono = r.telefono ?? '';
        profilo.indirizzo = r.indirizzo ?? '';
        profilo.comune = r.comune ?? '';
        profilo.cap = r.cap ?? '';
        profilo.provincia = r.provincia ?? '';

        profilo.dettaglioCaricato = true;
        profilo.loadingDettaglio = false;
        profilo.expanded = true;

        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Errore caricamento dettaglio utente', err);
        profilo.loadingDettaglio = false;
        this.cdr.detectChanges();
      }
    });
  }

  create(): void {
    console.log('Creazione nuovo cliente');
  }

  modificaProfilo(profilo: any): void {
    const dialogRef = this.util.openDialog(
      UpdateDialog,
      { account: { ...profilo }, mode: 'U' },
      { width: '720px', maxWidth: '95vw', height: 'auto' }
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