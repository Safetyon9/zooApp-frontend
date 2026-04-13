import { Component, OnInit, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CartService } from '../../../../../core/services/cart-service';
import { ItemsServices } from '../../../../../core/services/items-services';

@Component({
  selector: 'app-shop-merch',
  templateUrl: './shop-merch.html',
  styleUrl: './shop-merch.css',
  standalone: false,
})
export class ShopMerch implements OnInit {
  private cartS = inject(CartService);
  private itemsS = inject(ItemsServices);
  private http = inject(HttpClient);

  ngOnInit(): void {
    this.itemsS.list('prodotto').subscribe();
  }

  get prodotti() {
    return this.itemsS.prodotti();
  }

  addToCart(prodotto: any) {
    this.cartS.addToCart({
      id: prodotto.id,
      nome: prodotto.nome,
      prezzo: Number(prodotto.prezzo),
      quantita: 1,
      immagine: prodotto.urlImmagine
    }, 'prodotto');

    const currentUserId = localStorage.getItem('userId');
    if (!currentUserId) return;

    this.http.get(`http://localhost:9090/rest/utente/findAllByUserName?userName=${currentUserId}`).subscribe({
      next: (profilo: any) => {
        if (!profilo.carrelloId) return;
        this.http.post('http://localhost:9090/rest/oggettiCarrelli/create', {
          carrelloId: profilo.carrelloId,
          itemId: prodotto.id,
          quantita: 1,
          prezzoUnitario: prodotto.prezzo
        }).subscribe();
      }
    });
  }
}