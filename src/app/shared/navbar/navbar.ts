import { Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { LoginDialog } from '../../features/auth/dialog/login-dialog/login-dialog';
import { RegisterDialog } from '../../features/auth/dialog/register-dialog/register-dialog';
import { ChangePassword } from '../../features/auth/dialog/change-password/change-password';
import { AuthServices } from '../../core/services/auth-services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  standalone: false,
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
    this.isHidden = currentScrollY > this.lastScrollY && currentScrollY > 80;
    this.lastScrollY = currentScrollY;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  openHome() {
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

  scrollToDonation() {
    const element = document.getElementById('donation-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          const el = document.getElementById('donation-section');
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      });
    }
  }
}