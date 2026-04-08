import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ProdottoServices } from '../../../../../core/services/prodotto-services';
import { Utilities } from '../../../../../core/utils/utilities';

@Component({
  selector: 'app-prodotto-dialog',
  templateUrl: './prodotto-dialog.html',
  styleUrls: ['./prodotto-dialog.css']
})
export class ProdottoDialog implements OnInit {

  prodotto: any = signal(null);
  mod: any = signal('');
  msg = signal('');

  updateForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<ProdottoDialog>,
    private prodS: ProdottoServices,
    private util: Utilities
  ) {
    this.mod.set(data.mod);
    this.prodotto.set(data.prodotto);

    this.updateForm = new FormGroup({
      nome: new FormControl('', Validators.required),
      descrizione: new FormControl(''),
      categoriaId: new FormControl(null, Validators.required),
      prezzo: new FormControl(null, Validators.required),
      stock: new FormControl(null),
      sku: new FormControl(null),
      peso: new FormControl(null),
      dimensioni: new FormControl(null),
      urlImmagine: new FormControl('')
    });
  }

  ngOnInit(): void {
    if (this.mod() === 'U' && this.prodotto()) {
      this.updateForm.patchValue({
        nome: this.prodotto().nome,
        descrizione: this.prodotto().descrizione,
        categoriaId: this.prodotto().categoriaId,
        prezzo: this.prodotto().prezzo,
        stock: this.prodotto().stock,
        sku: this.prodotto().sku,
        peso: this.prodotto().peso,
        dimensioni: this.prodotto().dimensioni,
        urlImmagine: this.prodotto().urlImmagine
      });
    }
  }

  onSubmit() {
    if (this.mod() === 'C') this.onCreate();
    else if (this.mod() === 'U') this.onUpdate();
  }

  onCreate() {
    this.prodS.create(this.updateForm.value).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) => this.msg.set(err.error?.msg || 'Errore durante la creazione')
    });
  }

  onUpdate() {
    const updateBody: any = { id: this.prodotto().id };
    Object.keys(this.updateForm.controls).forEach(key => {
      if (this.updateForm.controls[key].dirty) {
        updateBody[key] = this.updateForm.value[key];
      }
    });

    this.prodS.update(updateBody).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) => this.msg.set(err.error?.msg || 'Errore durante l\'aggiornamento')
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}