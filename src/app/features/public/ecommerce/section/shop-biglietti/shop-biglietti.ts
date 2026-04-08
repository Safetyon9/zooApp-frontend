import { Component } from '@angular/core';
import { CartService } from '../../../../../core/services/cart-service';

@Component({
  selector: 'app-shop-biglietti',
  templateUrl: './shop-biglietti.html',
  styleUrl: './shop-biglietti.css',
  standalone: false,
})
export class ShopBiglietti {
  step = 1;
  selectedTicket: any = null;
  selectedDate: string = '';
  selectedQuantity: number = 1;

  standardCategory: 'Adulto' | 'Bambino' | '' = '';

  familyKids: number = 0;
  readonly familyParents: number = 2;

  reducedCategory:
    | 'Bambini 10-12'
    | 'Over 65'
    | 'Disabilità'
    | 'Ridotto Accompagnatore'
    | '' = '';

  constructor(private cartS: CartService) {}

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
    if (!this.selectedTicket) return;
    if (!this.selectedDate) return;
    if (!this.selectedQuantity || this.selectedQuantity < 1) return;

    let details = '';

    if (this.selectedTicket.id === 1) {
      if (!this.standardCategory) return;
      details = `Categoria: ${this.standardCategory}`;
    }

    if (this.selectedTicket.id === 2) {
      if (this.familyKids < 0) return;
      details = `Genitori: ${this.familyParents}, Bambini: ${this.familyKids}`;
    }

    if (this.selectedTicket.id === 3) {
      if (!this.reducedCategory) return;
      details = `Categoria: ${this.reducedCategory}`;
    }

    const nomeConDettagli = [
      `${this.selectedTicket.nome}`,
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
      immagine: this.selectedTicket.immagine,
    }, 'biglietto');

    this.reset();
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
