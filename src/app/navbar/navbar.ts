import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialog } from '../dialog/login-dialog/login-dialog';
import { RegisterDialog } from '../dialog/register-dialog/register-dialog';
import { ChangePassword } from '../dialog/change-password/change-password';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  standalone: true,
})
export class Navbar {
  isMenuOpen = false;

  constructor(private dialog: MatDialog) {}

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  openLoginDialog() {
    this.dialog.open(LoginDialog, { width: '400px' });
  }

  openRegisterDialog() {
    this.dialog.open(RegisterDialog, { width: '400px' });
  }

  openChangePasswordDialog() {
    this.dialog.open(ChangePassword, { width: '400px' });
  }
}