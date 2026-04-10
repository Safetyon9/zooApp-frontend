import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UtenteServices } from '../../../../core/services/utente-services';

@Component({
  selector: 'app-email-validation',
  standalone: false,
  templateUrl: './email-validation.html',
  styleUrl: './email-validation.css',
})
export class EmailValidation implements OnInit {
  stato: 'loading' | 'success' | 'error' = 'loading';
  messaggio: string = 'Verifica account in corso...';

  constructor(
    private route: ActivatedRoute,
    private utenteServices: UtenteServices
  ) {}

  ngOnInit(): void {
    const token = this.route.snapshot.queryParamMap.get('token');

    if (!token) {
      this.stato = 'error';
      this.messaggio = 'Token di validazione mancante o non valido.';
      return;
    }

    this.utenteServices.emailValidate(token).subscribe({
      next: (resp: any) => {
        this.stato = 'success';
        this.messaggio = resp?.msg || 'Account verificato con successo.';
      },
      error: (err: any) => {
        console.error('Errore validazione account', err);
        this.stato = 'error';
        this.messaggio =
          err?.error?.msg || 'Errore durante la validazione dell’account.';
      }
    });
  }
}