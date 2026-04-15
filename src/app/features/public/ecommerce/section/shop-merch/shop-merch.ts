import { Component, OnInit, computed } from '@angular/core';
import { ItemsServices } from '../../../../../core/services/items-services';
import { ShopService } from '../../../../../core/services/shop-services';

@Component({
  selector: 'app-shop-merch',
  templateUrl: './shop-merch.html',
  styleUrl: './shop-merch.css',
  standalone: false,
})
export class ShopMerch implements OnInit {

  imgBaseUrl = 'http://localhost:9090/files/';

  constructor(
    public itemsS: ItemsServices,
    public shop: ShopService
  ) {}

  ngOnInit(): void {
    this.itemsS.list('prodotto').subscribe();
  }

  prodottiPerCategoria = computed(() => {
    const prodotti = this.itemsS.prodotti() || [];

    const gruppi = prodotti.reduce((acc: any, prodotto: any) => {
      const categoria = prodotto.categoriaNome?.trim() || 'Altri prodotti';

      if (!acc[categoria]) {
        acc[categoria] = [];
      }

      acc[categoria].push(prodotto);
      return acc;
    }, {});

    return Object.keys(gruppi)
      .sort((a, b) => a.localeCompare(b))
      .map(categoria => ({
        categoria,
        prodotti: gruppi[categoria].sort((a: any, b: any) =>
          a.nome.localeCompare(b.nome)
        )
      }));
  });

  getImageUrl(prodotto: any): string {
    const img = prodotto?.urlImmagine;

    if (!img) {
      return 'foto/merch/tshirt-crema-leone.png';
    }

    if (img.startsWith('http://') || img.startsWith('https://')) {
      return img;
    }

    return this.imgBaseUrl + img;
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'foto/merch/tshirt-crema-leone.png';
  }

  addToCart(prodotto: any) {
    this.shop.addToCart(prodotto.id, 1);
  }
}