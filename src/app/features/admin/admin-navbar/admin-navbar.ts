import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AuthServices } from '../../../core/services/auth-services';
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
    private dialog: MatDialog
  ) {}

  goHome(): void {
    this.homeSelected.emit();
  }

  openGestioneUtenti(): void {
    this.router.navigate(['/admin/utenti']);
  }

  changePWD(): void {
    this.router.navigate(['']);
  }

  logout(): void {
    this.auth.resetAll();
    this.router.navigate(['']);
  }
}