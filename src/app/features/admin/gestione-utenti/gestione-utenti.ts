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
          // QUI prendiamo sia isOnline che online, poi forziamo a boolean
          isOnline: !!(r.isOnline ?? r.online ?? r.isonline),
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

  private caricaDettaglioProfilo(profilo: any, callback?: () => void): void {
    if (!profilo) {
      return;
    }

    if (profilo.dettaglioCaricato) {
      callback?.();
      return;
    }

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
        profilo.email = r.email ?? profilo.email ?? '';
        profilo.role = r.role ?? profilo.role ?? '';
        // mantieni coerente anche lo stato online
        profilo.isOnline = !!(r.isOnline ?? r.online ?? r.isonline ?? profilo.isOnline);

        profilo.dettaglioCaricato = true;
        profilo.loadingDettaglio = false;

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
    if (!profilo.isCliente) {
      return;
    }

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
    console.log('Creazione nuovo cliente');
  }

  modificaProfilo(profilo: any): void {
    this.caricaDettaglioProfilo(profilo, () => {
      const dialogRef = this.util.openDialog(
        UpdateDialog,
        {
          account: { ...profilo },
          mode: 'U'
        },
        {
          width: '720px',
          maxWidth: '95vw',
          height: 'auto'
        }
      );

      if (dialogRef?.afterClosed) {
        dialogRef.afterClosed().subscribe((result: any) => {
          if (result) {
            this.search();
          }
        });
      }
    });
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