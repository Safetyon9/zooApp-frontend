import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ItemsServices } from '../../../../core/services/items-services';
import { BigliettoServices } from '../../../../core/services/biglietto-services';
import { Utilities } from '../../../../core/utils/utilities';
import { BigliettoDialog } from '../dialog/biglietto-dialog/biglietto-dialog';
import { SceltaUpdateDialog } from '../dialog/scelta-update-dialog/scelta-update-dialog';
import { ComponentType } from '@angular/cdk/overlay';
import { UploaditemDialog } from '../dialog/upload-item-dialog/upload-item-dialog';

@Component({
  selector: 'app-biglietti-manager',
  templateUrl: './biglietti-manager.html',
  styleUrl: './biglietti-manager.css',
  standalone: false,
})
export class BigliettiManager implements OnInit {

  filtro = {
    nome: '',
    tipoId: null,
    prezzo: null
  };

  tipi: any[] = [];
  bigliettiList: any[] = [];
  loading = false;

  constructor(
    private itemsS: ItemsServices,
    private bigliettiS: BigliettoServices,
    private util: Utilities,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadTipi();
    this.search();
  }

  private loadTipi(): void {
    this.bigliettiS.getTipi().subscribe({
      next: (res: any[]) => {
        this.tipi = res || [];
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Errore caricamento tipi', err);
        this.tipi = [];
      }
    });
  }

  search(): void {
    this.loading = true;
    this.itemsS.search(this.filtro, 'biglietti').subscribe({
      next: (res: any[]) => {
        this.bigliettiList = res || [];
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Errore ricerca biglietti', err);
        this.bigliettiList = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onCreateBiglietto(): void {
    const dialogRef = this.util.openDialog(BigliettoDialog, { mod: 'C', biglietto: null });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.search();
      }
    });
  }

  onSelected(biglietto: any): void {
    const dialogRef = this.util.openDialog(SceltaUpdateDialog, null, { width: '400px' });
    dialogRef.afterClosed().subscribe(choice => {
      if (choice === 'update') {
        this.eseguoUpdate(biglietto);
      }
    });
  }

  eseguoUpdate(biglietto: any): void {
    const dialogRef = this.util.openDialog(BigliettoDialog, { mod: 'U', biglietto });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.search();
      }
    });
  }

  eseguoUpload(row: any): void {
    const dialogRef = this.util.openDialog(UploaditemDialog, {
      prodotto: row
    }, {
      width: '600px',
      maxWidth: '90vw',
      maxHeight: '90vh'
    });

    dialogRef.afterClosed().subscribe(res => {
      if (res) this.search();
    });
  }

  get biglietti() {
    return this.bigliettiList;
  }

  eliminaBiglietto(biglietto: any): void {
    const conferma = confirm(`Sei sicuro di voler eliminare il biglietto "${biglietto.nome}"?`);
    if (!conferma) return;

    this.bigliettiS.delete(biglietto.id).subscribe({
      next: () => {
        this.search();
      },
      error: (err: any) => {
        console.error('Errore eliminazione biglietto', err);
      }
    });
  }
}