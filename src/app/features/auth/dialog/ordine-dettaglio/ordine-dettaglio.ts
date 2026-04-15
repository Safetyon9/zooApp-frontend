import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrdineDTO } from '../../../../core/services/ordini-services';

@Component({
  selector: 'app-ordine-dettaglio',
  standalone: false,
  templateUrl: './ordine-dettaglio.html',
  styleUrl: './ordine-dettaglio.css',
})
export class OrdineDettaglio {
  constructor(
    //public dialogRef: MatDialogRef<OrdineDettaglioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrdineDTO
  ) {}

  getTotaleOrdine(): number {
    return (this.data.righe || []).reduce((sum, r) => sum + Number(r.prezzoTotale ?? 0), 0);
  }

  close(): void {
    //this.dialogRef.close();
  }
}
