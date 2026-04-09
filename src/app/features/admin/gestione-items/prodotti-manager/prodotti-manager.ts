import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ItemsServices } from '../../../../core/services/items-services';
import { ProdottoServices } from '../../../../core/services/prodotto-services';
import { Utilities } from '../../../../core/utils/utilities';
import { ComponentType } from '@angular/cdk/overlay';
import { ProdottoDialog } from '../dialog/prodotto-dialog/prodotto-dialog';
import { SceltaUpdateDialog } from '../dialog/scelta-update-dialog/scelta-update-dialog';

@Component({
  selector: 'app-prodotti-manager',
  templateUrl: './prodotti-manager.html',
  styleUrl: './prodotti-manager.css',
  standalone: false,
})
export class ProdottiManager implements OnInit {

  filtro = {
    nome: '',
    categoriaId: null,
    prezzo: null,
    stock: null,
    sku: null
  };

  categorie: any[] = [];
  prodottiList: any[] = [];
  loading = false;

  constructor(
    private itemsS: ItemsServices, 
    private prodottiS: ProdottoServices,
    private util: Utilities,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadCategorie();
  }

  private loadCategorie(): void {
    this.prodottiS.getCategorie().subscribe({
      next: (res: any[]) => {
        this.categorie = res || [];
        this.cdr.detectChanges();
        this.search();
      },
      error: (err: any) => {
        console.error('Errore caricamento categorie', err);
        this.categorie = [];
        this.search();
      }
    });
  }

  search(): void {
    this.loading = true;
    this.itemsS.search(this.filtro, 'prodotto').subscribe({
      next: (res: any[]) => {
        this.prodottiList = (res || []).map(p => ({
          ...p,
          categoriaNome: this.categorie.find(c => c.id === p.categoriaId)?.nome || '-'
        }));
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Errore ricerca prodotti', err);
        this.prodottiList = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onCreateProdotto(): void {
    const dialogRef: ComponentType<any> = ProdottoDialog;
    this.util.openDialog(dialogRef, { mod: 'C', prodotto: null });
  }

  onSelected(row: any): void {
    const dialogRef = this.util.openDialog(SceltaUpdateDialog, null, { width: '400px' });
    dialogRef.afterClosed().subscribe(choice => {
      if (choice === 'update') this.eseguoUpdate(row);
      // else if (choice === 'upload') this.eseguoUpload(row);
    });
  }

  eseguoUpdate(row: any): void {
    this.util.openDialog(ProdottoDialog, { mod: 'U', prodotto: row });
  }

  /*
  eseguoUpload(row: any): void {
    this.util.openDialog(UploadDialog, { prodotto: row });
  }
  */

  get prodotti() {
    return this.prodottiList;
  }
}