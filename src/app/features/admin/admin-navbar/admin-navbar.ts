import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AuthServices } from '../../../core/services/auth-services';
import { UtenteServices } from '../../../core/services/utente-services';

@Component({
  selector: 'app-admin-navbar',
  standalone: false,
  templateUrl: './admin-navbar.html',
  styleUrl: './admin-navbar.css',
})

export class AdminNavbar {
  @Output() profileSelected = new EventEmitter<void>();
  @Output() homeSelected = new EventEmitter<void>();

  constructor(
    public auth: AuthServices,
    private router: Router,
    private utenteServices: UtenteServices,
    private dialog: MatDialog
  ) {}

  goHome(): void {
    this.router.navigate(['/']);
  }

  openGestioneUtenti(): void {
    this.router.navigate(['/admin/utenti']);
  }

  openGestioneItems(): void {
    this.router.navigate(['/admin/items']);
  }

  openGestioneEventi(): void {
    this.router.navigate(['/admin/eventi']);
  }

  openGestioneOrdini(): void {
    this.router.navigate(['/admin/ordini']);
  }

  changePWD(): void {
    this.router.navigate(['/admin/modify']);
  }

  logout() {
    const userName = localStorage.getItem('userId');

    if (!userName) {
      this.auth.logout();
      this.router.navigate(['/']);
      return;
    }

    this.utenteServices.logout(userName).subscribe({
      next: () => {
        this.auth.logout();
        this.router.navigate(['/']);
      },
      error: () => {
        this.auth.logout();
        this.router.navigate(['/']);
      }
    });
  }
}