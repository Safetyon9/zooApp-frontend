import { Component } from '@angular/core';
import { ItemsServices } from '../../../../core/services/items-services';
import { Utilities } from '../../../../core/utils/utilities';
import { ComponentType } from '@angular/cdk/overlay';
import { BigliettoDialog } from '../dialog/biglietto-dialog/biglietto-dialog';
import { SceltaUpdateDialog } from '../dialog/scelta-update-dialog/scelta-update-dialog';
import { BigliettoServices } from '../../../../core/services/biglietto-services';

@Component({
  selector: 'app-biglietti-manager',
  templateUrl: './biglietti-manager.html',
  styleUrl: './biglietti-manager.css',
  standalone: false,
})
export class BigliettiManager {

  filtro = {
    nome: '',
    tipoId: null,
    prezzo: null
  };

  tipi: any[] = [];

  constructor(
    private itemsS: ItemsServices,
    private bigliettiS: BigliettoServices,
    private util: Utilities
  ) {}

  ngOnInit() {
    this.itemsS.list('biglietti');

    this.bigliettiS.getTipi().subscribe(res => {
      this.tipi = res;
    });
  }

  get biglietti() {
    return this.itemsS.biglietti();
  }

  search() {
    this.itemsS.search(this.filtro, 'biglietti');
  }

  onCreateBiglietto() {
    const dialogComponent: ComponentType<any> = BigliettoDialog;
    this.util.openDialog(dialogComponent, { mod: 'C', biglietto: null });
  }

  onSelected(row: any) {
    const dialogRef = this.util.openDialog(SceltaUpdateDialog, null, { width: '400px' });
    dialogRef.afterClosed().subscribe(choice => {
      if (choice === 'update') this.eseguoUpdate(row);
    });
  }

  eseguoUpdate(row: any) {
    this.util.openDialog(BigliettoDialog, { mod: 'U', biglietto: row });
  }
}