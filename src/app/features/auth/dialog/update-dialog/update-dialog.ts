import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AuthServices } from '../../../../core/services/auth-services';

@Component({
  selector: 'app-update-dialog',
  standalone: false,
  templateUrl: './update-dialog.html',
  styleUrls: ['./update-dialog.css'],
})
export class UpdateDialog implements OnInit {
  account = signal<any>(null);
  mod: any = 'U';

  // fix tampone + nome coerente
  isAdmin = false;
  isAdminLoggato = false;

  updateForm = new FormGroup({
    username: new FormControl<string | null>(null, Validators.required),
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    role: new FormControl<string | null>('USER'),

    nome: new FormControl<string | null>(null),
    cognome: new FormControl<string | null>(null),
    telefono: new FormControl<string | null>(null),
    via: new FormControl<string | null>(null),
    comune: new FormControl<string | null>(null),
    provincia: new FormControl<string | null>(null),
    cap: new FormControl<string | null>(null, [
      Validators.minLength(5),
      Validators.maxLength(5)
    ])
  });

  msg = signal('');
  private baseUrl = 'http://localhost:9090/rest/utente';

  constructor(
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<UpdateDialog>,
    private auth: AuthServices
  ) {
    if (data) {
      this.account.set(data.account);
      this.mod = data.mode ?? 'U';
    }
  }

  ngOnInit(): void {
    const accountData = this.account();

    this.isAdmin = this.auth.isRoleAdmin();
    this.isAdminLoggato = this.isAdmin;

    if (this.mod === 'U' && accountData) {
      this.updateForm.patchValue({
        username: accountData?.userName ?? accountData?.username ?? '',
        email: accountData?.email ?? '',
        role: accountData?.role ?? 'USER',
        nome: accountData?.nome ?? '',
        cognome: accountData?.cognome ?? '',
        telefono: accountData?.telefono ?? '',
        via: accountData?.indirizzo ?? accountData?.via ?? '',
        comune: accountData?.comune ?? '',
        provincia: accountData?.provincia ?? '',
        cap: accountData?.cap ?? '',
      });
    }

    if (!this.isAdminLoggato) {
      this.updateForm.get('role')?.clearValidators();
    } else {
      this.updateForm.get('role')?.setValidators([Validators.required]);
    }

    this.updateForm.get('role')?.updateValueAndValidity();
  }

  onSubmit(): void {
    this.onSubmitUpdate();
  }

  onSubmitUpdate(): void {
    this.msg.set('');

    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      this.msg.set('Controlla i campi obbligatori');
      return;
    }

    const accountData = this.account();

    const roleToSend = this.isAdminLoggato
      ? (this.updateForm.value.role ?? 'USER')
      : (accountData?.role ?? 'USER');

    const body: any = {
      utente: {
        username: this.updateForm.value.username,
        email: this.updateForm.value.email,
        role: roleToSend,
      },
      cliente: {
        nome: this.updateForm.value.nome,
        cognome: this.updateForm.value.cognome,
        indirizzo: this.updateForm.value.via,
        comune: this.updateForm.value.comune,
        provincia: this.updateForm.value.provincia,
        cap: this.updateForm.value.cap,
        telefono: this.updateForm.value.telefono,
      }
    };

    console.log('body Allupdate:', JSON.stringify(body));

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