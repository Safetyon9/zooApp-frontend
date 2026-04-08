import { Component, inject } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-scelta-update-dialog',
  standalone: false,
  templateUrl: './scelta-update-dialog.html',
  styleUrl: './scelta-update-dialog.css',
})
export class SceltaUpdateDialog {
  updateType:any;

  readonly dialog = inject(MatDialog);

  constructor(
    private dialogRef: MatDialogRef<SceltaUpdateDialog>
  ) { }

  onUpdateTypeChange(){
    this.dialogRef.close(this.updateType);
  }
}
