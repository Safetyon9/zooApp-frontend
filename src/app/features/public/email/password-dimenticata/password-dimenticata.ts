import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UtenteServices } from '../../../../core/services/utente-services';

@Component({
  standalone:false,
  selector: 'app-password-dimenticata',
  templateUrl: './password-dimenticata.html',
  styleUrls: ['./password-dimenticata.css']
})
export class PasswordDimenticataComponent {

  email = '';

  loading = false;
  errore = '';
  messaggio = '';

  constructor(
    private router: Router,
    private utenteServices: UtenteServices
  ) {}

  onSubmit(): void {
    this.errore = '';
    this.messaggio = '';

    if (!this.email) {
      this.errore = 'Inserisci la tua email.';
      return;
    }

    this.loading = true;

    this.utenteServices.passwordDimenticata(this.email).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.messaggio =
          resp?.msg ||
          'Se l’email è corretta, riceverai una mail per reimpostare la password.';

        this.email = '';
      },
      error: (err: any) => {
        this.loading = false;
        this.errore =
          err?.error?.msg || 'Errore durante l’invio della richiesta.';
      }
    });
  }

  tornaAlLogin(): void {
    this.router.navigate(['/']);
  }
}