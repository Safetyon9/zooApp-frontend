import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UtenteServices } from '../../../../core/services/utente-services';

@Component({
  standalone: false,
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
    this.token = this.route.snapshot.paramMap.get('token') || '';
  }

  onSubmit(): void {
    this.errore = '';
    this.messaggio = '';

    if (!this.token) {
      this.errore = 'Token mancante o non valido.';
      return;
    }

    if (!this.newPwd || !this.newPwd.trim()) {
      this.errore = 'Inserisci la nuova password.';
      return;
    }

    if (this.newPwd.trim().length < 6) {
      this.errore = 'La password deve contenere almeno 6 caratteri.';
      return;
    }

    if (!this.confirmPwd || !this.confirmPwd.trim()) {
      this.errore = 'Conferma la password.';
      return;
    }

    if (this.newPwd !== this.confirmPwd) {
      this.errore = 'Le password non coincidono.';
      return;
    }

    this.loading = true;

    this.utenteServices.changePassword(this.token, this.newPwd.trim()).subscribe({
  next: (resp: any) => {
    this.loading = false;
    this.messaggio = resp?.msg || 'Password aggiornata con successo.';
    this.newPwd = '';
    this.confirmPwd = '';
  },
  error: (err: any) => {
    this.loading = false;
    this.errore = err?.error?.msg || 'Errore durante il cambio password.';
  }
});
  }

  tornaAlLogin(): void {
    this.router.navigate(['/']);
  }
}