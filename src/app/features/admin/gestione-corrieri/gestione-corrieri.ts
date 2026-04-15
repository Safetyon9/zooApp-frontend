import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CorrieriApiService, CorriereDTO } from '../../../core/services/corrieri-api-services';
import { Utilities } from '../../../core/utils/utilities';
import { CorriereDialog } from './corriere-dialog/corriere-dialog';
import { ConfirmDialog } from '../../auth/dialog/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-gestione-corrieri',
  templateUrl: './gestione-corrieri.html',
  styleUrls: ['./gestione-corrieri.css'],
  standalone: false
})
export class GestioneCorrieri implements OnInit {

  corrieri: CorriereDTO[] = [];
  loading = false;

  constructor(
    private api: CorrieriApiService,
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
        this.corrieri = resp;
        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Errore caricamento corrieri', err);
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onCreate(): void {
    const dialogRef = this.util.openDialog(CorriereDialog, { mod: 'C', item: null }, { width: '500px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        const body = { ...result };
        delete body.id;
        this.api.create(body).subscribe(() => this.load());
      }
    });
  }

  onUpdate(item: CorriereDTO): void {
    const dialogRef = this.util.openDialog(CorriereDialog, { mod: 'U', item: { ...item } }, { width: '500px' });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.api.update(result).subscribe(() => this.load());
      }
    });
  }

  onDelete(item: CorriereDTO): void {
    const dialogRef = this.util.openDialog(ConfirmDialog, { message: `Sei sicuro di voler eliminare il corriere "${item.nome}"?` });
    dialogRef.afterClosed().subscribe(res => {
      if (res) {
        this.api.delete(item.id).subscribe(() => this.load());
      }
    });
  }
}
