import { ComponentType } from '@angular/cdk/overlay';
import { Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class Utilities {
   constructor(private dialog: MatDialog) {}

  openDialog<T, D = any, R = any>(
    component: ComponentType<T>,
    data?: D,
    config?: MatDialogConfig<D>
  ): MatDialogRef<T, R> {

    const baseConfig: MatDialogConfig<D> = {
      width: '1100px',
      maxWidth: '90vw',
      height: 'auto',
      maxHeight: '200vh',
      enterAnimationDuration: '500ms',
      exitAnimationDuration: '500ms',
      panelClass: 'wide-dialog',
      data
    };

    return this.dialog.open<T, D, R>(component, {
      ...baseConfig,
      ...config   
    });
  }

}