import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart-service';
import { CartItem } from '../../../core/services/cart-service';
import { UtenteServices } from '../../../core/services/utente-services';
import { HttpClient, HttpParams } from '@angular/common/http';
import { AuthServices } from '../../../core/services/auth-services';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

@Component({
  selector: 'app-carrello',
  standalone: false,
  templateUrl: './carrello.html',
  styleUrl: './carrello.css'
})
export class Carrello implements OnInit {

  constructor(
    public cartService: CartService,
    private router: Router,
    private utenteServices: UtenteServices,
    private http: HttpClient,
    private auth: AuthServices,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {

    if (!isPlatformBrowser(this.platformId)) return;

    const userId = this.auth.grant().userId;
    if (!userId) return;

    this.utenteServices.findAllByUserName(userId).subscribe({
      next: (profilo: any) => {

        if (!profilo.carrelloId) return;

        const params = new HttpParams().set('id', profilo.carrelloId);

        this.http.get('http://localhost:9090/rest/carrelli/findById', { params })
          .subscribe({
            next: (carrello: any) => {

              this.cartService.setCart(
                carrello.oggettiCarrello?.map((obj: any) => ({
                  id: obj.itemId,
                  nome: obj.item?.nome ?? 'Articolo #' + obj.itemId,
                  prezzo: Number(obj.prezzoUnitario),
                  quantita: obj.quantita,
                  immagine: obj.item?.urlImmagine ?? '',
                  tipo: 'prodotto'
                })) ?? []
              );
            }
          });
      }
    });
  }

  get subtotale(): number {
    return this.cartService.totalPrice();
  }

  incrementa(item: CartItem): void {
    this.cartService.addToCart(item, item.tipo, 1);
  }

  decrementa(item: CartItem): void {
    this.cartService.decrement(item, 1);
  }

  rimuovi(item: CartItem): void {
    this.cartService.removeFromCart(item.id, item.tipo);
  }

  svuota(): void {
    this.cartService.clearCart();
  }

  checkout(): void {
    this.router.navigate(['/utente/checkout']);
  }

  tornaAlNegozio(): void {
    this.router.navigate(['/shop']);
  }
}