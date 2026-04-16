import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import { CheckoutService } from '../../../core/services/checkout-services';
import { ShopService } from '../../../core/services/shop-services';
import { OrdiniServices } from '../../../core/services/ordini-services';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

@Component({
  selector: 'app-pagamento-ricevuto',
  templateUrl: './pagamento-ricevuto.html',
  styleUrls: ['./pagamento-ricevuto.css'],
  standalone: false
})
export class PagamentoRicevuto implements OnInit, AfterViewInit {

  ordine: any = null;
  ricevutaNumero = '';
  imgBaseUrl = "http://localhost:9090/files/";
  spedizione: number = 9.99;

  private viewReady = false;
  private ricevutaGenerata = false;

  constructor(
    private router: Router,
    private checkoutService: CheckoutService,
    private shopService: ShopService,
    private ordiniServices: OrdiniServices
  ) {}

  ngOnInit(): void {
    const nav = this.router.getCurrentNavigation();

    this.ordine = nav?.extras?.state?.['ordine'] ?? null;

    if (!this.ordine && typeof window !== 'undefined' && window.history?.state) {
      this.ordine = window.history.state.ordine ?? null;
    }

    console.log('ORDINE RICEVUTO', this.ordine);

    if (this.ordine) {
      this.recuperaPagamentoId(this.ordine.ordineId);

      this.ricevutaNumero =
        this.ordine?.idRicevuta
          ? this.ordine.idRicevuta
          : this.ordine?.ordineId
            ? `RCV-${this.ordine.ordineId}`
            : `RCV-${Date.now()}`;

      this.svuota();
    } else {
      console.error('Ordine non presente nello state di navigazione');
    }
  }

  ngAfterViewInit(): void {
    this.viewReady = true;

    setTimeout(() => {
      this.provaGenerazioneAutomatica();
    }, 300);
  }

  tornaAlNegozio(): void {
    this.router.navigate(['/shop']);
  }

  stampa(): void {
    if (typeof window !== 'undefined') {
      window.print();
    }
  }

  svuota(): void {
    this.shopService.clearCart();
  }

  recuperaPagamentoId(ordineId: number): void {
    this.ordiniServices.getById(ordineId).subscribe({
      next: (res: any) => {
        const pagamentoId = res?.pagamentoId ?? res?.pagamento?.id;
        this.ordine.pagamentoId = pagamentoId;
        console.log('PAGAMENTO ID RECUPERATO:', pagamentoId);

        this.provaGenerazioneAutomatica();
      },
      error: (err) => {
        console.error('Errore recupero pagamentoId', err);
      }
    });
  }

  private provaGenerazioneAutomatica(): void {
    if (!this.viewReady) {
      return;
    }

    if (!this.ordine) {
      return;
    }

    if (!this.ordine?.pagamentoId) {
      return;
    }

    if (this.ricevutaGenerata) {
      return;
    }

    this.ricevutaGenerata = true;

    setTimeout(() => {
      this.generaEdUploadRicevuta();
    }, 300);
  }

  generaEdUploadRicevuta(): void {
    console.log('GENERA ED UPLOAD - ORDINE', this.ordine);

    if (!this.ordine?.pagamentoId) {
      console.error('pagamentoId mancante');
      this.ricevutaGenerata = false;
      return;
    }

    const idRicevuta =
      this.ordine?.idRicevuta || this.ricevutaNumero || `RCV-${Date.now()}`;

    const element = document.getElementById('receipt-pdf');
    if (!element) {
      console.error('Elemento receipt-pdf non trovato');
      this.ricevutaGenerata = false;
      return;
    }

    html2canvas(element, {
      scale: 1.2,
      backgroundColor: '#ffffff',
      useCORS: true
    }).then(canvas => {
      const imgData = canvas.toDataURL('image/jpeg', 0.95);

      const pdf = new jsPDF('p', 'mm', 'a4');
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      const margin = 10;
      const usableWidth = pageWidth - (margin * 2);
      const imgHeight = (canvas.height * usableWidth) / canvas.width;

      if (imgHeight <= pageHeight - (margin * 2)) {
        pdf.addImage(imgData, 'JPEG', margin, margin, usableWidth, imgHeight);
      } else {
        let heightLeft = imgHeight;
        let position = margin;

        pdf.addImage(imgData, 'JPEG', margin, position, usableWidth, imgHeight);
        heightLeft -= (pageHeight - margin * 2);

        while (heightLeft > 0) {
          pdf.addPage();
          position = margin - (imgHeight - heightLeft);
          pdf.addImage(imgData, 'JPEG', margin, position, usableWidth, imgHeight);
          heightLeft -= (pageHeight - margin * 2);
        }
      }

      const blob = pdf.output('blob');

      const file = new File(
        [blob],
        `ricevuta-${idRicevuta}.pdf`,
        { type: 'application/pdf' }
      );

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
            this.ricevutaGenerata = false;
          }
        });
    }).catch(err => {
      console.error('Errore generazione PDF da HTML', err);
      this.ricevutaGenerata = false;
    });
  }
}