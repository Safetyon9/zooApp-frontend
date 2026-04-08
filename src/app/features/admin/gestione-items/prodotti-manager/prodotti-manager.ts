import { Component } from '@angular/core';
import { ItemsServices } from '../../../../core/services/items-services';
import { Utilities } from '../../../../core/utils/utilities';

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
    this.itemsS.list('prodotti');
  }

  get prodotti() { return this.itemsS.items(); }

  search() { this.itemsS.search(this.filtro, 'prodotti'); }

  onCreateProdotto() {
  }

  onSelected(row: any) {
  }

  eseguoUpdate(row: any) {
  }

  eseguoUpload(row: any) {
  }

}
