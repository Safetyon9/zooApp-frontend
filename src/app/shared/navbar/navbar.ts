import { ChangeDetectorRef, Component, HostListener } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { LoginDialog } from '../../features/auth/dialog/login-dialog/login-dialog';
import { RegisterDialog } from '../../features/auth/dialog/register-dialog/register-dialog';
import { AuthServices } from '../../core/services/auth-services';
import { CartService } from '../../core/services/cart-service';

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

  isShop = false;
  searchQuery = '';

  constructor(
    private dialog: MatDialog,
    private auth: AuthServices,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private cartS: CartService
  ) {
    this.authGrant = this.auth.grant;
    this.router.events.subscribe(() => {
      this.isShop = this.router.url.startsWith('/shop');
      this.cdr.detectChanges();
    });
  }

  isMerchPage(): boolean {
    return this.router.url.includes('/merch');
  }

  onSearch() {
  }

  get cartCount() {
    return this.cartS.totalCount();
  }

  isShopPage(): boolean {
    return this.isShop;
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
    this.scrollToSection('donation-section');
  }

  scrollToEventi() {
    this.scrollToSection('eventi-section');
  }

  scrollToNews() {
    this.scrollToSection('news-section');
  }

  private scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          const el = document.getElementById(id);
          el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      });
    }
  }
}