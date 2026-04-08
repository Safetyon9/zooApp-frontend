import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BigliettoServices } from '../../../../../core/services/biglietto-services';
import { Utilities } from '../../../../../core/utils/utilities';

@Component({
  selector: 'app-biglietto-dialog',
  templateUrl: './biglietto-dialog.html',
  styleUrls: ['./biglietto-dialog.css'],
  standalone: false,
})
export class BigliettoDialog implements OnInit {

  biglietto: any = signal(null);
  mod: any = signal('');
  msg = signal('');

  updateForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<BigliettoDialog>,
    private bigliettiS: BigliettoServices,
    private util: Utilities
  ) {
    this.mod.set(data.mod);
    this.biglietto.set(data.biglietto);

    this.updateForm = new FormGroup({
      nome: new FormControl('', Validators.required),
      descrizione: new FormControl(''),
      tipoId: new FormControl(null, Validators.required),
      prezzo: new FormControl(null, Validators.required),
      urlImmagine: new FormControl('', Validators.required)
    });
  }

  ngOnInit(): void {
    if (this.mod() === 'U' && this.biglietto()) {
      this.updateForm.patchValue({
        nome: this.biglietto().nome,
        descrizione: this.biglietto().descrizione,
        tipoId: this.biglietto().tipo?.id,
        prezzo: this.biglietto().prezzo,
        urlImmagine: this.biglietto().urlImmagine
      });
    }
  }

  onSubmit() {
    if (this.mod() === 'C') this.onCreate();
    else if (this.mod() === 'U') this.onUpdate();
  }

  onCreate() {
    this.bigliettiS.create(this.updateForm.value).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) => this.msg.set(err.error?.msg || 'Errore durante la creazione')
    });
  }

  onUpdate() {
    const updateBody: any = { itemId: this.biglietto().id };
    Object.keys(this.updateForm.controls).forEach(key => {
      if (this.updateForm.controls[key].dirty) {
        updateBody[key] = this.updateForm.value[key];
      }
    });

    this.bigliettiS.update(updateBody).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) => this.msg.set(err.error?.msg || 'Errore durante l\'aggiornamento')
    });
  }

  remove() {
    // opzionale: chiamata a delete
  }

  cancel() {
    this.dialogRef.close(false);
  }
}