import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
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
      dataFine: new FormControl(null, Validators.required)
    });
  }

  ngOnInit(): void {
    if (this.mod() === 'U' && this.evento()) {
      this.updateForm.patchValue({
        tipoEvento: this.evento().tipoEvento,
        dataInizio: this.evento().dataInizio,
        dataFine: this.evento().dataFine
      });
    }
  }

  onSubmit() {
    if (this.mod() === 'C') this.onCreate();
    else if (this.mod() === 'U') this.onUpdate();
  }

  onCreate() {
    this.eventiS.create(this.updateForm.value).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) => this.msg.set(err.error?.msg || 'Errore durante la creazione')
    });
  }

  onUpdate() {
    const updateBody: any = { id: this.evento().id };
    Object.keys(this.updateForm.controls).forEach(key => {
      if (this.updateForm.controls[key].dirty) {
        updateBody[key] = this.updateForm.value[key];
      }
    });

    this.eventiS.update(updateBody).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) => this.msg.set(err.error?.msg || 'Errore durante l\'aggiornamento')
    });
  }

  remove() {
    this.eventiS.delete(this.evento().id).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) => this.msg.set(err.error?.msg || 'Errore durante la cancellazione')
    });
  }

  cancel() {
    this.dialogRef.close(false);
  }
}