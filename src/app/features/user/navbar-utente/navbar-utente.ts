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
     this.router.navigate(['utente']);
  }

  changePWD(): void {
    this.router.navigate(['utente/modify']);
  }

  viewOrder(): void {
    this.router.navigate(['utente/ordini']);
  }

  logout(): void {
    this.auth.resetAll();
    this.router.navigate(['']);
  }

  delete(): void{
    
  }
}