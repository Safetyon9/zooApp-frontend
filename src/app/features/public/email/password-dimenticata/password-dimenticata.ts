import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { UtenteServices } from '../../../../core/services/utente-services';

@Component({
  standalone:false,
  selector: 'app-password-dimenticata',
  templateUrl: './password-dimenticata.html',
  styleUrls: ['./password-dimenticata.css'],
})
export class PasswordDimenticataComponent {
  loading = false;
  msg: string | null = null;

  constructor(
    private utenteServices: UtenteServices,
    private router: Router
  ) {}

  onSubmit(form: NgForm): void {
    if (form.invalid) {
      return;
    }

    const { username, email } = form.value;

    this.loading = true;
    this.msg = null;

    this.utenteServices.passwordDimenticata(username, email).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.msg = resp?.msg || 'Se i dati sono corretti, riceverai una mail con le istruzioni per reimpostare la password.';
      },
      error: (err: any) => {
        this.loading = false;
        console.error('Errore password dimenticata', err);
        this.msg = err?.error?.msg || 'Errore durante la richiesta di reset password.';
      }
    });
  }

  tornaAlLogin(): void {
    this.router.navigate(['']);
  }
}