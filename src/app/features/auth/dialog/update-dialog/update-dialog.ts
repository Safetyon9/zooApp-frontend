import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-update-dialog',
  standalone: false,
  templateUrl: './update-dialog.html',
  styleUrl: './update-dialog.css',
})
export class UpdateDialog implements OnInit{
  account = signal<any>(null);
  mod: any = 'C';

  updateForm = new FormGroup({
    nome: new FormControl<string | null>(null, Validators.required),
    cognome: new FormControl<string | null>(null, Validators.required),
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    telefono: new FormControl<string | null>(null),
    via: new FormControl<string | null>(null),
    comune: new FormControl<string | null>(null, Validators.required),
    provincia: new FormControl<string | null>(null),
    cap: new FormControl<string | null>(null, [Validators.minLength(5), Validators.maxLength(5)]),
    username: new FormControl<string | null>(null, Validators.required)
  });

  msg = signal('');
  private baseUrl = 'http://localhost:9090/rest/utente';

  constructor(
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<UpdateDialog>
  ) {
    if (data) {
      this.account.set(data.account);
      this.mod = data.mode ?? 'C';
    }
  }

  ngOnInit(): void {
    if (this.mod == 'U' && this.account()) {
      this.updateForm.patchValue({
        nome: this.account().nome,
        cognome: this.account().cognome,
        email: this.account().email,
        telefono: this.account().telefono,
        via: this.account().indirizzo,
        comune: this.account().comune,
        provincia: this.account().provincia,
        cap: this.account().cap,
        username: this.account().username,
      });
    }
  }

  onSubmit() {
    this.onSubmitUpdate();
  }

  onSubmitUpdate() {
    this.msg.set('');

    const body = {
      userName: this.account().username,
      email: this.updateForm.value.email,
      nome: this.updateForm.value.nome,
      cognome: this.updateForm.value.cognome,
      indirizzo: this.updateForm.value.via,
      comune: this.updateForm.value.comune,
      provincia: this.updateForm.value.provincia,
      cap: this.updateForm.value.cap,
      telefono: this.updateForm.value.telefono,
    };

    this.http.post(`${this.baseUrl}/update`, body).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.dialogRef.close(resp);
      },
      error: (resp: any) => {
        console.log(resp.error?.msg);
        this.msg.set(resp.error?.msg || 'Errore nella Modifica');
      },
    });
  }

}
