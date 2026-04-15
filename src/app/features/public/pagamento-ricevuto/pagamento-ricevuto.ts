import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutService } from '../../../core/services/checkout-services';

@Component({
  selector: 'app-pagamento-ricevuto',
  templateUrl: './pagamento-ricevuto.html',
  styleUrls: ['./pagamento-ricevuto.css'],
  standalone: false
})
export class PagamentoRicevuto implements OnInit {

  ordine: any = null;
  ricevutaNumero = '';
  imgBaseUrl = "http://localhost:9090/files/";

  constructor(
    private router: Router,
    private checkoutService: CheckoutService
  ) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();

    this.ordine = nav?.extras?.state?.['ordine'] ?? null;

    if (!this.ordine && typeof window !== 'undefined' && window.history?.state) {
      this.ordine = window.history.state.ordine ?? null;
    }

    console.log('ORDINE RICEVUTO', this.ordine);

    if (this.ordine) {
      this.ricevutaNumero =
        this.ordine?.idRicevuta
          ? this.ordine.idRicevuta
          : this.ordine?.ordineId
            ? `RCV-${this.ordine.ordineId}`
            : `RCV-${Date.now()}`;
    } else {
      console.error('Ordine non presente nello state di navigazione');
    }
  }

  tornaAlNegozio(): void {
    this.router.navigate(['/shop']);
  }

  testUploadRicevuta(): void {
    console.log('TEST UPLOAD - ORDINE', this.ordine);

    if (!this.ordine?.pagamentoId) {
      console.error('pagamentoId mancante');
      return;
    }

    const idRicevuta =
      this.ordine?.idRicevuta || this.ricevutaNumero || `RCV-${Date.now()}`;

    const blob = new Blob(['test ricevuta pdf'], { type: 'application/pdf' });
    const file = new File([blob], `ricevuta-${idRicevuta}.pdf`, { type: 'application/pdf' });

    this.checkoutService
      .salvaRicevutaPdf(file, this.ordine.pagamentoId, idRicevuta)
      .subscribe({
        next: (res) => {
          console.log('Ricevuta salvata correttamente', res);

          this.ordine.idRicevuta = idRicevuta;
          this.ricevutaNumero = idRicevuta;
        },
        error: (err) => {
          console.error('Errore upload ricevuta', err);
        }
      });
  }

  stampa(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }
}