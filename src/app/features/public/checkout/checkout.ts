import { Component, OnInit, signal, ChangeDetectorRef, Inject, PLATFORM_ID } from '@angular/core';
import { CartService } from '../../../core/services/cart-service';
import { ShopService } from '../../../core/services/shop-services';
import { UtenteServices } from '../../../core/services/utente-services';
import { CheckoutService } from '../../../core/services/checkout-services';
import { Router } from '@angular/router';
import { AuthServices } from '../../../core/services/auth-services';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-checkout',
  standalone: false,
  templateUrl: './checkout.html',
  styleUrl: './checkout.css'
})
export class Checkout implements OnInit {

  profiloOriginale: any = {};
  imgBaseUrl = "http://localhost:9090/files/";

  checkoutForm = {
    nome: '',
    cognome: '',
    email: '',
    telefono: '',
    indirizzo: ''
  };

  metodiPagamento: any[] = [];
  metodoSelezionato: number | null = null;
  spedizione: number = 5.99;

  couponCodice = '';
  couponResult: any = null;
  couponId: number | null = null;

  msg = signal('');
  success = signal(false);
  isLoading = false;

  constructor(
    private auth: AuthServices,
    private cartService: CartService,
    private shopService: ShopService,
    private utenteServices: UtenteServices,
    public checkoutService: CheckoutService,
    public router: Router,
    private cdr: ChangeDetectorRef,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const userId = this.getUserId();
    if (!userId) return;

    this.shopService.loadCart();

    this.utenteServices.findAllByUserName(userId).subscribe({
      next: (r: any) => {
        this.profiloOriginale = r;
        this.checkoutForm = {
          nome: r.nome ?? '',
          cognome: r.cognome ?? '',
          email: r.email ?? '',
          telefono: r.telefono ?? '',
          indirizzo: r.indirizzo ?? ''
        };

        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Errore caricamento profilo:', err);
      }
    });

    this.checkoutService.getMetodiPagamento().subscribe({
      next: (r) => {
        this.metodiPagamento = r;
      },
      error: () => {
        this.msg.set('Errore nel caricamento metodi di pagamento');
      }
    });
  }

  private getUserId(): any {
    return this.auth.grant()?.userId;
  }

  get items() {
    return this.cartService.items();
  }

  get subtotale() {
    return this.cartService.totalPrice();
  }

  get scontoAmount(): number {
    if (!this.couponResult?.valido) return 0;

    const tipo = this.couponResult.tipo;
    const valore = this.couponResult.valore;

    if (tipo === 'PERCENTUALE') {
      return this.subtotale * (valore / 100);
    }

    return valore;
  }

  verificaCoupon(): void {
    if (!this.couponCodice?.trim()) return;

    this.checkoutService
      .verificaCoupon(this.couponCodice.trim())
      .subscribe({
        next: (result) => {
          this.couponResult = result;
          this.couponId = result?.id ?? null;
        },
        error: () => {
          this.couponResult = {
            valido: false,
            msg: 'Errore durante la verifica coupon'
          };
        }
      });
  }
  
  get totaleFinale() {
    return this.subtotale + this.spedizione - this.scontoAmount;
  }

  confermaOrdine(): void {
    if (!this.checkoutForm.indirizzo) {
      this.msg.set('Inserisci un indirizzo di spedizione');
      return;
    }

    if (!this.metodoSelezionato) {
      this.msg.set('Seleziona un metodo di pagamento');
      return;
    }

    if (!this.profiloOriginale?.clienteId) {
      this.msg.set('Cliente non trovato');
      return;
    }

    this.isLoading = true;
    this.msg.set('');

    const body = {
      ordini: {
        clienteId: this.profiloOriginale.clienteId,
        indirizzo: this.checkoutForm.indirizzo
      },
      pagamenti: {
        metodoPagamentoId: this.metodoSelezionato,
        couponId: this.couponId ?? null,
        stato: 'ATTESA'
      },
      righe: this.cartService.items().map(i => ({
        itemId: i.itemId,
        quantita: i.quantita
      }))
    };

    this.checkoutService.creaOrdine(body).subscribe({
      next: (res: any) => {

        const ordineId = res?.ordineId ?? res?.id ?? null;

        const riepilogoOrdine = {
          ordineId,
          dataOrdine: new Date(),

          profilo: this.profiloOriginale,

          indirizzoSpedizione: this.checkoutForm.indirizzo,

          metodoPagamento: this.metodiPagamento
            .find(m => m.id === this.metodoSelezionato) ?? null,

          couponCodice: this.couponCodice || null,

          items: this.cartService.items().map(i => ({
            itemId: i.itemId,
            nome: i.nome,
            quantita: i.quantita,
            prezzoUnitario: i.prezzoUnitario,
            prezzoTotale: i.prezzoTotale,
            tipo: i.tipo
          }))
        };

        this.success.set(true);
        this.msg.set('Ordine confermato con successo!');

        this.shopService.loadCart();

        this.isLoading = false;

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