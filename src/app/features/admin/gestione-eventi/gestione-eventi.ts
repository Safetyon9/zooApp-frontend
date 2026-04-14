import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Utilities } from '../../../core/utils/utilities';
import { EventiServices } from '../../../core/services/eventi-services';
import { EventoDialog } from './evento-dialog/evento-dialog';
import { ConfirmDialog } from '../../auth/dialog/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-gestione-eventi',
  templateUrl: './gestione-eventi.html',
  styleUrls: ['./gestione-eventi.css'],
  standalone: false
})
export class GestioneEventi implements OnInit {

  eventi: any[] = [];
  loading = false;

  constructor(
    private eventiS: EventiServices,
    private util: Utilities,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.loading = true;

    this.eventiS.list().subscribe({
      next: (resp: any[]) => {

        this.eventi = (resp || []).map((e: any) => ({
          id: e.id ?? '',
          tipoEvento: e.tipoEvento ?? '',
          dataInizio: e.dataInizio ?? '',
          dataFine: e.dataFine ?? '',
          descrizione: e.descrizione ?? ''
        }));

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Errore caricamento eventi', err);
        this.eventi = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onCreateEvento(): void {
    const dialogRef = this.util.openDialog(
      EventoDialog,
      {
        mod: 'C',
        evento: null
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
          setTimeout(() => {
            this.search();
          }, 0);
        }
      });
    }
  }

  eseguoUpdate(evento: any): void {
    const dialogRef = this.util.openDialog(
      EventoDialog,
      {
        mod: 'U',
        evento: { ...evento }
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
          setTimeout(() => {
            this.search();
          }, 0);
        }
      });
    }
  }

  eliminaEvento(evento: any): void {
    const dialogRef = this.util.openDialog(ConfirmDialog, { message: `Sei sicuro di voler eliminare l'evento "${evento.id}"?` });
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (!res) {
        return;
      }

    this.eventiS.delete(evento.id).subscribe({
      next: () => {
        this.eventi = this.eventi.filter(e => e.id !== evento.id);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Errore eliminazione evento', err);
      }
    });
    });
  }
}