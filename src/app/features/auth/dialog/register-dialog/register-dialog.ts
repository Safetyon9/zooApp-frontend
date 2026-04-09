import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AuthServices } from '../../../../core/services/auth-services';

@Component({
  selector: 'app-register-dialog',
  standalone: false,
  templateUrl: './register-dialog.html',
  styleUrls: ['./register-dialog.css'],
})
export class RegisterDialog implements OnInit {
  account = signal<any>(null);
  mod: any = 'C';
  isAdminLoggato = false;

  updateForm = new FormGroup({
    nome: new FormControl<string | null>(null, Validators.required),
    cognome: new FormControl<string | null>(null, Validators.required),
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    role: new FormControl<string | null>('USER', Validators.required),
    telefono: new FormControl<string | null>(null),
    via: new FormControl<string | null>(null),
    comune: new FormControl<string | null>(null, Validators.required),
    provincia: new FormControl<string | null>(null),
    cap: new FormControl<string | null>(null, [
      Validators.minLength(5),
      Validators.maxLength(5)
    ]),
    username: new FormControl<string | null>(null, Validators.required),
    pwd: new FormControl<string | null>(null, Validators.required),
    pwdControl: new FormControl<string | null>(null, Validators.required),
  });

  msg = signal('');
  private baseUrl = 'http://localhost:9090/rest/utente';

  constructor(
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<RegisterDialog>,
    private auth: AuthServices
  ) {
    if (data) {
      this.account.set(data.account);
      this.mod = data.mode ?? 'C';
    }
  }

  ngOnInit(): void {
    this.isAdminLoggato = this.auth.isRoleAdmin();

    if (this.mod === 'U' && this.account()) {
      this.updateForm.patchValue({
        nome: this.account().nome,
        cognome: this.account().cognome,
        email: this.account().email,
        role: this.account().role ?? 'USER',
        telefono: this.account().telefono,
        via: this.account().via,
        comune: this.account().comune,
        provincia: this.account().provincia,
        cap: this.account().cap,
        username: this.account().username,
      });
    }
  }

  onSubmit(): void {
    this.onSubmitCreate();
  }

  onSubmitCreate(): void {
    this.msg.set('');

    if (this.updateForm.value.pwd !== this.updateForm.value.pwdControl) {
      this.msg.set('password non coincidenti');
      return;
    }

    const roleSelezionato = this.isAdminLoggato
      ? (this.updateForm.value.role ?? 'USER')
      : 'USER';

    const body = {
      utente: {
        username: this.updateForm.value.username,
        email: this.updateForm.value.email,
        pwd: this.updateForm.value.pwd,
        role: roleSelezionato,
      },
      cliente: {
        nome: this.updateForm.value.nome,
        cognome: this.updateForm.value.cognome,
        indirizzo: this.updateForm.value.via,
        utenteUsername: this.updateForm.value.username,
        comune: this.updateForm.value.comune,
        provincia: this.updateForm.value.provincia,
        cap: this.updateForm.value.cap,
        telefono: this.updateForm.value.telefono,
      },
    };

    this.http.post(`${this.baseUrl}/register`, body).subscribe({
      next: (resp: any) => {
        this.dialogRef.close(resp);
      },
      error: (resp: any) => {
        this.msg.set(resp.error?.msg || 'Errore in registrazione');
      },
    });
  }
}