import { Component, Input, OnInit } from '@angular/core';
import { AuthServices } from '../../../core/services/auth-services';
import { UtenteServices } from '../../../shared/services/utente-services';
import { Utilities } from '../../../core/utils/utilities';
import { ChangeDetectorRef } from '@angular/core';
import { RegisterDialog } from '../../auth/dialog/register-dialog/register-dialog';

@Component({
  selector: 'app-info',
  standalone: false,
  templateUrl: './info.html',
  styleUrl: './info.css',
})
export class Info implements OnInit{
  @Input() showProfileSection: boolean = false;

  profilo: any = {};

  constructor(
    public auth: AuthServices,
    private utenteServices: UtenteServices,
    private util: Utilities,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    const userId = this.auth.grant()?.userId;
    if (!userId) return;

    this.utenteServices.findAllByUserName(userId).subscribe({
      next: (r: any) => {
        console.log('PROFILO BACKEND:', JSON.stringify(r));

        this.profilo = {
          nome: r.nome ?? r.name ?? r.firstName ?? '',
          cognome: r.cognome ?? r.surname ?? r.lastName ?? '',
          email: r.email ?? '',
          telefono: r.telefono ?? r.phone ?? '',
          username: r.username ?? r.userName ?? ''
        };
        this.cdr.detectChanges();
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