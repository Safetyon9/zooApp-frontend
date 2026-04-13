import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Utilities } from '../../../core/utils/utilities';

@Component({
  selector: 'app-gestione-ordini',
  templateUrl: './gestione-ordini.html',
  styleUrl: './gestione-ordini.css',
  standalone: false,
})
export class GestioneOrdini implements OnInit {

  filtro = {
    numero: '',
    cliente: '',
    totale: null
  };

  sortBy: string = 'numero';
  sortOrder: 'asc' | 'desc' = 'asc';

  ordiniList: any[] = [];
  loading = false;

  constructor(
    private util: Utilities,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.loading = true;

    setTimeout(() => {
      this.ordiniList = this.sortResults([]);
      this.loading = false;
      this.cdr.detectChanges();
    }, 500);
  }

  private sortResults(items: any[]): any[] {
    const sorted = [...items];

    sorted.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (this.sortBy) {
        case 'numero':
          aVal = (a.numero || '').toLowerCase();
          bVal = (b.numero || '').toLowerCase();
          break;
        case 'cliente':
          aVal = (a.cliente || '').toLowerCase();
          bVal = (b.cliente || '').toLowerCase();
          break;
        case 'totale':
          aVal = a.totale || 0;
          bVal = b.totale || 0;
          break;
        default:
          return 0;
      }

      if (aVal < bVal) return this.sortOrder === 'asc' ? -1 : 1;
      if (aVal > bVal) return this.sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }

  sort(field: string): void {
    if (this.sortBy === field) {
      this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortBy = field;
      this.sortOrder = 'asc';
    }
    this.search();
  }

  getSortIcon(field: string): string {
    if (this.sortBy !== field) return '⇅';
    return this.sortOrder === 'asc' ? '↑' : '↓';
  }

  get ordini() {
    return this.ordiniList;
  }
}
