import { Component } from '@angular/core';

@Component({
  selector: 'app-user-layout',
  templateUrl: './user-layout.html',
  styleUrls: ['./user-layout.css'],
  standalone: false
})
export class UserLayoutComponent {
  showProfile = false;

  showHomeSection(): void {
    this.showProfile = false;
  }

  showProfileSection(): void {
    this.showProfile = true;
  }
}