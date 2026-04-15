import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MetodiPagamentoApiService, MetodoPagamentoDTO } from '../../../core/services/metodi-pagamento-api-services';
import { Utilities } from '../../../core/utils/utilities';
import { MetodoPagamentoDialog } from './metodo-pagamento-dialog/metodo-pagamento-dialog';
import { ConfirmDialog } from '../../auth/dialog/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-gestione-metodo-pagamento',
  templateUrl: './gestione-metodo-pagamento.html',
  styleUrls: ['./gestione-metodo-pagamento.css'],
  standalone: false
})
export class GestioneMetodoPagamento implements OnInit {

  metodi: MetodoPagamentoDTO[] = [];
  loading = false;

  constructor(
    private api: MetodiPagamentoApiService,
    private util: Utilities,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading = true;
    this.api.list().subscribe({
      next: (resp) => {
        this.metodi = resp;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Errore caricamento metodi pagamento', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onCreate(): void {
    const dialogRef = this.util.openDialog(MetodoPagamentoDialog, { mod: 'C', item: null }, { width: '500px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const body = { ...result };
        delete body.id;
        this.api.create(body).subscribe(() => this.load());
      }
    });
  }

  onUpdate(item: MetodoPagamentoDTO): void {
    const dialogRef = this.util.openDialog(MetodoPagamentoDialog, { mod: 'U', item: { ...item } }, { width: '500px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.update(result).subscribe(() => this.load());
      }
    });
  }

  onDelete(item: MetodoPagamentoDTO): void {
    const dialogRef = this.util.openDialog(ConfirmDialog, { message: `Sei sicuro di voler eliminare il metodo "${item.nome}"?` });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.api.delete(item.id).subscribe(() => this.load());
      }
    });
  }
}
