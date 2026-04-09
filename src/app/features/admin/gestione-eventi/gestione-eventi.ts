import { Component } from '@angular/core';
import { ComponentType } from '@angular/cdk/overlay';
import { Utilities } from '../../../core/utils/utilities';
import { EventiServices } from '../../../core/services/eventi-services';
import { EventoDialog } from './evento-dialog/evento-dialog';
import { SceltaUpdateDialog } from '../gestione-items/dialog/scelta-update-dialog/scelta-update-dialog';

@Component({
  selector: 'app-gestione-eventi',
  standalone: false,
  templateUrl: './gestione-eventi.html',
  styleUrl: './gestione-eventi.css',
})
export class GestioneEventi {

  constructor(
    private eventiS: EventiServices,
    private util: Utilities
  ) {}

  ngOnInit() {
    this.eventiS.list();
  }

  get eventi() { return this.eventiS.eventi(); }

  onCreateEvento() {
    const dialogComponent: ComponentType<any> = EventoDialog;

    this.util.openDialog(dialogComponent, {
      mod: 'C',
      evento: null
    });
  }

  onSelected(row: any) {
    const dialogRef = this.util.openDialog(SceltaUpdateDialog, null, { width: '400px' });

    dialogRef.afterClosed().subscribe(choice => {
      if (choice === 'update') this.eseguoUpdate(row);
    });
  }

  eseguoUpdate(row: any) {
    this.util.openDialog(EventoDialog, { mod: 'U', evento: row });
  }
}