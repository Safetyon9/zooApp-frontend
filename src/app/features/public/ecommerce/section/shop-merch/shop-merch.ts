import { Component, OnInit, computed, signal } from '@angular/core';
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

  searchTerm = signal<string>('');
  selectedCategory = signal<string>('');
  sortBy = signal<'none' | 'priceAsc' | 'priceDesc'>('none');

  constructor(
    public itemsS: ItemsServices,
    public shop: ShopService
  ) {}

  ngOnInit(): void {
    this.itemsS.list('prodotto').subscribe();
  }

  categories = computed(() => {
    const prodotti = this.itemsS.prodotti() || [];
    const set = new Set<string>();
    prodotti.forEach(p => {
      const c = p.categoriaNome?.trim();
      if (c) set.add(c);
    });
    return Array.from(set).sort((a, b) => a.localeCompare(b));
  });

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

    return Object.keys(gruppi).map(categoria => ({
      categoria,
      prodotti: [...gruppi[categoria]]
    }));
  });

  private matchesSearch(p: any, term: string): boolean {
    if (!term.trim()) return true;
    const t = term.toLowerCase().trim();
    return (
      (p.nome || '').toLowerCase().includes(t) ||
      (p.descrizione || '').toLowerCase().includes(t)
    );
  }

  private applySort(prodotti: any[]): any[] {
    const mode = this.sortBy();
    if (mode === 'none') {
      return [...prodotti].sort((a, b) =>
        (a.nome || '').localeCompare(b.nome || '')
      );
    }

    return [...prodotti].sort((a, b) => {
      const pa = Number(a.prezzo) || 0;
      const pb = Number(b.prezzo) || 0;
      if (mode === 'priceAsc') {
        return pa - pb;
      }
      return pb - pa;
    });
  }

  prodottiPerCategoriaFiltrati = computed(() => {
    const selectedCat = this.selectedCategory().trim();
    const term = this.searchTerm();

    const gruppiFiltrati = this.prodottiPerCategoria()
      .map(gruppo => {
        const prodottiFiltrati = gruppo.prodotti.filter((p: any) =>
          (!selectedCat || p.categoriaNome === selectedCat) &&
          this.matchesSearch(p, term)
        );

        const prodottiOrdinati = this.applySort(prodottiFiltrati);

        const minPrice = prodottiOrdinati.length
          ? Number(
              prodottiOrdinati.reduce(
                (min: any, p: any) =>
                  Number(p.prezzo) < Number(min.prezzo) ? p : min,
                prodottiOrdinati[0]
              ).prezzo
            )
          : Number.POSITIVE_INFINITY;

        return {
          categoria: gruppo.categoria,
          prodotti: prodottiOrdinati,
          minPrice
        };
      })
      .filter(gruppo => gruppo.prodotti.length > 0);

    return gruppiFiltrati
      .sort((a, b) => a.minPrice - b.minPrice)
      .map(({ categoria, prodotti }) => ({ categoria, prodotti }));
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
    this.shop.addToCart(
      {
        ...prodotto,
        immagine: this.getImageUrl(prodotto)
      },
      'prodotto',
      1,
      {}
    );
  }
}