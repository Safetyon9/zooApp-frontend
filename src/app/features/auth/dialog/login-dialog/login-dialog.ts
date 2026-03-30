import { Component, inject, signal } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { UtenteServices } from '../../../user/services/utente-services';
import { AuthServices } from '../../../../core/services/auth-services';
import { Router } from '@angular/router';
import { Utilities } from '../../../../core/utils/utilities';
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
      username: signin.form.value.username,
      pwd: signin.form.value.pwd
    }).subscribe({
      next: (resp: any) => {
        this.msg.set("");
        console.log(resp)
        this.auth.setAutentificated(resp.username);

        if (resp.ruolo == 'ADMIN') this.auth.setAdmin();
        if (resp.ruolo == 'USER') this.auth.setUser();

        console.log('[LoginDialog] dopo login, isAutentificated =', this.auth.isAutentificated() );
       

        this.dialogRef.close(true);
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