import { Component } from '@angular/core';
import { ItemsServices } from '../../../../core/services/items-services';
import { Utilities } from '../../../../core/utils/utilities';
import { ComponentType } from '@angular/cdk/overlay';
import { ProdottoDialog } from '../dialog/prodotto-dialog/prodotto-dialog';
import { SceltaUpdateDialog } from '../dialog/scelta-update-dialog/scelta-update-dialog';

@Component({
  selector: 'app-prodotti-manager',
  standalone: false,
  templateUrl: './prodotti-manager.html',
  styleUrl: './prodotti-manager.css',
})
export class ProdottiManager {

  filtro = {
    nome: '',
    categoriaId: null,
    prezzo: null,
    stock: null,
    sku: null
  };

  constructor(
    private itemsS: ItemsServices, 
    private util: Utilities
  ) {}

  ngOnInit() {
    this.itemsS.list('prodotto');
  }

  get prodotti() { return this.itemsS.items(); }

  search() { this.itemsS.search(this.filtro, 'prodotto'); }

  onCreateProdotto() {
  }

  onSelected(row: any) {
    const dialogRef = this.util.openDialog(SceltaUpdateDialog, null, { width: '400px' });
    
    dialogRef.afterClosed().subscribe(choice => {
      if (choice === 'update') this.eseguoUpdate(row);
    });
  }


  eseguoUpdate(row: any) {
  }
}
