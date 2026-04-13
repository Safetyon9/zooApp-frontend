import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ItemsServices } from '../../../../core/services/items-services';
import { ProdottoServices } from '../../../../core/services/prodotto-services';
import { Utilities } from '../../../../core/utils/utilities';
import { ProdottoDialog } from '../dialog/prodotto-dialog/prodotto-dialog';
import { SceltaUpdateDialog } from '../dialog/scelta-update-dialog/scelta-update-dialog';
import { UploaditemDialog } from '../dialog/upload-item-dialog/upload-item-dialog';

@Component({
  selector: 'app-prodotti-manager',
  templateUrl: './prodotti-manager.html',
  styleUrl: './prodotti-manager.css',
  standalone: false,
})
export class ProdottiManager implements OnInit {

  filtro = {
    nome: '',
    prezzo: null,
    stock: null,
    sku: null
  };

  sortBy: string = 'nome';
  sortOrder: 'asc' | 'desc' = 'asc';

  imgBaseUrl = "http://localhost:9090/files/";
  categorie: any[] = [];
  prodottiList: any[] = [];
  loading = false;

  nuovaCategoria = {
    nome: ''
  };

  categoriaInModificaId: number | null = null;

  categoriaModifica: any = {
    id: null,
    nome: ''
  };

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
        this.prodottiList = this.sortResults(res || []);
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

  private sortResults(items: any[]): any[] {
    const sorted = [...items];

    sorted.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (this.sortBy) {
        case 'nome':
          aVal = (a.nome || '').toLowerCase();
          bVal = (b.nome || '').toLowerCase();
          break;
        case 'prezzo':
          aVal = a.prezzo || 0;
          bVal = b.prezzo || 0;
          break;
        case 'categoria':
          aVal = (a.categoriaNome || '').toLowerCase();
          bVal = (b.categoriaNome || '').toLowerCase();
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return this.sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }

  sort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.search();
  }

  getSortIcon(field: string): string {
    if (this.sortBy !== field) return '⇅';
    return this.sortOrder === 'asc' ? '↑' : '↓';
  }

  onCreateProdotto(): void {
    const dialogRef = this.util.openDialog(ProdottoDialog, { mod: 'C', prodotto: null });

    dialogRef.afterClosed().subscribe(res => {
      if (res) this.search();
    });
  }

  onSelected(row: any): void {
    const dialogRef = this.util.openDialog(SceltaUpdateDialog, null, { width: '400px' });
    dialogRef.afterClosed().subscribe(choice => {
      if (choice === 'update') this.eseguoUpdate(row);
      else if (choice === 'upload') this.eseguoUpload(row);
    });
  }

  eseguoUpdate(row: any): void {
    const dialogRef = this.util.openDialog(ProdottoDialog, { mod: 'U', prodotto: row });

    dialogRef.afterClosed().subscribe(res => {
      if (res) this.search();
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

  get prodotti() {
    return this.prodottiList;
  }

  eliminaProdotto(prodotto: any): void {
    const conferma = confirm(`Sei sicuro di voler eliminare il prodotto "${prodotto.nome}"?`);
    if (!conferma) return;

    this.prodottiS.delete(prodotto.id).subscribe({
      next: () => {
        this.search();
      },
      error: (err: any) => {
        console.error('Errore eliminazione prodotto', err);
      }
    });
  }

  creaCategoria(): void {
    const nome = (this.nuovaCategoria.nome || '').trim();

    if (!nome) return;

    this.prodottiS.createCategoria({ nome }).subscribe({
      next: () => {
        this.nuovaCategoria.nome = '';
        this.loadCategorie();
      },
      error: (err: any) => {
        console.error('Errore creazione categoria', err);
      }
    });
  }

  modificaCategoria(categoria: any): void {
    this.categoriaInModificaId = categoria.id;
    this.categoriaModifica = {
      id: categoria.id,
      nome: categoria.nome
    };
  }

  annullaModificaCategoria(): void {
    this.categoriaInModificaId = null;
    this.categoriaModifica = {
      id: null,
      nome: ''
    };
  }

  salvaCategoria(categoria: any): void {
    const nome = (this.categoriaModifica.nome || '').trim();

    if (!nome) return;

    this.prodottiS.updateCategoria({
      id: categoria.id,
      nome: nome
    }).subscribe({
      next: () => {
        this.annullaModificaCategoria();
        this.loadCategorie();
      },
      error: (err: any) => {
        console.error('Errore aggiornamento categoria', err);
      }
    });
  }

  eliminaCategoria(categoria: any): void {
    const conferma = confirm(`Sei sicuro di voler eliminare la categoria "${categoria.nome}"?`);
    if (!conferma) return;

    this.prodottiS.deleteCategoria(categoria.id).subscribe({
      next: () => {
        this.annullaModificaCategoria();
        this.loadCategorie();
      },
      error: (err: any) => {
        console.error('Errore eliminazione categoria', err);
      }
    });
  }
}
