import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { EventiServices } from '../../../../core/services/eventi-services';
import { Utilities } from '../../../../core/utils/utilities';

@Component({
  selector: 'app-evento-dialog',
  templateUrl: './evento-dialog.html',
  styleUrls: ['./evento-dialog.css'],
  standalone: false,
})
export class EventoDialog implements OnInit {

  evento: any = signal(null);
  mod: any = signal('');
  msg = signal('');

  updateForm: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<EventoDialog>,
    private eventiS: EventiServices,
    private util: Utilities
  ) {
    this.mod.set(data.mod);
    this.evento.set(data.evento);

    this.updateForm = new FormGroup({
      tipoEvento: new FormControl('', Validators.required),
      dataInizio: new FormControl(null, Validators.required),
      dataFine: new FormControl(''),
      descrizione: new FormControl('')
    });
  }

  ngOnInit(): void {
    if (this.mod() === 'U' && this.evento()) {
      this.updateForm.patchValue({
        tipoEvento: this.evento().tipoEvento,
        dataInizio: this.evento().dataInizio,
        dataFine: this.evento().dataFine,
        descrizione: this.evento().descrizione
      });
    }
  }

  onSubmit() {
    if (this.mod() === 'C') this.onCreate();
    else if (this.mod() === 'U') this.onUpdate();
  }

  onCreate() {
    const v = this.updateForm.value;

    const body = {
      ...v,
      dataInizio: this.toDateOnly(v.dataInizio),
      dataFine: this.toDateOnly(v.dataFine)
    };

    this.eventiS.create(body).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) =>
        this.msg.set(err.error?.msg || 'Errore durante la creazione')
    });
  }

  onUpdate() {
    const v = this.updateForm.value;

    const body = {
      id: this.evento().id,
      tipoEvento: v.tipoEvento,
      dataInizio: this.toDateOnly(v.dataInizio),
      dataFine: this.toDateOnly(v.dataFine),
      descrizione: v.descrizione
    };

    this.eventiS.update(body).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) =>
        this.msg.set(err.error?.msg || 'Errore durante l\'aggiornamento')
    });
  }

  remove() {
    this.eventiS.delete(this.evento().id).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) => this.msg.set(err.error?.msg || 'Errore durante la cancellazione')
    });
  }

  private toDateOnly(date: any): string | null {
  if (!date) return null;

  const d = new Date(date);

  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
}