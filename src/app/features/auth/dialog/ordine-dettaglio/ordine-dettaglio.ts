import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { OrdineUtenteDTO } from '../../../../core/services/ordini-utente-services';

@Component({
  selector: 'app-ordine-dettaglio',
  standalone: false,
  templateUrl: './ordine-dettaglio.html',
  styleUrl: './ordine-dettaglio.css',
})
export class OrdineDettaglio {
  constructor(
    //public dialogRef: MatDialogRef<OrdineDettaglioComponent>,
    @Inject(MAT_DIALOG_DATA) public data: OrdineUtenteDTO
  ) {}

  getTotaleOrdine(): number {
    return (this.data.righe || []).reduce((sum, r) => sum + Number(r.prezzoTotale ?? 0), 0);
  }

  close(): void {
    //this.dialogRef.close();
  }
}
