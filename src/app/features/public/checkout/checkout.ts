import { Component, OnInit, signal, inject, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CartService } from '../../../core/services/cart-service';
import { UtenteServices } from '../../../core/services/utente-services';
import { CheckoutService } from '../../../core/services/checkout-services';
import { Router } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {

  profilo: any = {};
  metodiPagamento: any[] = [];
  metodoSelezionato: number | null = null;
  couponCodice = '';
  couponMsg = signal('');
  couponValido = signal(false);
  couponId: number | null = null;
  scontoAmount = 0;
  indirizzoSpedizione = '';
  msg = signal('');
  success = signal(false);
  isLoading = false;

  constructor(
  private cartService: CartService,
  private utenteServices: UtenteServices,
  public checkoutService: CheckoutService,
  public router: Router,
  private cdr: ChangeDetectorRef,
  @Inject(PLATFORM_ID) private platformId: Object
) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.utenteServices.findAllByUserName(userId).subscribe({
      next: (r: any) => {
        this.profilo = r;
        this.indirizzoSpedizione = r.indirizzo ?? '';
        this.cdr.detectChanges();
      }
    });

    this.checkoutService.getMetodiPagamento().subscribe({
      next: (r) => this.metodiPagamento = r,
      error: () => this.msg.set('Errore nel caricamento metodi di pagamento')
    });
  }

  get items() { return this.cartService.items(); }
  get subtotale(): number { return this.cartService.totalPrice(); }
  get totaleFinale(): number { return Math.max(0, this.subtotale - this.scontoAmount); }

  verificaCoupon(): void {
    if (!this.couponCodice?.trim()) return;

    this.couponValido.set(false);
    this.scontoAmount = 0;
    this.couponId = null;
    this.couponMsg.set('');

    this.checkoutService
      .verificaCouponRemoto(this.couponCodice.trim(), this.subtotale)
      .subscribe({
        next: (result) => {
          this.couponValido.set(!!result.valido);
          this.scontoAmount = result.sconto ?? 0;
          this.couponId = result.couponId ?? null;
          this.couponMsg.set(result.msg ?? '');
        },
        error: () => {
          this.couponValido.set(false);
          this.scontoAmount = 0;
          this.couponId = null;
          this.couponMsg.set('Errore durante la verifica coupon');
        }
      });
  }

  confermaOrdine(): void {
    if (!this.indirizzoSpedizione) {
      this.msg.set('Inserisci un indirizzo di spedizione');
      return;
    }

    if (!this.metodoSelezionato) {
      this.msg.set('Seleziona un metodo di pagamento');
      return;
    }

    if (!this.profilo?.clienteId) {
      this.msg.set('Cliente non trovato');
      return;
    }

    this.isLoading = true;
    this.msg.set('');

    const body = {
      ordini: {
        clienteId: this.profilo.clienteId,
        indirizzo: this.indirizzoSpedizione
      },
      pagamenti: {
        importo: this.totaleFinale,
        metodoPagamentoId: this.metodoSelezionato,
        couponId: this.couponId ?? null,
        stato: 'ATTESA'
      },
      righe: this.cartService.items().map(i => ({
        itemId: i.itemId,
        quantita: i.quantita,
        prezzoUnitario: i.prezzoUnitario,
        prezzoTotale: i.prezzoTotale
      }))
    };

    this.checkoutService.confermaOrdine(body).subscribe({
    next: (res: any) => {
      const riepilogoOrdine = {
        ordineId: res?.ordineId ?? res?.id ?? null,
        dataOrdine: new Date(), // o stringa formattata
        profilo: this.profilo,
        indirizzoSpedizione: this.indirizzoSpedizione,
        metodoPagamento: this.metodiPagamento.find(m => m.id === this.metodoSelezionato) ?? null,
        couponCodice: this.couponValido() ? this.couponCodice : null,
        scontoAmount: Number(this.scontoAmount) || 0,
        subtotale: Number(this.subtotale) || 0,
        totaleFinale: Number(this.totaleFinale) || 0,
        items: this.cartService.items().map(i => ({
          ...i,
          prezzoTotale: Number(i.prezzoTotale) || 0,
          prezzoUnitario: Number(i.prezzoUnitario) || 0,
          quantita: Number(i.quantita) || 0
        }))
      };

      this.success.set(true);
      this.msg.set('Ordine confermato con successo!');

      // svuota carrello
      this.checkoutService.svuotaCarrello?.(); // vedi punto 2

      this.isLoading = false;

      // redirect con riepilogo
      this.router.navigate(['/pagamento-ricevuto'], {
        state: { ordine: riepilogoOrdine }
      });
      },
      error: (err) => {
        this.msg.set(err.error?.msg || 'Errore nella conferma ordine');
        this.isLoading = false;
      }
    });
    }
}