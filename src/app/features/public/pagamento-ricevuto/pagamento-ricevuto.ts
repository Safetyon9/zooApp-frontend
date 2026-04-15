import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-pagamento-ricevuto',
  templateUrl: './pagamento-ricevuto.html',
  styleUrls: ['./pagamento-ricevuto.css'],
  standalone: false
})
export class PagamentoRicevuto implements OnInit {

  ordine: any = null;
  ricevutaNumero = '';

  constructor(private router: Router) {}

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

  stampa(): void {
    window.print();
  }
}