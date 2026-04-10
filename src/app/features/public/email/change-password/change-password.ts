import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtenteServices } from '../../../../core/services/utente-services';

@Component({
  selector: 'app-reset-password',
  templateUrl: './change-password.html',
  styleUrls: ['./change-password.css']
})
export class ResetPasswordComponent implements OnInit {

  token = '';
  newPwd = '';
  confirmPwd = '';

  loading = false;
  errore = '';
  messaggio = '';

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private utenteServices: UtenteServices
  ) {}

  ngOnInit(): void {
    this.token = this.route.snapshot.queryParamMap.get('token') || '';

    if (!this.token) {
      this.errore = 'Token mancante o non valido.';
    }
  }

  onSubmit(): void {
    this.errore = '';
    this.messaggio = '';

    if (!this.token) {
      this.errore = 'Token mancante o non valido.';
      return;
    }

    if (!this.newPwd || !this.confirmPwd) {
      this.errore = 'Compila entrambi i campi.';
      return;
    }

    if (this.newPwd.length < 8) {
      this.errore = 'La password deve avere almeno 8 caratteri.';
      return;
    }

    if (this.newPwd !== this.confirmPwd) {
      this.errore = 'Le password non coincidono.';
      return;
    }

    this.loading = true;

    this.utenteServices.changePassword(this.token, this.newPwd).subscribe({
      next: (resp: any) => {
        this.loading = false;
        this.messaggio = resp?.msg || 'Password aggiornata con successo.';

        this.newPwd = '';
        this.confirmPwd = '';

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 2000);
      },
      error: (err: any) => {
        this.loading = false;
        this.errore =
          err?.error?.msg || 'Errore durante il reset della password.';
      }
    });
  }

  tornaAlLogin(): void {
    this.router.navigate(['/']);
  }
}