import { Component, Inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CouponsServices } from '../../../../core/services/coupons-services';

@Component({
  selector: 'app-coupon-dialog',
  templateUrl: './coupons-dialog.html',
  styleUrls: ['./coupons-dialog.css'],
  standalone: false,
})
export class CouponDialog implements OnInit {

  coupon = signal<any | null>(null);
  mod = signal<string>('');
  msg = signal<string>('');

  updateForm = new FormGroup({
    codice: new FormControl<string>('', { nonNullable: true }),
    tipo: new FormControl<string>('', { nonNullable: true, validators: [Validators.required] }),
    valore: new FormControl<number | null>(null, [Validators.required, Validators.min(0)]),
    inizioValidita: new FormControl<Date | null>(null, [Validators.required]),
    fineValidita: new FormControl<Date | null>(null, [Validators.required]),
    attivo: new FormControl<boolean>(true, { nonNullable: true })
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private dialogRef: MatDialogRef<CouponDialog>,
    private couponsS: CouponsServices
  ) {
    this.mod.set(data?.mod ?? '');
    this.coupon.set(data?.coupon ?? null);
  }

  ngOnInit(): void {
    if (this.mod() === 'U') {
      this.loadCoupon();
    }
  }

  onSubmit(): void {
    if (this.updateForm.invalid) {
      this.updateForm.markAllAsTouched();
      return;
    }

    this.msg.set('');

    if (this.mod() === 'C') {
      this.onCreate();
      return;
    }

    this.onUpdate();
  }

  onCreate(): void {
    const v = this.updateForm.getRawValue();

    const body = {
      codice: v.codice?.trim() || null,
      tipo: v.tipo,
      valore: v.valore,
      dataInizio: this.toDateOnly(v.inizioValidita),
      dataFine: this.toDateOnly(v.fineValidita),
      attivo: v.attivo
    };

    this.couponsS.create(body).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) => {
        this.msg.set(
          err?.error?.msg ||
          err?.error?.message ||
          err?.error?.text ||
          'Errore durante la creazione'
        );
      }
    });
  }

  onUpdate(): void {
    const currentCoupon = this.coupon();

    if (!currentCoupon?.id) {
      this.msg.set('Coupon non trovato');
      return;
    }

    const v = this.updateForm.getRawValue();

    const body = {
      id: currentCoupon.id,
      codice: v.codice?.trim() || null,
      tipo: v.tipo,
      valore: v.valore,
      dataInizio: this.toDateOnly(v.inizioValidita),
      dataFine: this.toDateOnly(v.fineValidita),
      attivo: v.attivo
    };

    this.couponsS.update(body).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) => {
        this.msg.set(
          err?.error?.msg ||
          err?.error?.message ||
          err?.error?.text ||
          'Errore durante l\'aggiornamento'
        );
      }
    });
  }

  remove(): void {
    const currentCoupon = this.coupon();

    if (!currentCoupon?.id) {
      this.msg.set('Id coupon non valido');
      return;
    }

    this.couponsS.delete(currentCoupon.id).subscribe({
      next: () => this.dialogRef.close(true),
      error: (err: any) => {
        this.msg.set(
          err?.error?.msg ||
          err?.error?.message ||
          err?.error?.text ||
          'Errore durante la cancellazione'
        );
      }
    });
  }

  private loadCoupon(): void {
    const c = this.coupon();
    if (!c) return;

    this.updateForm.patchValue({
      codice: c.codice ?? '',
      tipo: c.tipo ?? '',
      valore: c.valore ?? null,
      inizioValidita: this.fromDateOnly(c.inizioValidita ?? c.dataInizio ?? null),
      fineValidita: this.fromDateOnly(c.fineValidita ?? c.dataFine ?? null),
      attivo: c.attivo ?? false
    });
  }

  private toDateOnly(value: Date | null): string | null {
    if (!value) return null;

    const year = value.getFullYear();
    const month = String(value.getMonth() + 1).padStart(2, '0');
    const day = String(value.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  private fromDateOnly(value: string | null): Date | null {
    if (!value) return null;

    const [year, month, day] = value.split('-').map(Number);
    if (!year || !month || !day) return null;

    return new Date(year, month - 1, day);
  }
}