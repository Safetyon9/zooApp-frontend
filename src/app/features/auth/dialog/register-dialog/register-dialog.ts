import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { AuthServices } from '../../../../core/services/auth-services';

@Component({
  selector: 'app-register-dialog',
  standalone: false,
  template: `
<mat-dialog-content class="dialog-container">
  <button mat-icon-button mat-dialog-close class="dialog-close-btn">
    <mat-icon>close</mat-icon>
  </button>

  <mat-card>
    <mat-card-header class="header-center">
      <mat-card-title>Creazione nuovo utente</mat-card-title>
    </mat-card-header>

    <mat-card-content>
      <form [formGroup]="updateForm" (ngSubmit)="onSubmit()" class="form-grid">

        <mat-form-field appearance="fill">
          <mat-label>Nome</mat-label>
          <input matInput type="text" name="nome" formControlName="nome">
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Cognome</mat-label>
          <input matInput type="text" name="cognome" formControlName="cognome">
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Email</mat-label>
          <input matInput type="email" name="email" formControlName="email">
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Ruolo</mat-label>
          <mat-select formControlName="role">
            <mat-option value="USER">USER</mat-option>
            <mat-option value="ADMIN" *ngIf="isAdminLoggato">ADMIN</mat-option>
          </mat-select>
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Telefono</mat-label>
          <input matInput type="text" name="telefono" formControlName="telefono">
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Via</mat-label>
          <input matInput type="text" name="via" formControlName="via">
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Comune</mat-label>
          <input matInput type="text" name="comune" formControlName="comune">
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Provincia</mat-label>
          <input matInput type="text" name="provincia" formControlName="provincia">
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Cap</mat-label>
          <input
            matInput
            type="text"
            formControlName="cap"
            maxlength="5"
            pattern="[0-9]*"
            inputmode="numeric">
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>UserName</mat-label>
          <input matInput type="text" name="username" formControlName="username">
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Password</mat-label>
          <input matInput type="password" name="pwd" formControlName="pwd">
        </mat-form-field>

        <mat-form-field appearance="fill">
          <mat-label>Retype Password</mat-label>
          <input matInput type="password" name="pwdControl" formControlName="pwdControl">
        </mat-form-field>

        <div class="msg-error">
          <span style="color:red">{{ msg() }}</span>
        </div>

        <div class="button-group">
          <button
            mat-raised-button
            color="primary"
            type="submit"
            [disabled]="!updateForm.valid"
            matTooltip="Salvare le modifiche">
            Crea nuovo utente
          </button>
        </div>

      </form>
    </mat-card-content>
  </mat-card>
</mat-dialog-content>
  `,
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
    cap: new FormControl<string | null>(null, [Validators.minLength(5), Validators.maxLength(5)]),
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