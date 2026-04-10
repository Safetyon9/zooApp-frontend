import { Component, inject, OnInit } from '@angular/core';
import { CartService } from '../../../../../core/services/cart-service';
import { ItemsServices } from '../../../../../core/services/items-services';
import { UtenteServices } from '../../../../../core/services/utente-services';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-shop-biglietti',
  templateUrl: './shop-biglietti.html',
  styleUrl: './shop-biglietti.css',
  standalone: false,
})
export class ShopBiglietti implements OnInit {
  step = 1;
  selectedTicket: any = null;
  selectedDate: string = '';
  selectedQuantity: number = 1;

  standardCategory: 'Adulto' | 'Bambino' | '' = '';
  familyKids: number = 0;
  readonly familyParents: number = 2;
  reducedCategory: 'Bambini 10-12' | 'Over 65' | 'Disabilità' | 'Ridotto Accompagnatore' | '' = '';

  private cartS = inject(CartService);
  private itemsS = inject(ItemsServices);
  private utenteServices = inject(UtenteServices);
  private http = inject(HttpClient);

  constructor() {}

  ngOnInit(): void {
    this.itemsS.list('biglietti').subscribe({
      next: () => console.log('biglietti:', JSON.stringify(this.itemsS.biglietti()))
    });
  }

  get biglietti() {
    return this.itemsS.biglietti();
  }

  selectTicket(ticket: any) {
    this.selectedTicket = ticket;
    this.step = 2;
    this.selectedDate = '';
    this.selectedQuantity = 1;
    this.standardCategory = '';
    this.familyKids = 0;
    this.reducedCategory = '';
  }

  confirmPurchase() {
    if (!this.selectedTicket || !this.selectedDate) return;
    if (!this.selectedQuantity || this.selectedQuantity < 1) return;

    let details = '';

    if (this.selectedTicket.tipo?.nome === 'Standard') {
      if (!this.standardCategory) return;
      details = `Categoria: ${this.standardCategory}`;
    } else if (this.selectedTicket.tipo?.nome === 'Famiglia') {
      details = `Genitori: ${this.familyParents}, Bambini: ${this.familyKids}`;
    } else if (this.selectedTicket.tipo?.nome === 'Ridotto') {
      if (!this.reducedCategory) return;
      details = `Categoria: ${this.reducedCategory}`;
    }

    const nomeConDettagli = [
      this.selectedTicket.nome,
      `Qtà: ${this.selectedQuantity}`,
      details,
      `Data: ${this.selectedDate}`,
    ].filter(Boolean).join(' • ');

    const prezzoTotale = Number(this.selectedTicket.prezzo) * Number(this.selectedQuantity);

    this.cartS.addToCart({
      id: this.selectedTicket.id,
      nome: nomeConDettagli,
      prezzo: prezzoTotale,
      quantita: 1,
      immagine: this.selectedTicket.urlImmagine,
    }, 'biglietto');

    const userId = localStorage.getItem('userId');

    if (!userId) return;

    this.utenteServices.findAllByUserName(userId).subscribe({
      next: (profilo: any) => {
        console.log('profilo:', JSON.stringify(profilo));
        
        this.http.post('http://localhost:9090/rest/oggettiCarrelli/create', {
          carrelloId: profilo.carrelloId,
          itemId: this.selectedTicket.id,
          quantita: this.selectedQuantity,
          prezzoUnitario: this.selectedTicket.prezzo
        }).subscribe({
          next: () => this.reset()
        });
      }
    });
  }

  reset() {
    this.step = 1;
    this.selectedTicket = null;
    this.selectedDate = '';
    this.selectedQuantity = 1;
    this.standardCategory = '';
    this.familyKids = 0;
    this.reducedCategory = '';
  }
}