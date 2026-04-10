import { ChangeDetectorRef, Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

import { LoginDialog } from '../../features/auth/dialog/login-dialog/login-dialog';
import { RegisterDialog } from '../../features/auth/dialog/register-dialog/register-dialog';
import { AuthServices } from '../../core/services/auth-services';
import { CartService } from '../../core/services/cart-service';
import { UtenteServices } from '../../core/services/utente-services';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.css'],
  standalone: false,
})
export class Navbar {

  isMenuOpen = false;
  isHidden = false;
  isShop = false;
  searchQuery = '';

  authGrant: any;

  private lastScrollY = 0;
  private listenerAttached = false;

  constructor(
    private dialog: MatDialog,
    private auth: AuthServices,
    private router: Router,
    private cdr: ChangeDetectorRef,
    private cartS: CartService,
    private utenteServices: UtenteServices,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.authGrant = this.auth.grant;

    this.router.events.subscribe(() => {
      this.isShop = this.router.url.startsWith('/shop');
      this.cdr.detectChanges();
    });
  }

  ngAfterViewInit() {

    if (!isPlatformBrowser(this.platformId)) return;

    if (this.listenerAttached) return;
    this.listenerAttached = true;

    const el = document.body;

    el.addEventListener('scroll', () => {

      const y = el.scrollTop;
      const delta = y - this.lastScrollY;

      const threshold = 8;

      if (y < 80) {
        this.isHidden = false;
      } else if (delta > threshold) {
        this.isHidden = true;
      } else if (delta < -threshold) {
        this.isHidden = false;
      }

      this.lastScrollY = y;

      this.cdr.detectChanges();
    });
  }

  isMerchPage(): boolean {
    return this.router.url.includes('/merch');
  }

  get cartCount() {
    return this.cartS.totalCount();
  }

  isShopPage(): boolean {
    return this.isShop;
  }

  toggleMenu() {
    this.isMenuOpen = !this.isMenuOpen;
  }

  closeMenu() {
    this.isMenuOpen = false;
  }

  onSearch() {}

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

  goToUserArea() {
    this.router.navigate(['utente']);
  }

  goToAdminArea() {
    this.router.navigate(['admin']);
  }

  goToCarrello() {
    this.router.navigate(['carrello']);
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
          document.getElementById(id)
            ?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
      });
    }
  }
}