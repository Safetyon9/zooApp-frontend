import { Component } from '@angular/core';
import { ItemsServices } from '../../../../core/services/items-services';
import { Utilities } from '../../../../core/utils/utilities';
import { ComponentType } from '@angular/cdk/overlay';

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
    const dialogComponent: ComponentType<any> = ProdottoDialog;

    this.util.openDialog(dialogComponent, { 
      mod: 'C', 
      prodotto: null 
    });
  }

  onSelected(row: any) {
    const dialogRef = this.util.openDialog(SceltaUpdateDialog, null, { width: '400px' });
    dialogRef.afterClosed().subscribe(r => {
      if (r === 'upload') this.eseguoUpload(row);
      else if (r === 'update') this.eseguoUpdate(row);
    });
  }

  eseguoUpdate(row: any) {
    this.util.openDialog(ProdottoDialog, { mod: 'U', prodotto: row });
  }

  eseguoUpload(row: any) {
    this.util.openDialog(UploadDialog, { prodotto: row });
  }

}
