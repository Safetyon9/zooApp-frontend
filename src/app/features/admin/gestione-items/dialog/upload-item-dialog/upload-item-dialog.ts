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
  loading = signal<boolean>(false);

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
      this.uploadServices.getUrl(p.urlImmagine)
        .subscribe({
          next: (r: any) => {
            this.imageUrl.set(r?.msg || null);
          },
          error: () => {
            this.msg.set('Errore caricamento immagine');
          }
        });
    }
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files || input.files.length === 0) {
      this.resetSelection();
      return;
    }

    this.selectedFile = input.files[0];
    this.fileName = this.selectedFile.name;

    const reader = new FileReader();
    reader.onload = () => {
      this.imageUrl.set(reader.result as string);
    };
    reader.readAsDataURL(this.selectedFile);

    this.msg.set("");
  }

  onUpload(): void {
    const prodotto = this.prodotto();

    if (!prodotto?.id || !this.selectedFile) {
      this.msg.set('Seleziona un file prima di caricare');
      return;
    }

    this.loading.set(true);

    this.uploadServices.upload(
      this.selectedFile,
      prodotto.id,
      'prodotto'
    )
    .subscribe({
      next: (r: any) => {
        const filename = r?.msg;

        this.uploadServices.getUrl(filename)
          .subscribe({
            next: (r2: any) => {
              this.loading.set(false);

              const finalUrl = r2?.msg || null;
              this.imageUrl.set(finalUrl);

              this.prodotto.update(p => ({
                ...p,
                urlImmagine: filename
              }));

              this.dialogRef.close({
                updated: true,
                filename: filename,
                url: finalUrl
              });
            },
            error: () => {
              this.loading.set(false);
              this.msg.set('Errore recupero URL immagine');
            }
          });
      },
      error: (err: any) => {
        this.loading.set(false);
        this.msg.set(err.error?.msg || 'Errore upload');
      }
    });
  }

  resetSelection(): void {
    this.fileName = '';
    this.selectedFile = null;
  }

  close(): void {
    this.dialogRef.close();
  }
}