import { Component } from '@angular/core';

@Component({
  selector: 'app-ecommerce',
  template: `
    <div class="ecommerce-container">
      <div class="shop-content">
        <h1>Lo Shop dello Zoo 🌳</h1>
        <div class="shop-categories" style="display: flex; gap: 2rem; justify-content: center; margin-top: 2rem;">
          <div class="shop-card" style="background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 15px; border: 1px solid gold;">
            <span style="font-size: 3rem;">🎟️</span>
            <h2>Biglietti</h2>
          </div>
          <div class="shop-card" style="background: rgba(255,255,255,0.1); padding: 2rem; border-radius: 15px; border: 1px solid gold;">
            <span style="font-size: 3rem;">👕</span>
            <h2>Merch</h2>
          </div>
        </div>
      </div>
    </div>
  `,
  styleUrl: './ecommerce.css',
  standalone: false,
})
export class Ecommerce {}
