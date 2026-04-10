import { Component, computed, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CartService, CartItem } from '../../../core/services/cart-service';
import { UtenteServices } from '../../../core/services/utente-services';
import { HttpClient, HttpParams } from '@angular/common/http';

@Component({
  selector: 'app-carrello',
  standalone: false,
  templateUrl: './carrello.html',
  styleUrl: './carrello.css'
})
export class Carrello implements OnInit{

  constructor(
    public cartService: CartService,
    private router: Router,
    private utenteServices: UtenteServices,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    this.utenteServices.findAllByUserName(userId).subscribe({
      next: (profilo: any) => {
        if (!profilo.carrelloId) return;

        const params = new HttpParams().set('id', profilo.carrelloId);
        this.http.get('http://localhost:9090/rest/carrelli/findById', { params }).subscribe({
          next: (carrello: any) => {
            this.cartService.clearCart();
            carrello.oggettiCarrello?.forEach((obj: any) => {
              this.cartService.addToCart({
                id: obj.itemId,
                nome: obj.item?.nome ?? 'Articolo #' + obj.itemId,
                prezzo: Number(obj.prezzoUnitario),
                quantita: obj.quantita,
                immagine: obj.item?.urlImmagine ?? ''
              }, 'prodotto');
            });
          }
        });
      }
    });
  }

  get subtotale(): number {
    return this.cartService.items().reduce(
      (acc, item) => acc + item.prezzo * item.quantita, 0
    );
  }

  incrementa(item: CartItem): void {
    this.cartService.addToCart({ ...item, quantita: 1 }, item.tipo);
  }

  decrementa(item: CartItem): void {
    if (item.quantita <= 1) {
      this.rimuovi(item);
      return;
    }
    const aggiornati = this.cartService.items().map(i =>
      i.id === item.id && i.tipo === item.tipo && i.nome === item.nome
        ? { ...i, quantita: i.quantita - 1 }
        : i
    );
    this.cartService['cartItems'].set(aggiornati);
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
    this.svuota();
    this.router.navigate(['/shop']);
  }
}