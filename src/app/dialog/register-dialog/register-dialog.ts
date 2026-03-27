import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-register-dialog',
  standalone: false,
  templateUrl: './register-dialog.html',
  styleUrl: './register-dialog.css',
})
export class RegisterDialog implements OnInit {
  account = signal<any>(null);
  mod: any;

  updateForm = new FormGroup({
    nome: new FormControl<string | null>(null, { nonNullable: false }),
    cognome: new FormControl<string | null>(null),
    email: new FormControl<string | null>(null),
    telefono: new FormControl<string | null>(null),
    via: new FormControl<string | null>(null),
    comune: new FormControl<string | null>(null),
    cap: new FormControl<string | null>(null),
    username: new FormControl<string | null>(null),
    pwd: new FormControl<string | null>(null),
    pwdControl: new FormControl<string | null>(null),
  });

  msg = signal('');
  private baseUrl = 'http://localhost:9090/rest/utente';

  constructor(
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<RegisterDialog>
  ) {
    if (data) {
      this.account.set(data.account);
      this.mod = data.mode;
    }
  }

  ngOnInit(): void {
    if (this.mod == 'U') {
      this.updateForm.patchValue({
        nome: this.account().nome,
        cognome: this.account().cognome,
        email: this.account().email,
        telefono: this.account().telefono,
        via: this.account().via,
        comune: this.account().comune,
        cap: this.account().cap,
        username: this.account().username,
      });
    }
  }

  onSubmit() {
    if (this.mod == 'C') this.onSubmitCreate();
    if (this.mod == 'U') this.onSubmitUpdate();
  }

  onSubmitUpdate() {
    this.msg.set('');
    const updateBody: any = { username: this.account().username };

    if (this.updateForm.controls['nome'].dirty)
      updateBody.nome = this.updateForm.value.nome;

    if (this.updateForm.controls['cognome'].dirty)
      updateBody.cognome = this.updateForm.value.cognome;

    if (this.updateForm.controls['email'].dirty)
      updateBody.email = this.updateForm.value.email;

    if (this.updateForm.controls['telefono'].dirty)
      updateBody.telefono = this.updateForm.value.telefono;

    if (this.updateForm.controls['via'].dirty)
      updateBody.via = this.updateForm.value.via;

    if (this.updateForm.controls['comune'].dirty)
      updateBody.commune = this.updateForm.value.comune;

    if (this.updateForm.controls['cap'].dirty)
      updateBody.cap = this.updateForm.value.cap;

    this.http.put(`${this.baseUrl}/update`, updateBody).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.dialogRef.close();
      },
      error: (resp: any) => {
        this.msg.set(resp.error.msg);
      },
    });
  }

  onSubmitCreate() {
    this.msg.set('');

    if (this.updateForm.value.pwd != this.updateForm.value.pwdControl) {
      this.msg.set('passord non coindicidenti');
      return;
    }

    const body = {
      utente: {
        username: this.updateForm.value.username,
        email: this.updateForm.value.email,
        pwd: this.updateForm.value.pwd,
        role: 'USER',
      },
      cliente: {
        nome: this.updateForm.value.nome,
        cognome: this.updateForm.value.cognome,
        indirizzo: this.updateForm.value.via,
        utenteUsername: this.updateForm.value.username,
        comune: this.updateForm.value.comune,
        cap: this.updateForm.value.cap,
        telefono: this.updateForm.value.telefono,
      },
    };

    this.http.post(`${this.baseUrl}/register`, body).subscribe({
      next: (resp: any) => {
        console.log(resp);
        this.dialogRef.close();
      },
      error: (resp: any) => {
        console.log(resp.error?.msg);
        this.msg.set(resp.error?.msg || 'Errore in registrazione');
      },
    });
  }
}