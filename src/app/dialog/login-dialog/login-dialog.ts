import { Component, inject, signal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UtenteServices } from '../../services/utente-services';
import { AuthServices } from '../../auth/auth-services';
import { Router } from '@angular/router';
import { Utilities } from '../../services/utilities';
import { NgForm } from '@angular/forms';
import { RegisterDialog } from '../register-dialog/register-dialog';

@Component({
  selector: 'app-login-dialog',
  standalone: false,
  templateUrl: './login-dialog.html',
  styleUrl: './login-dialog.css',
})
export class LoginDialog {
 msg = signal('');
  readonly dialog = inject(MatDialog);

  constructor(
    private account: UtenteServices,
    private auth: AuthServices,
    private routing: Router,
    private util: Utilities,
    private dialogRef: MatDialogRef<LoginDialog>
  ) { }

  onSubmit(signin: NgForm) {
    this.account.login({
      userName: signin.form.value.userName,
      pwd: signin.form.value.password
    }).subscribe({
      next: (resp: any) => {
        this.msg.set("");
        console.log(resp)
        this.auth.setAutentificated(resp.id);
        if (resp.role == 'ADMIN') this.auth.setAdmin();
        if (resp.role == 'USER') this.auth.setUser();

        console.log('[LoginDialog] dopo login, isAutentificated =', this.auth.isAutentificated() );
       

        this.dialogRef.close(true);
        this.routing.navigate(['/dash']);
      },
      error: (resp: any) => {
        console.log(resp);
        this.msg.set(resp.error.msg);
      }
    });
  }


  registrazione() {
   
    this.util.openDialog(RegisterDialog,
      {
        account: null,
        mode: "C"
      }, 
      {
        width: '90vw',
        maxWidth: '1200px',
        height: 'auto',
      }
    );
   
  }



}