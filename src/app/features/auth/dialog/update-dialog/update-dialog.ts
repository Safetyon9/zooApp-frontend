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

  isAdmin = false;
  isAdminLoggato = false;
  profiloIsAdmin = false;

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
    this.profiloIsAdmin = (accountData?.role ?? 'USER') === 'ADMIN';

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

    if (this.isAdminLoggato) {
      this.updateForm.get('role')?.setValidators([Validators.required]);
      this.updateForm.get('role')?.enable();
    } else {
      this.updateForm.get('role')?.clearValidators();
      this.updateForm.get('role')?.disable();
    }

    if (!this.profiloIsAdmin) {
      this.updateForm.get('nome')?.setValidators([Validators.required]);
      this.updateForm.get('cognome')?.setValidators([Validators.required]);
      this.updateForm.get('comune')?.setValidators([Validators.required]);

      this.updateForm.get('nome')?.enable();
      this.updateForm.get('cognome')?.enable();
      this.updateForm.get('telefono')?.enable();
      this.updateForm.get('via')?.enable();
      this.updateForm.get('comune')?.enable();
      this.updateForm.get('provincia')?.enable();
      this.updateForm.get('cap')?.enable();
    } else {
      this.updateForm.get('nome')?.clearValidators();
      this.updateForm.get('cognome')?.clearValidators();
      this.updateForm.get('comune')?.clearValidators();

      this.updateForm.get('nome')?.disable();
      this.updateForm.get('cognome')?.disable();
      this.updateForm.get('telefono')?.disable();
      this.updateForm.get('via')?.disable();
      this.updateForm.get('comune')?.disable();
      this.updateForm.get('provincia')?.disable();
      this.updateForm.get('cap')?.disable();
    }

    this.updateForm.get('role')?.updateValueAndValidity();
    this.updateForm.get('nome')?.updateValueAndValidity();
    this.updateForm.get('cognome')?.updateValueAndValidity();
    this.updateForm.get('telefono')?.updateValueAndValidity();
    this.updateForm.get('via')?.updateValueAndValidity();
    this.updateForm.get('comune')?.updateValueAndValidity();
    this.updateForm.get('provincia')?.updateValueAndValidity();
    this.updateForm.get('cap')?.updateValueAndValidity();
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
      ? (this.updateForm.getRawValue().role ?? 'USER')
      : (accountData?.role ?? 'USER');

    const body: any = {
      utente: {
        username: this.updateForm.getRawValue().username,
        email: this.updateForm.getRawValue().email,
        role: roleToSend,
      },
      cliente: this.profiloIsAdmin ? null : {
        nome: this.updateForm.getRawValue().nome,
        cognome: this.updateForm.getRawValue().cognome,
        indirizzo: this.updateForm.getRawValue().via,
        comune: this.updateForm.getRawValue().comune,
        provincia: this.updateForm.getRawValue().provincia,
        cap: this.updateForm.getRawValue().cap,
        telefono: this.updateForm.getRawValue().telefono,
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