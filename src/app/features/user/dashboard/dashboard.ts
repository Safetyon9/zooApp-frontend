import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AuthServices } from '../../../core/services/auth-services';
import { UtenteServices } from '../services/utente-services';
import { Utilities } from '../../../core/utils/utilities';

import { LoginDialog } from '../../auth/dialog/login-dialog/login-dialog';
import { ChangePassword } from '../../auth/dialog/change-password/change-password';
import { RegisterDialog } from '../../auth/dialog/register-dialog/register-dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: false,
})
export class Dashboard {

  constructor(
    public auth: AuthServices,
    private router: Router,
    private utenteServices: UtenteServices,
    private util: Utilities,
    private dialog: MatDialog
  ) {}

  login(): void {
    this.dialog.open(LoginDialog, {
      width: '400px'
    });
  }

  logout(): void {
    this.auth.resetAll();
    this.router.navigate(['utente']);
  }

  changePWD(): void {
    this.dialog.open(ChangePassword, {
      width: '400px'
    });
  }

  profile(): void {
    const userId = this.auth.grant()?.userId;
    if (!userId) return;

    this.utenteServices.findByUserName(userId).subscribe({
      next: (r: any) => {
        this.util.openDialog(
          RegisterDialog,
          { account: r, mode: 'U' },
          { width: '90vw', maxWidth: '1200px', height: 'auto' }
        );
      },
      error: (err: any) => {
        console.error('error getAccount:', err);
      }
    });
  }
}