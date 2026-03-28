/*import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AuthServices } from '../../../core/services/auth-services';
import { Router, RouterOutlet, RouterLinkActive, RouterLink } from '@angular/router';
import { UtenteServices } from '../../user/services/utente-services';
import { Utilities } from '../../../core/utils/utilities';
import { LoginDialog } from '../../auth/dialog/login-dialog/login-dialog';
import { ChangePassword } from '../../auth/dialog/change-password/change-password';
import { RegisterDialog } from '../../auth/dialog/register-dialog/register-dialog';
import { MatDrawer, MatDrawerContent, MatDrawerContainer } from "@angular/material/sidenav";
import { MatListItem, MatList } from "@angular/material/list";
import { MatIcon } from "@angular/material/icon";
import { MatMenu, MatMenuTrigger } from "@angular/material/menu";
import { MatToolbar } from "@angular/material/toolbar";

@Component({
  selector: 'app-admin-dashboard',
  imports: [RouterOutlet, MatDrawer, MatDrawerContent, MatListItem, MatList, MatDrawerContainer, RouterLinkActive, MatIcon, RouterLink, MatMenu, MatMenuTrigger, MatToolbar],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AreaAdmin {
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
  selector: 'app-admin-dashboard',
  standalone: false,
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard {
}