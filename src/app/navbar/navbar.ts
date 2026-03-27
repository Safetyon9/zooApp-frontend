import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { LoginDialog } from '../dialog/login-dialog/login-dialog';
import { RegisterDialog } from '../dialog/register-dialog/register-dialog';
import { ChangePassword } from '../dialog/change-password/change-password';
import { AuthServices } from '../auth/auth-services';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  standalone: true,
})
export class Navbar {
  isMenuOpen = false;
  authGrant: any;

  private lastScrollY = 0;
  isHidden = false;

  constructor(
    private dialog: MatDialog,
    private auth: AuthServices,
    private router: Router
  ) {
    this.authGrant = this.auth.grant;
  }

  @HostListener('window:scroll') onScroll() {
    const currentScrollY = window.scrollY;
    if (currentScrollY > this.lastScrollY && currentScrollY > 80) {
      this.isHidden = true;
    } else {
      this.isHidden = false;
    }
    this.lastScrollY = currentScrollY;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  openHome(){
    this.router.navigate(['']);
  }

  openLoginDialog() {
    this.dialog.open(LoginDialog, { minWidth: '20%' });
  }

  openRegisterDialog() {
    this.dialog.open(RegisterDialog, { minWidth: '30%' });
  }

  openChangePasswordDialog() {
    this.dialog.open(ChangePassword, { minWidth: '20%' });
  }


  logout() {
    this.auth.logout();
    this.router.navigate(['/']);
  }

  goToUserArea() {
    this.router.navigate(['utente']);
  }

  goToAdminArea() {
    this.router.navigate(['admin']);
  }
}