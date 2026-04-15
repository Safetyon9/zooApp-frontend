import { Component, Inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-corriere-dialog',
  templateUrl: './corriere-dialog.html',
  styleUrls: ['./corriere-dialog.css'],
  standalone: false
})
export class CorriereDialog implements OnInit {

  form: FormGroup;
  mod: 'C' | 'U' = 'C';

  constructor(
    public dialogRef: MatDialogRef<CorriereDialog>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.mod = data.mod || 'C';
    this.form = new FormGroup({
      id: new FormControl(data.item?.id || null),
      nome: new FormControl(data.item?.nome || '', Validators.required)
    });
  }

  ngOnInit(): void {}

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }
}
