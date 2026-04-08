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
    username: new FormControl<string | null>(null, Validators.required),
    email: new FormControl<string | null>(null, [Validators.required, Validators.email]),
    role: new FormControl<string | null>(null),

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
    private dialogRef: MatDialogRef<UpdateDialog>
  ) {
    if (data) {
      this.account.set(data.account);
      this.mod = data.mode ?? 'C';
    }
  }

  ngOnInit(): void {
    const accountData = this.account();
    const ruoloProfilo = accountData?.role ?? '';

    // ATTENZIONE: qui isAdmin indica se IL PROFILO è ADMIN,
    // non se l'utente loggato è admin
    this.isAdmin = ruoloProfilo === 'ADMIN';

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

    if (!this.isAdmin) {
      this.updateForm.get('nome')?.setValidators([Validators.required]);
      this.updateForm.get('cognome')?.setValidators([Validators.required]);
      this.updateForm.get('comune')?.setValidators([Validators.required]);
      this.updateForm.get('role')?.clearValidators();
    } else {
      this.updateForm.get('nome')?.clearValidators();
      this.updateForm.get('cognome')?.clearValidators();
      this.updateForm.get('telefono')?.clearValidators();
      this.updateForm.get('via')?.clearValidators();
      this.updateForm.get('comune')?.clearValidators();
      this.updateForm.get('provincia')?.clearValidators();
      this.updateForm.get('cap')?.clearValidators();
      this.updateForm.get('role')?.setValidators([Validators.required]);
    }

    this.updateForm.get('nome')?.updateValueAndValidity();
    this.updateForm.get('cognome')?.updateValueAndValidity();
    this.updateForm.get('telefono')?.updateValueAndValidity();
    this.updateForm.get('via')?.updateValueAndValidity();
    this.updateForm.get('comune')?.updateValueAndValidity();
    this.updateForm.get('provincia')?.updateValueAndValidity();
    this.updateForm.get('cap')?.updateValueAndValidity();
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

    const body: any = {
      userName: this.updateForm.value.username,
      email: this.updateForm.value.email,
    };

    if (this.isAdmin) {
      body.role = this.updateForm.value.role;
    } else {
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