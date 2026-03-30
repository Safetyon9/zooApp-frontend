import { Component, Input, OnInit } from '@angular/core';
import { AuthServices } from '../../../core/services/auth-services';
import { UtenteServices } from '../services/utente-services';
import { Utilities } from '../../../core/utils/utilities';
import { RegisterDialog } from '../../auth/dialog/register-dialog/register-dialog';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: false
})
export class Dashboard implements OnInit {
  @Input() showProfileSection: boolean = false;

  profilo: any = {};

  constructor(
    public auth: AuthServices,
    private utenteServices: UtenteServices,
    private util: Utilities
  ) {}

  ngOnInit(): void {
    const userId = this.auth.grant()?.userId;
    if (!userId) return;

    this.utenteServices.findByUserName(userId).subscribe({
      next: (r: any) => {
        this.profilo = r;
      },
      error: (err: any) => {
        console.error('error getAccount:', err);
      }
    });
  }

  modificaProfilo(): void {
    this.util.openDialog(
      RegisterDialog,
      { account: this.profilo, mode: 'U' },
      { width: '90vw', maxWidth: '1200px', height: 'auto' }
    );
  }
}