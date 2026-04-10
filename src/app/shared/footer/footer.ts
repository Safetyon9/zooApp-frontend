import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: false,
  templateUrl: './footer.html',
  styleUrl: './footer.css'
})
export class Footer {

  constructor(private router: Router) {}

  scrollTo(sectionClass: string): void {
    if (this.router.url === '/') {
      setTimeout(() => {
        const el = document.querySelector(`.${sectionClass}`);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    } else {
      this.router.navigate(['/']).then(() => {
        setTimeout(() => {
          const el = document.querySelector(`.${sectionClass}`);
          if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 300);
      });
    }
  }
}