import { ChangeDetectorRef, Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar-ecommerce',
  templateUrl: './navbar-ecommerce.html',
  styleUrl: './navbar-ecommerce.css',
  standalone: false,
})
export class NavbarEcommerce {
  searchQuery = '';
  isMerch = false;

  constructor(
    private router: Router, 
    private cdr: ChangeDetectorRef
  ) {
    this.router.events.subscribe(() => {
      this.isMerch = this.router.url.includes('/shop/merch');
      this.cdr.detectChanges();
    });
  }

  isMerchPage(): boolean {
    return this.isMerch;
  }

  onSearch() {
  }
}
