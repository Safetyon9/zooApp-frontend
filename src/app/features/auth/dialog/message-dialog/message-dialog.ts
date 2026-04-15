import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface MessageData {
  title: string;
  message: string;
  type: 'success' | 'error' | 'info';
}

@Component({
  selector: 'app-message-dialog',
  standalone: false,
  templateUrl: './message-dialog.html',
  styleUrl: './message-dialog.css',
})
export class MessageDialog {
  constructor(
    public dialogRef: MatDialogRef<MessageDialog>,
    @Inject(MAT_DIALOG_DATA) public data: MessageData
  ) {}
}
