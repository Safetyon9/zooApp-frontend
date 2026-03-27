import { Component, inject } from '@angular/core';
import { AuthServices } from '../../auth/auth-services';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialog } from '../../dialog/login-dialog/login-dialog';
import { ChangePassword } from '../../dialog/change-password/change-password';
import { UtenteServices } from '../../services/utente-services';
import { Utilities } from '../../services/utilities';
import { RegisterDialog } from '../../dialog/register-dialog/register-dialog';

@Component({
  selector: 'app-area-utente',
  imports: [],
  templateUrl: './area-utente.html',
  styleUrl: './area-utente.css',
})
export class AreaUtente {
  readonly dialog = inject(MatDialog);

   constructor(public auth:AuthServices,
      private routing:Router,
      private utenteServices: UtenteServices,
      private util : Utilities
   ){}
  
  login() {
    this.dialog.open(LoginDialog, {
      width: '400px',
      disableClose: false,
      data: {}
    });
  }

  logout() {
    console.log('logout')
    this.auth.resetAll();
    this.routing.navigate(['/area-utenti']);
  }
  changePWD(){
     this.dialog.open(ChangePassword, {
      width: '400px',
      disableClose: false,
      data: {}
    });
  }

   profile() {
    this.utenteServices.findByUserName(this.auth.grant().userId)
      .subscribe({
        next: ((r: any) => {
          this.util.openDialog(RegisterDialog,
            {
              account: r,
              mode: "U"
            },
            {
              width: '90vw',
              maxWidth: '1200px',
              height: 'auto',
            }
          );
        }),
        error: ((r: any) => {
          console.log("error getAccount:" + r.error.msg);
        })
      })
  }
}
