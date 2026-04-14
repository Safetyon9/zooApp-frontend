import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Utilities } from '../../../core/utils/utilities';
import { CouponsServices } from '../../../core/services/coupons-services';
import { CouponDialog } from './coupons-dialog/coupons-dialog';
import { ConfirmDialog } from '../../auth/dialog/confirm-dialog/confirm-dialog';

@Component({
  selector: 'app-gestione-coupons',
  templateUrl: './gestione-coupons.html',
  styleUrls: ['./gestione-coupons.css'],
  standalone: false
})
export class GestioneCoupons implements OnInit {

  coupons: any[] = [];
  loading = false;

  constructor(
    private couponsS: CouponsServices,
    private util: Utilities,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.search();
  }

  search(): void {
    this.loading = true;

    this.couponsS.list().subscribe({
      next: (resp: any[]) => {
        this.coupons = (resp || []).map((c: any) => ({
          id: c.id ?? '',
          codice: c.codice ?? '',
          tipo: c.tipo ?? '',
          valore: c.valore ?? '',
          inizioValidita: c.dataInizio ?? c.inizioValidita ?? c.inizio_validita ?? '',
          fineValidita: c.dataFine ?? c.fineValidita ?? c.fine_validita ?? '',
          attivo: c.attivo ?? false
        }));

        this.loading = false;
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Errore caricamento coupons', err);
        this.coupons = [];
        this.loading = false;
        this.cdr.detectChanges();
      }
    });
  }

  onCreateCoupon(): void {
    const dialogRef = this.util.openDialog(
      CouponDialog,
      {
        mod: 'C',
        coupon: null
      },
      {
        width: '720px',
        maxWidth: '95vw',
        height: 'auto'
      }
    );

    if (dialogRef?.afterClosed) {
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          setTimeout(() => {
            this.search();
          }, 0);
        }
      });
    }
  }

  eseguoUpdate(coupon: any): void {
    const dialogRef = this.util.openDialog(
      CouponDialog,
      {
        mod: 'U',
        coupon: { ...coupon }
      },
      {
        width: '720px',
        maxWidth: '95vw',
        height: 'auto'
      }
    );

    if (dialogRef?.afterClosed) {
      dialogRef.afterClosed().subscribe((result: any) => {
        if (result) {
          setTimeout(() => {
            this.search();
          }, 0);
        }
      });
    }
  }

  eliminaCoupon(coupon: any): void {
    const dialogRef = this.util.openDialog(ConfirmDialog, { message: `Sei sicuro di voler eliminare il coupon "${coupon.codice}"?` });
    dialogRef.afterClosed().subscribe((res: boolean) => {
      if (!res) return;

    this.couponsS.delete(coupon.id).subscribe({
      next: () => {
        this.coupons = this.coupons.filter(c => c.id !== coupon.id);
        this.cdr.detectChanges();
      },
      error: (err: any) => {
        console.error('Errore eliminazione coupon', err);
      }
    });
    });
  }
}