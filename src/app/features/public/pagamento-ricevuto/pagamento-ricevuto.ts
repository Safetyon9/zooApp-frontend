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

  constructor(private router: Router,
    private checkoutService: CheckoutService
  ) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();
    this.ordine = nav?.extras?.state?.['ordine'] ?? history.state?.ordine ?? null;
    if (this.ordine) {
      this.ricevutaNumero =
        this.ordine?.ordineId
          ? `RCV-${this.ordine.ordineId}`
          : `RCV-${Date.now()}`;
    }
  }

  

  tornaAlNegozio(): void {
    this.router.navigate(['/shop']);
  }

  testUploadRicevuta(): void {
  if (!this.ordine?.pagamentoId) {
    console.error('pagamentoId mancante');
    return;
  }

  const idRicevuta = this.ordine?.idRicevuta || this.ricevutaNumero || `RCV-${Date.now()}`;

  const blob = new Blob(['test ricevuta pdf'], { type: 'application/pdf' });
  const file = new File([blob], `ricevuta-${idRicevuta}.pdf`, { type: 'application/pdf' });

  this.checkoutService.salvaRicevutaPdf(file, this.ordine.pagamentoId, idRicevuta).subscribe({
    next: (res) => {
      console.log('Ricevuta salvata correttamente', res);
    },
    error: (err) => {
      console.error('Errore upload ricevuta', err);
    }
  });
}

  stampa(): void {
    window.print();
  }
}