import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

import { AuthServices } from '../../../core/services/auth-services';

@Component({

  selector: 'app-navbar-utente',
  templateUrl: './navbar-utente.html',
  styleUrls: ['./navbar-utente.css'],
  standalone: false
})
export class NavbarUtente {

  constructor(
    public auth: AuthServices,
    private router: Router,
    private dialog: MatDialog
  ) {}

  goHome(): void {
    this.router.navigate(['']);
  }

  openProfile(): void {
     this.router.navigate(['']);
  }

  changePWD(): void {
    this.router.navigate(['']);
  }

  logout(): void {
    this.auth.resetAll();
    this.router.navigate(['']);
  }
}