import { Component, Inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UploadServices } from '../../../../../core/services/upload-services';

@Component({
  selector: 'app-upload-item-dialog',
  standalone: false,
  templateUrl: './upload-item-dialog.html',
  styleUrl: './upload-item-dialog.css',
})
export class UploaditemDialog implements OnInit {

  prodotto = signal<any>(null);
  imageUrl = signal<string | null>(null);
  msg = signal<string>("");

  fileName: string = '';
  selectedFile: File | null = null;

  constructor(
    @Inject(MAT_DIALOG_DATA) private data: any,
    private uploadServices: UploadServices,
    private dialogRef: MatDialogRef<UploaditemDialog>
  ) {
    if (data?.prodotto) {
      this.prodotto.set(data.prodotto);
    }
  }

  ngOnInit(): void {
    const p = this.prodotto();

    if (p?.urlImmagine) {
      this.imageUrl.set(this.normalizeUrl(p.urlImmagine));
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.fileName = '';
      this.selectedFile = null;
      return;
    }

    this.selectedFile = input.files[0];
    this.fileName = this.selectedFile.name;

    this.onUpload();
  }

  onUpload(): void {
    const prodotto = this.prodotto();

    if (!prodotto?.id || !this.selectedFile) {
      console.log("UPLOAD ABORTED → missing id or file");
      return;
    }

    this.uploadServices.upload(
      this.selectedFile,
      prodotto.id,
      'prodotto'
    )
    .subscribe({
      next: (r: any) => {

        console.log("UPLOAD RESPONSE →", r);

        const url = r?.msg;

        if (!url) {
          this.msg.set("Errore: URL mancante dal backend");
          return;
        }

        this.imageUrl.set(this.normalizeUrl(url));

      },
      error: (err: any) => {
        console.error("UPLOAD ERROR →", err);
        this.msg.set(err.error?.msg || 'Errore upload');
      }
    });
  }

  private normalizeUrl(url: string): string {
    if (!url) return '';

    return url.startsWith('http')
      ? url
      : `http://localhost:9090/files/${url}`;
  }

  close(): void {
    this.dialogRef.close();
  }
}