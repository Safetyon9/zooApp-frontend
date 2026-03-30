import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { ChangePassword } from '../../auth/dialog/change-password/change-password';
import { AuthServices } from '../../../core/services/auth-services';

@Component({
  selector: 'app-navbar-utente',
  templateUrl: './navbar-utente.html',
  styleUrls: ['./navbar-utente.css'],
  standalone: false
})
export class NavbarUtenteComponent {
  @Output() profileSelected = new EventEmitter<void>();
  @Output() homeSelected = new EventEmitter<void>();

  constructor(
    public auth: AuthServices,
    private router: Router,
    private dialog: MatDialog
  ) {}

  goHome(): void {
    this.homeSelected.emit();
  }

  openProfile(): void {
    this.profileSelected.emit();
  }

  changePWD(): void {
    this.dialog.open(ChangePassword, {
      width: '400px'
    });
  }

  logout(): void {
    this.auth.resetAll();
    this.router.navigate(['/utente']);
  }
}