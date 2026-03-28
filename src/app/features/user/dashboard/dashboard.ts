/*import { Component, inject } from '@angular/core';
import { AuthServices } from '../../../core/services/auth-services';
import { Router, RouterLink, RouterOutlet, RouterLinkActive } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialog } from '../../auth/dialog/login-dialog/login-dialog';
import { ChangePassword } from '../../auth/dialog/change-password/change-password';
import { UtenteServices } from '../services/utente-services';
import { Utilities } from '../../../core/utils/utilities';
import { RegisterDialog } from '../../auth/dialog/register-dialog/register-dialog';
import { MatToolbar } from '@angular/material/toolbar';
import { MatIcon } from "@angular/material/icon";
import { MatMenuModule } from "@angular/material/menu";
import { MatDrawerContainer, MatDrawer, MatDrawerContent } from "@angular/material/sidenav";

import { MatList } from "@angular/material/list";

@Component({
  selector: 'app-dashboard',
  imports: [MatToolbar, MatIcon, MatMenuModule, RouterLink, MatDrawerContainer, MatDrawer, MatList, MatDrawerContent, RouterOutlet, RouterLinkActive],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
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
    this.routing.navigate(['utente']);
  }
  changePWD(){
     this.dialog.open(ChangePassword, {
      width: '400px',
      disableClose: false,
      data: {}
    });
  }

   profile() {
    
    const userId = this.auth.grant().userId;

    if (!userId) {
      return;
    }

    this.utenteServices.findByUserName(userId)
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
*/

import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  standalone: false,
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
}