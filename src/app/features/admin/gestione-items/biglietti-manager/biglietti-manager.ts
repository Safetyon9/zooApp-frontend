import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ItemsServices } from '../../../../core/services/items-services';
import { BigliettoServices } from '../../../../core/services/biglietto-services';
import { Utilities } from '../../../../core/utils/utilities';
import { BigliettoDialog } from '../dialog/biglietto-dialog/biglietto-dialog';
import { SceltaUpdateDialog } from '../dialog/scelta-update-dialog/scelta-update-dialog';
import { ComponentType } from '@angular/cdk/overlay';

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
    const dialogRef: ComponentType<any> = BigliettoDialog;
    this.util.openDialog(dialogRef, { mod: 'C', biglietto: null });
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
    this.util.openDialog(BigliettoDialog, { mod: 'U', biglietto });
  }

  get biglietti() {
    return this.bigliettiList;
  }
}