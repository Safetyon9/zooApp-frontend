import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AuthServices } from '../../../core/services/auth-services';
import { Utilities } from '../../../core/utils/utilities';
import { OrdineDTO, OrdiniServices, PagamentoDTO } from '../../../core/services/ordini-services';

@Component({
  selector: 'app-ordini',
  standalone: false,
  templateUrl: './gestione-ordini.html',
  styleUrl: './gestione-ordini.css',
})
export class GestioneOrdini implements OnInit {
  filtro = {
    numero: '',
    stato: '',
    totale: null as number | null
  };

  sortBy: string = 'numero';
  sortOrder: 'asc' | 'desc' = 'asc';

  ordiniList: OrdineDTO[] = [];
  loading = false;

  clienteId: number | null = null;

  ordineSelezionato: OrdineDTO | null = null;
  pagamentoSelezionato: PagamentoDTO | null = null;
  

  constructor(
    private ordiniService: OrdiniServices,
    private cdr: ChangeDetectorRef,
    private auth: AuthServices
  ) {}

  ngOnInit(): void {
    this.search();
  }

 search(): void {
  this.loading = true;

   this.ordiniService.list().subscribe({
     next: (items) => {
      const filtered = items.filter(o =>
          (!this.filtro.numero || String(o.id ?? '').includes(this.filtro.numero)) &&
          (!this.filtro.stato || String(o.stato ?? '').toLowerCase().includes(this.filtro.stato.toLowerCase())) &&
          (this.filtro.totale === null || this.filtro.totale === undefined || this.getTotaleOrdine(o) >= Number(this.filtro.totale))
        );

        this.ordiniList = this.sortResults(filtered);
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.ordiniList = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  public getTotaleOrdine(o: OrdineDTO): number {
  return Number(o.importoTotale ?? 0);
}

  private sortResults(items: OrdineDTO[]): OrdineDTO[] {
    const sorted = [...items];

    sorted.sort((a, b) => {
      let aVal: any, bVal: any;

      switch (this.sortBy) {
        case 'numero':
          aVal = a.id ?? 0;
          bVal = b.id ?? 0;
          break;
        case 'stato':
          aVal = (a.stato || '').toLowerCase();
          bVal = (b.stato || '').toLowerCase();
          break;
        case 'totale':
          aVal = this.getTotaleOrdine(a);
          bVal = this.getTotaleOrdine(b);
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
    this.ordiniList = this.sortResults(this.ordiniList);
  }

  getSortIcon(field: string): string {
    if (this.sortBy !== field) return '⇅';
    return this.sortOrder === 'asc' ? '↑' : '↓';
  }

  dettaglioOrdine(o: OrdineDTO): void {
    this.ordineSelezionato = o;
  }

   dettaglioPagamento(idPagamento: number): void {
    if (!idPagamento) {
      this.pagamentoSelezionato = null;
      return;
    }

    this.pagamentoSelezionato = null;

    this.ordiniService.getPagamentoById(idPagamento).subscribe({
      next: (p) => {
        this.pagamentoSelezionato = p;
        this.cdr.detectChanges();
      },
      error: () => {
        this.pagamentoSelezionato = null;
        this.cdr.detectChanges();
      }
    });
  }
}