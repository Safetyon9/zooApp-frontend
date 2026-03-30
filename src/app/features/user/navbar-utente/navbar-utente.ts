import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { ChangePassword } from '../../auth/dialog/change-password/change-password';
import { UtenteServices } from '../services/utente-services';
import { RegisterDialog } from '../../auth/dialog/register-dialog/register-dialog';
import { AuthServices } from '../../../core/services/auth-services';
import { Utilities } from '../../../core/utils/utilities';

@Component({
  selector: 'app-navbar-utente',
  templateUrl: './navbar-utente.html',
  styleUrls: ['./navbar-utente.css'],
  standalone:false
})
export class NavbarUtenteComponent {
  constructor(
    public auth: AuthServices,
    private router: Router,
    private dialog: MatDialog,
    private utenteServices: UtenteServices,
    private util: Utilities
  ) {}

  goHome(): void {
    this.router.navigate(['']);
  }

  changePWD(): void {
    this.dialog.open(ChangePassword, {
      width: '400px'
    });
  }


  logout(): void {
    this.auth.resetAll();
    this.router.navigate(['']);
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