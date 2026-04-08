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
export class UpdateDialog implements OnInit {
  account = signal<any>(null);
  mod: any = 'C';
  isAdmin = false;

  updateForm = new FormGroup({
    nome: new FormControl<string | null>(null),
    cognome: new FormControl<string | null>(null),
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    telefono: new FormControl<string | null>(null),
    via: new FormControl<string | null>(null),
    comune: new FormControl<string | null>(null),
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
    this.isAdmin = (this.account()?.role ?? '') === 'ADMIN';

    if (this.mod === 'U' && this.account()) {
      this.updateForm.patchValue({
        nome: this.account()?.nome ?? '',
        cognome: this.account()?.cognome ?? '',
        email: this.account()?.email ?? '',
        telefono: this.account()?.telefono ?? '',
        via: this.account()?.indirizzo ?? '',
        comune: this.account()?.comune ?? '',
        provincia: this.account()?.provincia ?? '',
        cap: this.account()?.cap ?? '',
        username: this.account()?.username ?? '',
      });
    }

    if (!this.isAdmin) {
      this.updateForm.get('nome')?.setValidators([Validators.required]);
      this.updateForm.get('cognome')?.setValidators([Validators.required]);
      this.updateForm.get('comune')?.setValidators([Validators.required]);
    } else {
      this.updateForm.get('nome')?.clearValidators();
      this.updateForm.get('cognome')?.clearValidators();
      this.updateForm.get('telefono')?.clearValidators();
      this.updateForm.get('via')?.clearValidators();
      this.updateForm.get('comune')?.clearValidators();
      this.updateForm.get('provincia')?.clearValidators();
      this.updateForm.get('cap')?.clearValidators();
    }

    this.updateForm.get('nome')?.updateValueAndValidity();
    this.updateForm.get('cognome')?.updateValueAndValidity();
    this.updateForm.get('telefono')?.updateValueAndValidity();
    this.updateForm.get('via')?.updateValueAndValidity();
    this.updateForm.get('comune')?.updateValueAndValidity();
    this.updateForm.get('provincia')?.updateValueAndValidity();
    this.updateForm.get('cap')?.updateValueAndValidity();
  }

  onSubmit() {
    this.onSubmitUpdate();
  }

  onSubmitUpdate() {
    this.msg.set('');

    const body: any = {
      userName: this.account()?.userName,
      email: this.updateForm.value.email,
    };

    if (!this.isAdmin) {
      body.nome = this.updateForm.value.nome;
      body.cognome = this.updateForm.value.cognome;
      body.indirizzo = this.updateForm.value.via;
      body.comune = this.updateForm.value.comune;
      body.provincia = this.updateForm.value.provincia;
      body.cap = this.updateForm.value.cap;
      body.telefono = this.updateForm.value.telefono;
    }

    this.http.put(`${this.baseUrl}/Allupdate`, body).subscribe({
      next: (resp: any) => {
        this.dialogRef.close(resp);
      },
      error: (resp: any) => {
        this.msg.set(resp.error?.msg || 'Errore nella modifica');
      },
    });
  }
}