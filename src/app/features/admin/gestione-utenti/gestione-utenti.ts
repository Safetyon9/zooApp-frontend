import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { UtenteServices } from '../../../core/services/utente-services';
import { Utilities } from '../../../core/utils/utilities';
import { UpdateDialog } from '../../auth/dialog/update-dialog/update-dialog';
import { RegisterDialog } from '../../auth/dialog/register-dialog/register-dialog';

@Component({
  selector: 'app-gestione-utente',
  templateUrl: './gestione-utenti.html',
  styleUrls: ['./gestione-utenti.css'],
  standalone: false
})
export class GestioneUtente implements OnInit {
  filters = {
    userName: '',
    nome: '',
    cognome: '',
    email: '',
    role: '',
    comune: '',
    telefono: ''
  };

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
      this.toQuery(this.filters.userName),
      this.toQuery(this.filters.nome),
      this.toQuery(this.filters.cognome)
    ).subscribe({
      next: (resp: any[]) => {
        const lista = (resp || []).map((r: any) => ({
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
          // Online da isActive (boolean o string)
          isOnline: r.isActive === true || r.isActive === 'true',
          // Validato da isValidate (boolean o string)
          isValidate: r.isValidate === true || r.isValidate === 'true',
          expanded: false,
          loadingDettaglio: false,
          dettaglioCaricato: false,
          isCliente: (r.role ?? '') === 'USER'
        }));

        this.profili = lista.filter((p: any) =>
          this.match(p.userName, this.filters.userName) &&
          this.match(p.nome, this.filters.nome) &&
          this.match(p.cognome, this.filters.cognome) &&
          this.match(p.email, this.filters.email) &&
          this.matchExact(p.role, this.filters.role) &&
          this.match(p.comune, this.filters.comune) &&
          this.match(p.telefono, this.filters.telefono)
        );

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

  resetSearch(): void {
    this.filters = {
      userName: '',
      nome: '',
      cognome: '',
      email: '',
      role: '',
      comune: '',
      telefono: ''
    };
    this.search();
  }

  private norm(value: any): string {
    return String(value ?? '').trim().toLowerCase();
  }

  private toQuery(value: string): string | undefined {
    return this.norm(value) || undefined;
  }

  private match(value: any, filter: string): boolean {
    const f = this.norm(filter);
    return !f || this.norm(value).includes(f);
  }

  private matchExact(value: any, filter: string): boolean {
    const f = this.norm(filter);
    return !f || this.norm(value) === f;
  }

  private caricaDettaglioProfilo(profilo: any, callback?: () => void): void {
    if (!profilo) return;
    if (profilo.dettaglioCaricato) {
      callback?.();
      return;
    }

    profilo.loadingDettaglio = true;
    this.cdr.detectChanges();

    this.utenteServices.findAllByUserName(profilo.userName).subscribe({
      next: (r: any) => {
        Object.assign(profilo, {
          nome: r.nome ?? '',
          cognome: r.cognome ?? '',
          telefono: r.telefono ?? '',
          indirizzo: r.indirizzo ?? '',
          comune: r.comune ?? '',
          cap: r.cap ?? '',
          provincia: r.provincia ?? '',
          email: r.email ?? profilo.email ?? '',
          role: r.role ?? profilo.role ?? '',
          isOnline: !!(r.isOnline ?? r.online ?? r.isonline ?? profilo.isOnline),
          // di nuovo converto isValidate a boolean
          isValidate: r.isValidate === true || r.isValidate === 'true',
          dettaglioCaricato: true,
          loadingDettaglio: false,
          isCliente: (r.role ?? profilo.role ?? '') === 'USER'
        });

        this.cdr.detectChanges();
        callback?.();
      },
      error: (err: any) => {
        console.error('Errore caricamento dettaglio utente', err);
        profilo.loadingDettaglio = false;
        this.cdr.detectChanges();
      }
    });
  }

  toggleDettaglio(profilo: any): void {
    if (!profilo.isCliente) return;

    if (profilo.expanded) {
      profilo.expanded = false;
      this.cdr.detectChanges();
      return;
    }

    this.caricaDettaglioProfilo(profilo, () => {
      profilo.expanded = true;
      this.cdr.detectChanges();
    });
  }

  create(): void {
    const dialogRef = this.util.openDialog(
      RegisterDialog,
      { mode: 'C' },
      { width: '720px', maxWidth: '95vw', height: 'auto' }
    );

    dialogRef?.afterClosed()?.subscribe((result: any) => {
      if (result) setTimeout(() => this.search(), 0);
    });
  }

  modificaProfilo(profilo: any): void {
    this.caricaDettaglioProfilo(profilo, () => {
      const dialogRef = this.util.openDialog(
        UpdateDialog,
        { account: { ...profilo }, mode: 'U' },
        { width: '720px', maxWidth: '95vw', height: 'auto' }
      );

      dialogRef?.afterClosed()?.subscribe((result: any) => {
        if (result) setTimeout(() => this.search(), 0);
      });
    });
  }

  eliminaProfilo(profilo: any): void {
    const conferma = confirm(`Sei sicuro di voler eliminare l'utente "${profilo.userName}"?`);
    if (!conferma) return;

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